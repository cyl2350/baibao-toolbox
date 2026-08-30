// ============================================================
// 小红书引流笔记 · 解析器 + 轮发计划生成器(共享模块)
// 数据源: docs/运营/小红书引流笔记.md(10 条现成笔记)
// ============================================================

// 解析 md → [{ no, typeLabel, type: 'A'|'B', title, body }]
//   A = 引流(工具站),B = 卖产品
export function parseNotes(md) {
  const notes = []
  let cur = null
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trimEnd()
    const m = line.match(/^## 第 (\d+) 条 · (.+)/)
    if (m) {
      if (cur) notes.push(cur)
      cur = { no: Number(m[1]), typeLabel: m[2].trim(), type: m[2].includes('卖产品') ? 'B' : 'A', title: '', body: [] }
      continue
    }
    if (!cur) continue
    const t = line.match(/^\*\*标题:\*\*\s*(.+)/)
    if (t) { cur.title = t[1].trim(); continue }
    if (/^\*\*正文:\*\*/.test(line)) continue
    if (/^#|^---$/.test(line.trim())) continue
    const clean = line.replace(/^>\s?/, '').trim()
    if (clean) cur.body.push(clean)
  }
  if (cur) notes.push(cur)
  return notes.sort((a, b) => a.no - b.no)
}

// 生成未来 N 周的轮发计划(每周二/四/六发,引流 A 与卖产品 B 交替,笔记不重复)
// 返回 [{ date, weekday, type, no, title }]
export function buildPlan(notes, weeks = 4) {
  const typeSeq = ['A', 'B', 'A'] // 周二 A / 周四 B / 周六 A
  const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const weekdayCn = ['日', '一', '二', '三', '四', '五', '六']

  const d = new Date(); d.setHours(0, 0, 0, 0)
  const toTue = (2 - d.getDay() + 7) % 7
  d.setDate(d.getDate() + (toTue === 0 ? 7 : toTue)) // 严格从下一个周二开始

  const idx = { A: 0, B: 0 }
  const plan = []
  for (let w = 0; w < weeks; w++) {
    ;[0, 2, 4].forEach((off, s) => {
      const slot = new Date(d); slot.setDate(d.getDate() + w * 7 + off)
      const type = typeSeq[s]
      const pool = notes.filter((n) => n.type === type)
      if (!pool.length) return
      const note = pool[idx[type] % pool.length]
      idx[type]++
      plan.push({ date: fmt(slot), weekday: '周' + weekdayCn[slot.getDay()], type, no: note.no, title: note.title })
    })
  }
  return plan
}
