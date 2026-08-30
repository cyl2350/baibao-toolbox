// ============================================================
// 生成闲鱼/小红书 详情图素材包(每款产品 4 张 750x1000 PNG)
// 用法: node scripts/gen-listing-images.mjs
// 依赖: npm i -D @napi-rs/canvas
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'

const root = dirname(fileURLToPath(import.meta.url)) + '/..'
const fontPath = 'C:/Windows/Fonts/simhei.ttf'
if (existsSync(fontPath)) GlobalFonts.registerFromPath(fontPath, 'SimHei')

const W = 750, H = 1000
const C = {
  primary: '#4f6ef7', accent: '#8b5cf6', dark: '#1f2430', muted: '#6b7280',
  lightBg: '#f2f5ff', line: '#e5e7eb', white: '#ffffff',
}

function canvas() {
  const c = createCanvas(W, H)
  return { c, ctx: c.getContext('2d') }
}

function font(ctx, size, weight = '') {
  ctx.font = `${weight} ${size}px SimHei, sans-serif`
}

// 按字符换行(中文安全)
function wrapText(ctx, text, maxWidth) {
  const lines = []
  for (const raw of String(text).split('\n')) {
    if (!raw) { lines.push(''); continue }
    let line = ''
    for (const ch of raw) {
      if (ctx.measureText(line + ch).width > maxWidth && line) { lines.push(line); line = ch }
      else line += ch
    }
    lines.push(line)
  }
  return lines
}

function drawHeader(ctx, title, subtitle) {
  const grad = ctx.createLinearGradient(0, 0, W, 220)
  grad.addColorStop(0, C.primary)
  grad.addColorStop(1, C.accent)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, 220)
  font(ctx, 20)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText('百宝工具箱 · 原创出品', 40, 48)
  const tSize = title.length > 12 ? 34 : 40
  font(ctx, tSize, 'bold')
  ctx.fillStyle = C.white
  let ty = 92
  for (const line of wrapText(ctx, title, W - 80)) {
    ctx.fillText(line, 40, ty)
    ty += tSize + 10
  }
  font(ctx, 18)
  ctx.fillStyle = '#e8edff'
  ctx.fillText(subtitle, 40, ty + 12)
}

function drawFooter(ctx, pageLabel) {
  font(ctx, 16)
  ctx.fillStyle = C.muted
  ctx.fillText('百宝工具箱 出品 · 2025', 40, H - 44)
  ctx.fillStyle = C.primary
  ctx.fillText(pageLabel, W - 40 - ctx.measureText(pageLabel).width, H - 44)
}

// 卡片列表
function drawCardList(ctx, items, startY, maxRows, icon) {
  let y = startY
  let shown = 0
  for (const item of items) {
    if (shown >= maxRows) break
    const boxH = 62
    if (y + boxH > H - 70) break
    ctx.fillStyle = C.white
    ctx.beginPath()
    ctx.roundRect(40, y, W - 80, boxH - 8, 12)
    ctx.fill()
    ctx.strokeStyle = C.line
    ctx.lineWidth = 1
    ctx.stroke()
    // 序号圆
    ctx.fillStyle = C.primary
    ctx.beginPath()
    ctx.arc(72, y + 26, 15, 0, Math.PI * 2)
    ctx.fill()
    font(ctx, 15)
    ctx.fillStyle = C.white
    ctx.fillText(String(item.num), 66, y + 31)
    // 文本(截断两行)
    font(ctx, 15)
    ctx.fillStyle = C.dark
    const text = (item.lead ? item.lead + ':' : '') + item.rest
    const lines = wrapText(ctx, text, W - 80 - 60 - 20).slice(0, 2)
    let ly = y + 20
    for (const line of lines) {
      ctx.fillText(line, 100, ly)
      ly += 22
    }
    y += boxH
    shown++
  }
  return y
}

