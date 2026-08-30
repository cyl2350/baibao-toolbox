// ============================================================
// 全站工具运行时冒烟测试:用 jsdom 逐个加载工具页并模拟点击
// 用法: node scripts/test-tools.mjs [工具id]
// ============================================================
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { webcrypto } from 'node:crypto'
import { JSDOM } from 'jsdom'

const root = process.cwd()
const dist = join(root, 'dist')
const only = process.argv[2] || null

// ---------- jsdom 环境与桩 ----------
function makeDom(html) {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'http://localhost/',
    beforeParse(window) {
      // crypto
      Object.defineProperty(window, 'crypto', { value: webcrypto, configurable: true })
      // canvas 桩
      const noopCtx = new Proxy({}, {
        get(t, k) {
          if (k === 'canvas') return {}
          if (k === 'createLinearGradient') return () => ({ addColorStop() {} })
          if (k === 'measureText') return () => ({ width: 10 })
          return typeof k === 'string' ? (() => {}) : undefined
        },
        set: () => true,
      })
      if (window.HTMLCanvasElement) {
        window.HTMLCanvasElement.prototype.getContext = function () { return noopCtx }
        window.HTMLCanvasElement.prototype.toBlob = function (cb) { cb(null) }
      }
      // FileReader 桩
      window.FileReader = class {
        readAsDataURL() { if (this.onload) this.onload({ target: { result: 'data:image/png;base64,AAA=' } }) }
        readAsText() { if (this.onload) this.onload({ target: { result: 'test' } }) }
      }
      // 语音合成桩
      window.speechSynthesis = { getVoices: () => [], cancel() {}, speak() {} }
      window.SpeechSynthesisUtterance = class {}
      // matchMedia
      window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} })
      // 剪贴板
      if (window.navigator) window.navigator.clipboard = { writeText: async () => {}, }
      // localStorage(jsdom 自带,确认可用)
      // URL(jsdom 自带)
    },
  })
  return dom
}

// ---------- 读取并执行页面脚本 ----------
function execScripts(dom, html) {
  const w = dom.window
  const errors = []
  w.addEventListener('error', (e) => errors.push(String(e.message || e.error)))
  const vm = (code) => {
    try { w.eval(code) } catch (e) { errors.push(String(e && e.message ? e.message : e)) }
  }
  // 收集内联脚本(跳过 SITE_CONFIG 与 JSON-LD)
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  for (const code of scripts) {
    if (code.includes('application/ld+json')) continue
    if (code.includes('window.SITE_CONFIG')) continue
    vm(code)
  }
  return errors
}

// 执行 vendor 库(供工具脚本使用)
function loadVendor(dom, names) {
  const w = dom.window
  for (const n of names) {
    const p = join(root, 'vendor', n)
    if (existsSync(p)) {
      try { w.eval(readFileSync(p, 'utf8')) } catch (e) { console.log('  vendor 加载失败', n, e.message) }
    }
  }
}

const VENDOR_MAP = {
  qrcode: ['qrcode.js'],
  md5: ['md5.min.js'],
  markdown: ['marked.min.js'],
  'text-diff': ['diff.min.js'],
  barcode: ['JsBarcode.all.min.js'],
  'qr-decode': ['jsQR.js'],
}

// ---------- 主流程 ----------
const toolIds = readdirSync(dist).filter((n) => {
  const p = join(dist, n)
  return statSync(p).isDirectory() && existsSync(join(p, 'index.html')) &&
    !['css', 'js', 'vendor', 'articles', 'privacy', 'about', 'disclaimer'].includes(n)
}).filter((n) => !only || n === only)

let pass = 0, fail = 0
const failures = []

for (const id of toolIds) {
  const html = readFileSync(join(dist, id, 'index.html'), 'utf8')
  const dom = makeDom(html)
  const w = dom.window
  loadVendor(dom, VENDOR_MAP[id] || [])
  const errors = execScripts(dom, html)
  // 注入公共方法
  w.bbToast = () => {}
  w.bbCopy = () => {}
  w.bbDownload = () => {}
  w.bbToast = () => {}
  // 再执行工具脚本(公共方法现在可用;顺序:脚本可能已执行,但公共方法仅在被调用时使用,无碍)

  // 模拟点击所有按钮
  if (!errors.length) {
    const buttons = [...w.document.querySelectorAll('button')]
    for (const btn of buttons) {
      try { btn.click() } catch (e) { errors.push(`点击 ${btn.textContent || btn.id} 出错: ${e.message}`) }
    }
    // 再触发一次 input 事件(实时统计类)
    const textareas = [...w.document.querySelectorAll('textarea')]
    for (const ta of textareas) {
      try {
        const ev = new w.Event('input', { bubbles: true })
        ta.dispatchEvent(ev)
      } catch (e) { /* ignore */ }
    }
  }

  if (errors.length) {
    fail++
    failures.push({ id, errors })
    console.log(`❌ ${id}:`)
    errors.slice(0, 4).forEach((e) => console.log('   - ' + e))
  } else {
    pass++
    console.log(`✅ ${id}`)
  }
  dom.window.close()
}

console.log(`\n========== 结果:通过 ${pass} / 失败 ${fail} ==========`)
if (fail) {
  console.log('失败工具:')
  failures.forEach((f) => console.log('  ❌ ' + f.id))
  process.exit(1)
}
