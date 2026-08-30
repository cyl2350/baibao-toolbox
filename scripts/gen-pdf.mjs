// ============================================================
// 通用 PDF 生成器:把结构化 Markdown 转成可售卖的成品 PDF
// 用法: node scripts/gen-pdf.mjs <输入.md> <输出.pdf> [标题] [副标题]
// 格式约定: # 文档标题 / ## 章节 / > 提示 / 1. 条目(**加粗**开头为高亮标题)
// 依赖: npm i -D pdfkit; 系统字体 C:\Windows\Fonts\simhei.ttf
// ============================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import PDFDocument from 'pdfkit'

const root = dirname(fileURLToPath(import.meta.url)) + '/..'
const [, , mdArg, outArg, titleArg, subtitleArg] = process.argv
if (!mdArg || !outArg) {
  console.error('用法: node scripts/gen-pdf.mjs <输入.md> <输出.pdf> [标题] [副标题]')
  process.exit(1)
}
const mdPath = join(root, mdArg)
const outPath = join(root, outArg)

const fontCandidates = [
  'C:/Windows/Fonts/simhei.ttf',
  '/System/Library/Fonts/PingFang.ttc',
  '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
]
const fontPath = fontCandidates.find((p) => existsSync(p))
if (!fontPath) {
  console.error('未找到中文字体,请安装黑体或修改脚本中的 fontCandidates')
  process.exit(1)
}

const C = {
  primary: '#4f6ef7', accent: '#8b5cf6', dark: '#1f2430', muted: '#6b7280',
  lightBg: '#f2f5ff', line: '#e5e7eb',
}