function parseMd(text) {
  const blocks = []
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t === '---') continue
    let m
    if ((m = t.match(/^# (.*)/))) blocks.push({ type: 'title', text: m[1] })
    else if ((m = t.match(/^## (.*)/))) blocks.push({ type: 'section', text: m[1] })
    else if ((m = t.match(/^> (.*)/))) blocks.push({ type: 'note', text: m[1] })
    else if ((m = t.match(/^(\d+)\.\s*(.*)/))) {
      const lead = m[2].match(/^\*\*([^*]+)\*\*/)
      blocks.push({ type: 'item', num: parseInt(m[1], 10), text: m[2], lead: lead ? lead[1] : null, rest: m[2].replace(/^\*\*[^*]+\*\*/, '') })
    }
    else blocks.push({ type: 'para', text: t })
  }
  return blocks
}

function save(c, path) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, c.toBuffer('image/png'))
  console.log('  ✓ ' + basename(path))
}

function savePng({ c, ctx }, path) { save(c, path) }

// ---------- 生成 ----------
const products = [
  { md: 'docs/产品/AI提示词实战手册.md', out: 'docs/产品/详情图/ai提示词手册', short: 'AI 提示词实战手册' },
  { md: 'docs/产品/小红书爆款文案模板库.md', out: 'docs/产品/详情图/小红书文案模板', short: '小红书爆款文案模板库' },
  { md: 'docs/产品/简历模板+面试话术包.md', out: 'docs/产品/详情图/简历面试话术包', short: '简历模板 + 面试话术包' },
]

for (const p of products) {
  const blocks = parseMd(readFileSync(join(root, p.md), 'utf8'))
  const title = blocks.find((b) => b.type === 'title').text
  const sections = blocks.filter((b) => b.type === 'section').map((b) => b.text)
  const items = blocks.filter((b) => b.type === 'item')
  const itemCount = items.length
  console.log(`生成 ${p.short} ...`)

  // 封面
  {
    const { c, ctx } = canvas()
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, C.primary)
    grad.addColorStop(1, C.accent)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    font(ctx, 22)
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText('百宝工具箱 · 原创资料', 40, 60)
    // 标题(大)
    font(ctx, 46, 'bold')
    ctx.fillStyle = C.white
    let ty = 260
    for (const line of wrapText(ctx, title, W - 100)) {
      ctx.fillText(line, 50, ty)
      ty += 60
    }
    font(ctx, 22)
    ctx.fillStyle = '#e8edff'
    ctx.fillText(`${itemCount} 个即用模板 · 下载即用`, 50, ty + 30)
    // 章节徽标
    let cx = 50
    const chipY = H - 320
    font(ctx, 18)
    sections.slice(0, 6).forEach((s) => {
      const label = s.replace(/^[一二三四五六七八九十]+、/, '').slice(0, 5)
      const w = ctx.measureText(label).width + 44
      if (cx + w > W - 30) return
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.beginPath()
      ctx.roundRect(cx, chipY, w, 44, 22)
      ctx.fill()
      ctx.fillStyle = C.white
      ctx.fillText(label, cx + 22 - ctx.measureText(label).width / 2, chipY + 29)
      cx += w + 16
    })
    font(ctx, 20)
    ctx.fillStyle = '#e8edff'
    ctx.fillText('✔ 成品 PDF · 手机电脑可看 · 网盘发货', 50, H - 150)
    ctx.fillText('✔ 原创整理 · 可商用', 50, H - 116)
    savePng({ c, ctx }, join(root, `${p.out}/封面.png`))
  }

  // 目录页
  {
    const { c, ctx } = canvas()
    ctx.fillStyle = C.lightBg
    ctx.fillRect(0, 0, W, H)
    drawHeader(ctx, title, '完整目录 · 内容一览')
    let y = 260
    font(ctx, 18)
    ctx.fillStyle = C.dark
    sections.forEach((s) => {
      const label = s.replace(/^[一二三四五六七八九十]+、/, '')
      if (y + 50 > H - 80) return
      ctx.fillStyle = C.white
      ctx.beginPath()
      ctx.roundRect(40, y, W - 80, 44, 10)
      ctx.fill()
      ctx.fillStyle = C.primary
      ctx.fillRect(40, y + 12, 5, 20)
      ctx.fillStyle = C.dark
      ctx.fillText(label, 64, y + 30)
      y += 52
    })
    drawFooter(ctx, '目录')
    savePng({ c, ctx }, join(root, `${p.out}/目录.png`))
  }

  // 内容展示 1(前 8 条)
  {
    const { c, ctx } = canvas()
    ctx.fillStyle = C.lightBg
    ctx.fillRect(0, 0, W, H)
    drawHeader(ctx, title, '内页实拍 · 每条都是完整模板')
    drawCardList(ctx, items.slice(0, 8), 250, 8)
    drawFooter(ctx, '内容展示 1/2')
    savePng({ c, ctx }, join(root, `${p.out}/内容展示1.png`))
  }

  // 内容展示 2(接下来 8 条)+ 卖点
  {
    const { c, ctx } = canvas()
    ctx.fillStyle = C.lightBg
    ctx.fillRect(0, 0, W, H)
    drawHeader(ctx, title, '内页实拍 · 拿来就能用')
    const yEnd = drawCardList(ctx, items.slice(8, 16), 250, 8)
    // 卖点区
    let y = Math.max(yEnd + 8, 780)
    font(ctx, 18)
    ctx.fillStyle = C.dark
    const points = ['✔ 打开即用,无需基础', '✔ 支持任意主流 AI 工具', '✔ 一次购买,永久有效']
    points.forEach((pt) => {
      ctx.fillStyle = C.white
      ctx.beginPath()
      ctx.roundRect(40, y, W - 80, 40, 10)
      ctx.fill()
      ctx.fillStyle = C.primary
      ctx.fillText(pt, 60, y + 27)
      y += 48
    })
    drawFooter(ctx, '内容展示 2/2')
    savePng({ c, ctx }, join(root, `${p.out}/内容展示2.png`))
  }
}

// 三合一资料包封面
{
  const { c, ctx } = canvas()
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#16a34a')
  grad.addColorStop(1, '#0d9488')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
  font(ctx, 22)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillText('百宝工具箱 · 超值资料包', 40, 60)
  font(ctx, 48, 'bold')
  ctx.fillStyle = C.white
  ctx.fillText('职场效率', 50, 250)
  ctx.fillText('资料包 3 合 1', 50, 320)
  font(ctx, 22)
  ctx.fillStyle = '#d1fae5'
  ctx.fillText('AI 提示词手册 + 小红书文案模板 + 简历面试话术', 50, 400)
  const rows = [
    '① AI 提示词实战手册(60 模板)',
    '② 小红书爆款文案模板库(50 模板)',
    '③ 简历模板 + 面试话术包(20 题)',
  ]
  let y = 500
  font(ctx, 24)
  rows.forEach((r) => {
    ctx.fillStyle = 'rgba(255,255,255,0.16)'
    ctx.beginPath()
    ctx.roundRect(50, y, W - 100, 58, 12)
    ctx.fill()
    ctx.fillStyle = C.white
    ctx.fillText(r, 80, y + 38)
    y += 76
  })
  font(ctx, 24, 'bold')
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(50, H - 220, W - 100, 64, 14)
  ctx.fill()
  ctx.fillStyle = '#0d9488'
  ctx.fillText('限时特价 ¥9.9 · 单买共 ¥12+', 50 + (W - 100) / 2 - ctx.measureText('限时特价 ¥9.9 · 单买共 ¥12+').width / 2, H - 180)
  font(ctx, 18)
  ctx.fillStyle = '#d1fae5'
  ctx.fillText('网盘自动发货 · 售后答疑', 50 + (W - 100) / 2 - ctx.measureText('网盘自动发货 · 售后答疑').width / 2, H - 140)
  savePng({ c, ctx }, join(root, 'docs/产品/详情图/资料包3合1封面.png'))
}

console.log('✔ 详情图素材包生成完毕')
