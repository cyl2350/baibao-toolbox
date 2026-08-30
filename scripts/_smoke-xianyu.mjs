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

console.log('listing cards:', listingCards)
console.log('reply chips:', chips, '| reply items:', replyItems)
console.log('task items:', tasks)
console.log('ledger product options:', options)

let pass = true
if (listingCards !== 6) { console.log('FAIL: listing cards'); pass = false }
if (chips !== 8) { console.log('FAIL: chips'); pass = false }
if (replyItems !== 9) { console.log('FAIL: reply items'); pass = false }
if (tasks !== 10) { console.log('FAIL: tasks'); pass = false }
if (options !== 6) { console.log('FAIL: product options'); pass = false }
if (errors.length) { console.log('JS errors:', errors); pass = false }
console.log(pass ? 'ALL PASS ✔' : 'FAILURES ✘')
process.exit(pass ? 0 : 1)
