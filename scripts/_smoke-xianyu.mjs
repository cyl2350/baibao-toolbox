// 工作台 HTML 冒烟测试:jsdom 加载 + 内联脚本执行 + 断言各页渲染
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

const html = readFileSync('docs/闲鱼AI代运营工作台/工作台.html', 'utf8')
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' })
const { document } = dom.window

const errors = []
dom.window.addEventListener('error', (e) => errors.push(String(e.error || e.message)))

// 上架页:6 张卡片
const listingCards = document.querySelectorAll('#panel-listing .card').length
// 话术页:chips = 全部 + 7 类;列表条目 = 9 条
const chips = document.querySelectorAll('#reply-chips .chip').length
const replyItems = document.querySelectorAll('#reply-list .card').length
// 任务页:任务条目 = 10
const tasks = document.querySelectorAll('#task-groups .task').length
// 台账:产品下拉 = 6
const options = document.querySelectorAll('#ledger-product option').length
// 引流页:今日卡片 ≥1,计划表 12 行(4 周 × 3),笔记卡 10 张
const xhsToday = document.querySelectorAll('#xhs-today .card').length
const xhsPlanRows = document.querySelectorAll('#xhs-plan tr').length - 1
const xhsNotes = document.querySelectorAll('#xhs-notes .card').length
// 多平台页:6 张产品卡,每张 4 个平台字段 = 24
const multiCards = document.querySelectorAll('#multi-list .card').length
const multiFields = document.querySelectorAll('#multi-list .field').length
// 导航按钮 = 6
const navBtns = document.querySelectorAll('nav button').length

console.log('listing cards:', listingCards)
console.log('reply chips:', chips, '| reply items:', replyItems)
console.log('task items:', tasks)
console.log('ledger product options:', options)
console.log('xhs today cards:', xhsToday, '| plan rows:', xhsPlanRows, '| notes:', xhsNotes)
console.log('multi cards:', multiCards, '| fields:', multiFields)
console.log('nav buttons:', navBtns)

let pass = true
if (listingCards !== 6) { console.log('FAIL: listing cards'); pass = false }
if (chips !== 8) { console.log('FAIL: chips'); pass = false }
if (replyItems !== 9) { console.log('FAIL: reply items'); pass = false }
if (tasks !== 10) { console.log('FAIL: tasks'); pass = false }
if (options !== 6) { console.log('FAIL: product options'); pass = false }
if (xhsToday < 1) { console.log('FAIL: xhs today'); pass = false }
if (xhsPlanRows !== 12) { console.log('FAIL: plan rows'); pass = false }
if (xhsNotes !== 10) { console.log('FAIL: xhs notes'); pass = false }
if (multiCards !== 6) { console.log('FAIL: multi cards'); pass = false }
if (multiFields !== 24) { console.log('FAIL: multi fields'); pass = false }
if (navBtns !== 6) { console.log('FAIL: nav buttons'); pass = false }
if (errors.length) { console.log('JS errors:', errors); pass = false }
console.log(pass ? 'ALL PASS ✔' : 'FAILURES ✘')
process.exit(pass ? 0 : 1)
