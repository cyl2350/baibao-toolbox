// 引流页「标记已发」流程测试:点击后写 localStorage,今日卡片变为已发状态
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

const html = readFileSync('docs/闲鱼AI代运营工作台/工作台.html', 'utf8')
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true })
const { document, localStorage } = dom.window

// 模拟今天是发文日(周二/周四/周六)并不现实,直接验证按钮与标记逻辑:
const firstMarkBtn = document.querySelector('#xhs-notes button[data-xhs]')
if (!firstMarkBtn) { console.log('FAIL: no mark button'); process.exit(1) }
const no = firstMarkBtn.getAttribute('data-xhs')
firstMarkBtn.click()
const saved = JSON.parse(localStorage.getItem('xy-xhs-posted') || '[]')
console.log('clicked mark no=' + no + ', saved records:', saved.length)
if (!saved.some((r) => r.no === Number(no))) { console.log('FAIL: not saved'); process.exit(1) }

// 重渲染后该卡片应显示「近 14 天已发」且按钮消失
const cardAfter = Array.from(document.querySelectorAll('#xhs-notes .card')).find((c) => c.textContent.includes('第 ' + no + ' 条'))
if (!cardAfter) { console.log('FAIL: card gone'); process.exit(1) }
const hasBadge = cardAfter.textContent.includes('近 14 天已发')
const hasBtn = !!cardAfter.querySelector('button[data-xhs]')
console.log('badge shown:', hasBadge, '| mark button removed:', !hasBtn)
if (!hasBadge || hasBtn) { console.log('FAIL: re-render state wrong'); process.exit(1) }
console.log('XHS MARK FLOW PASS ✔')
