// ============================================================
// 闲鱼周报自动生成器
// 用法: node scripts/xianyu-weekly.mjs            (本周)
//       node scripts/xianyu-weekly.mjs 2026-08-24 (指定周一起始日)
//       node scripts/xianyu-weekly.mjs "" 台账.csv (指定台账文件)
// 读取: docs/闲鱼AI代运营工作台/销售台账.csv
// 输出: 控制台周报 + 建议(可复制到工作台/备忘录)
// ============================================================
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const csvPath = process.argv[3] ? join(root, process.argv[3]) : join(root, 'docs/闲鱼AI代运营工作台/销售台账.csv')

if (!existsSync(csvPath)) {
  console.log('没有找到台账文件,先运行 node scripts/gen-xianyu-kit.mjs')
  process.exit(1)
}

const rows = readFileSync(csvPath, 'utf8')
  .replace(/^\uFEFF/, '')
  .split(/\r?\n/)
  .filter((l, i) => i > 0 && l.trim())
  .map((l) => {
    const [date, product, price, note] = l.split(',')
    return { date: (date || '').trim(), product: (product || '').trim().replace(/^"|"$/g, ''), price: parseFloat(price) || 0, note: (note || '').trim() }
  })
  .filter((r) => r.date && r.price > 0)

// 周范围:本周一 00:00 → 下周一 00:00(参数非法时回退本周)
const arg = process.argv[2]
const parsed = arg ? new Date(arg + 'T00:00:00') : null
const monday = parsed && !isNaN(parsed) ? parsed : (() => {
  const d = new Date(); const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1); d.setHours(0, 0, 0, 0); return d
})()
const nextMonday = new Date(monday); nextMonday.setDate(monday.getDate() + 7)

const inWeek = rows.filter((r) => {
  const d = new Date(r.date + 'T00:00:00')
  return d >= monday && d < nextMonday
})

const byProduct = {}
inWeek.forEach((r) => { byProduct[r.product] = byProduct[r.product] || { count: 0, sum: 0 }; byProduct[r.product].count++; byProduct[r.product].sum += r.price })

const total = inWeek.reduce((s, r) => s + r.price, 0)
const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

console.log(`📊 闲鱼周报(${fmt(monday)} ~ ${fmt(new Date(nextMonday.getTime() - 86400000))})`)
console.log('='.repeat(40))
console.log(`本周成交:${inWeek.length} 单 · 合计 ¥${total.toFixed(1)} · 客单价 ¥${inWeek.length ? (total / inWeek.length).toFixed(1) : 0}`)
if (!inWeek.length) {
  console.log('\n⚠️ 本周还没有成交记录:')
  console.log('  1) 检查商品是否每天擦亮(曝光决定一切)')
  console.log('  2) 检查询价回复是否够快(<10 分钟)')
  console.log('  3) 尝试把无流量的款降价到跑量价,或换首图')
  process.exit(0)
}
console.log('\n按产品:')
Object.entries(byProduct).sort((a, b) => b[1].sum - a[1].sum).forEach(([name, v]) => {
  console.log(`  · ${name}: ${v.count} 单 / ¥${v.sum.toFixed(1)}`)
})
console.log('\n💡 AI 建议:')
const top = Object.entries(byProduct).sort((a, b) => b[1].count - a[1].count)[0]
console.log(`  · 卖得最好的「${top[0]}」下周重点擦亮,可尝试上调 ¥1 试水`)
Object.entries(byProduct).sort((a, b) => a[1].count - b[1].count).slice(0, 1).forEach(([name]) => {
  console.log(`  · 「${name}」成交最少:换标题关键词或降价到跑量价`)
})
console.log(`  · 下周目标:在 ${inWeek.length} 单基础上 +50%(每天回复更快、坚持发小红书引流)`)