function parseMd(text) {
  const blocks = []
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed === '---') continue
    let m
    if ((m = trimmed.match(/^# (.*)/))) blocks.push({ type: 'title', text: m[1] })
    else if ((m = trimmed.match(/^## (.*)/))) blocks.push({ type: 'section', text: m[1] })
    else if ((m = trimmed.match(/^> (.*)/))) blocks.push({ type: 'note', text: m[1] })
    else if ((m = trimmed.match(/^(\d+)\.\s*(.*)/))) blocks.push({ type: 'item', num: parseInt(m[1], 10), text: m[2] })
    else blocks.push({ type: 'para', text: trimmed })
  }
  return blocks
}

function splitLead(text) {
  const m = text.match(/^\*\*([^*]+)\*\*(.*)$/)
  return m ? { lead: m[1], rest: m[2] } : { lead: null, rest: text }
}

const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true, autoFirstPage: false })
const chunks = []
doc.on('data', (c) => chunks.push(c))
doc.registerFont('hei', fontPath)
doc.font('hei')

const PW = 595.28, PH = 841.89, ML = 56
const CONTENT_W = PW - ML * 2
const BODY = 15.5, BODY_LH = 31, NOTE_LH = 26, SECTION_LH = 40

function measure(text, size) { doc.font('hei').fontSize(size); return doc.widthOfString(text) }

function wrap(text, maxWidth, size) {
  const lines = []
  for (const raw of String(text).split('\n')) {
    if (raw === '') { lines.push(''); continue }
    let line = ''
    for (const ch of raw) {
      if (measure(line + ch, size) > maxWidth && line !== '') { lines.push(line); line = ch }
      else line += ch
    }
    lines.push(line)
  }
  return lines
}

const blocks = parseMd(readFileSync(mdPath, 'utf8'))
const docTitle = titleArg || (blocks.find((b) => b.type === 'title') || {}).text || '资料手册'
const sectionTitles = blocks.filter((b) => b.type === 'section').map((b) => b.text)
const itemCount = blocks.filter((b) => b.type === 'item').length
const subtitle = subtitleArg || `${itemCount} 个可直接套用的模板 · 即拿即用`

// 第一遍:渲染内容页
doc.addPage({ size: 'A4', margin: 0 })
doc.addPage({ size: 'A4', margin: 0 })
let y = 0
let currentPage = 2
const contentPageStart = 2
const sectionPages = []

function newPage() { doc.addPage({ size: 'A4', margin: 0 }); currentPage++; y = 60 }
function ensureSpace(need) { if (y + need > PH - 64) newPage() }

for (const b of blocks) {
  if (b.type === 'title') continue
  if (b.type === 'section') {
    ensureSpace(90)
    y += 14
    doc.rect(ML, y - 3, 6, 26).fill(C.primary)
    doc.font('hei').fontSize(19).fillColor(C.dark).text(b.text, ML + 16, y)
    sectionPages.push({ title: b.text, page: currentPage - 1 })
    y += SECTION_LH
    doc.moveTo(ML, y - 8).lineTo(PW - ML, y - 8).lineWidth(0.8).strokeColor(C.line).stroke()
    y += 6
    continue
  }
  if (b.type === 'item') {
    const { lead, rest } = splitLead(b.text)
    const badgeR = 12
    const tx = ML + badgeR * 2 + 12
    const lines = wrap(rest, CONTENT_W - badgeR * 2 - 12, BODY)
    ensureSpace(lines.length * BODY_LH + 14)
    doc.circle(ML + badgeR, y + badgeR, badgeR).fill(C.primary)
    doc.font('hei').fontSize(10).fillColor('#ffffff').text(String(b.num), ML + badgeR - 4, y + badgeR - 6, { width: 8, align: 'center' })
    let ly = y
    lines.forEach((line, i) => {
      if (i === 0 && lead) {
        doc.font('hei').fontSize(BODY).fillColor(C.primary).text(lead, tx, ly)
        doc.font('hei').fontSize(BODY).fillColor(C.dark).text(line, tx + measure(lead, BODY), ly)
      } else {
        doc.font('hei').fontSize(BODY).fillColor(C.dark).text(line, tx, ly)
      }
      ly += BODY_LH
    })
    y = ly + 3
    continue
  }
  if (b.type === 'note') {
    const text = b.text.replace(/^\*.*\*/, '')
    const lines = wrap(text, CONTENT_W - 20, 11.5)
    ensureSpace(lines.length * NOTE_LH + 8)
    doc.rect(ML, y - 4, CONTENT_W, lines.length * NOTE_LH + 8).fill(C.lightBg)
    let ly = y + 3
    lines.forEach((line) => {
      doc.font('hei').fontSize(11.5).fillColor(C.muted).text(line, ML + 10, ly, { width: CONTENT_W - 20 })
      ly += NOTE_LH
    })
    y = ly + 8
    continue
  }
  if (b.type === 'para') {
    const { lead, rest } = splitLead(b.text)
    const lines = wrap(rest, CONTENT_W - (lead ? measure(lead, 13) : 0), 13)
    ensureSpace(lines.length * 26 + 10)
    let ly = y
    lines.forEach((line, i) => {
      if (i === 0 && lead) {
        doc.font('hei').fontSize(13).fillColor(C.primary).text(lead, ML, ly)
        doc.font('hei').fontSize(13).fillColor(C.dark).text(line, ML + measure(lead, 13), ly, { width: CONTENT_W - measure(lead, 13) })
      } else {
        doc.font('hei').fontSize(13).fillColor(C.dark).text(line, ML, ly, { width: CONTENT_W })
      }
      ly += 26
    })
    y = ly + 8
  }
}

// 页脚
const footerText = `百宝工具箱 出品 · ${docTitle}`
for (let p = contentPageStart; p < currentPage; p++) {
  doc.switchToPage(p)
  doc.font('hei').fontSize(9).fillColor(C.muted)
  doc.text(footerText, ML, PH - 38, { width: CONTENT_W, align: 'left' })
  doc.text(`第 ${p - 1} 页`, ML, PH - 38, { width: CONTENT_W, align: 'right' })
}

// ---------- 封面 ----------
doc.switchToPage(0)
doc.rect(0, 0, PW, PH).fill('#ffffff')
const grad = doc.linearGradient(0, 0, PW, 260)
grad.stop(0, C.primary).stop(1, C.accent)
doc.rect(0, 0, PW, 260).fill(grad)
doc.font('hei').fontSize(11).fillColor('#ffffff').text('百宝工具箱 · 原创出品', ML, 40)
// 标题(超长自动缩小)
const titleSize = docTitle.length > 14 ? 34 : 44
doc.font('hei').fontSize(titleSize).fillColor('#ffffff').text(docTitle, ML, 100, { width: CONTENT_W })
doc.font('hei').fontSize(15).fillColor('#e8edff').text(subtitle, ML, 180, { width: CONTENT_W })
// 章节徽标(最多 6 个)
const chips = sectionTitles.slice(0, 6).map((s) => s.replace(/^[一二三四五六七八九十]+、/, '').slice(0, 4))
let cx = ML
const chipY = 330
chips.forEach((c) => {
  const w = measure(c, 13) + 34
  doc.roundedRect(cx, chipY, w, 34, 17).fill(C.lightBg)
  doc.font('hei').fontSize(13).fillColor(C.primary).text(c, cx + 17, chipY + 10, { width: w - 34, align: 'center' })
  cx += w + 14
})
doc.font('hei').fontSize(13.5).fillColor(C.dark)
doc.text(`共 ${sectionTitles.length} 大章节 · ${itemCount} 个即用模板`, ML, chipY + 60)
doc.text('每条含:标题 + 完整可替换模板 + 使用要点', ML, chipY + 92)
doc.roundedRect(ML, chipY + 128, 260, 46, 8).fill(C.primary)
doc.font('hei').fontSize(15).fillColor('#ffffff').text('立即获取 · 高效工作', ML + 130, chipY + 144, { width: 200, align: 'center' })
doc.font('hei').fontSize(10).fillColor(C.muted).text('版本 v1.0 · 2025 · 可自由用于个人与商用', ML, PH - 60)

// ---------- 目录 ----------
doc.switchToPage(1)
doc.font('hei').fontSize(26).fillColor(C.dark).text('目录', ML, 60)
doc.moveTo(ML, 98).lineTo(PW - ML, 98).lineWidth(1).strokeColor(C.primary).stroke()
let ty = 122
for (const s of sectionPages) {
  doc.font('hei').fontSize(13.5).fillColor(C.dark).text(s.title, ML, ty)
  const pageW = measure(String(s.page), 13.5)
  doc.font('hei').fontSize(13.5).fillColor(C.primary).text(String(s.page), PW - ML - pageW, ty)
  ty += 36
}
doc.font('hei').fontSize(12).fillColor(C.muted).text('提示:把【】中的内容替换成你的具体情况即可使用。', ML, ty + 10, { width: CONTENT_W })

doc.flushPages()
doc.end()

doc.on('end', () => {
  const buf = Buffer.concat(chunks)
  writeFileSync(outPath, buf)
  const kb = (buf.length / 1024).toFixed(1)
  const str = buf.toString('latin1')
  const pages = (str.match(/\/Type\s*\/Page\b(?!s)/g) || []).length
  console.log(`✔ ${outPath}  大小 ${kb} KB · ${pages} 页`)
})
