// 生成站点社交分享图 og-image.png (1200x630, 输出到 src/ 由 build.mjs 复制)
import { writeFileSync, existsSync } from 'node:fs'
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'

const fontPath = 'C:/Windows/Fonts/simhei.ttf'
if (existsSync(fontPath)) GlobalFonts.registerFromPath(fontPath, 'SimHei')

const W = 1200, H = 630
const c = createCanvas(W, H)
const ctx = c.getContext('2d')

const grad = ctx.createLinearGradient(0, 0, W, H)
grad.addColorStop(0, '#4f6ef7')
grad.addColorStop(1, '#8b5cf6')
ctx.fillStyle = grad
ctx.fillRect(0, 0, W, H)

// 装饰圆
ctx.fillStyle = 'rgba(255,255,255,0.08)'
ctx.beginPath(); ctx.arc(W - 120, 80, 200, 0, Math.PI * 2); ctx.fill()
ctx.beginPath(); ctx.arc(80, H - 60, 140, 0, Math.PI * 2); ctx.fill()

ctx.font = '30px SimHei'
ctx.fillStyle = 'rgba(255,255,255,0.9)'
ctx.fillText('百宝工具箱 · 免费在线工具集', 70, 90)

ctx.font = 'bold 72px SimHei'
ctx.fillStyle = '#ffffff'
ctx.fillText('免费在线工具', 70, 240)
ctx.fillText('26 款 · 打开即用', 70, 340)

ctx.font = '32px SimHei'
ctx.fillStyle = '#e8edff'
ctx.fillText('二维码 · 图片压缩 · 房贷计算 · 时间戳 · Markdown', 70, 440)

ctx.font = '28px SimHei'
ctx.fillStyle = 'rgba(255,255,255,0.85)'
ctx.fillText('全部浏览器本地运行 · 无需注册 · 保护隐私', 70, 510)

writeFileSync('src/og-image.png', c.toBuffer('image/png'))
console.log('✔ src/og-image.png 1200x630')

// ---------- PWA 图标 ----------
function genIcon(size, name) {
  const ic = createCanvas(size, size)
  const ictx = ic.getContext('2d')
  const grad = ictx.createLinearGradient(0, 0, size, size)
  grad.addColorStop(0, '#4f6ef7')
  grad.addColorStop(1, '#8b5cf6')
  ictx.fillStyle = grad
  const r = size * 0.22
  ictx.beginPath()
  ictx.roundRect(0, 0, size, size, r)
  ictx.fill()
  ictx.font = `bold ${size * 0.52}px SimHei`
  ictx.fillStyle = '#ffffff'
  ictx.textAlign = 'center'
  ictx.textBaseline = 'middle'
  ictx.fillText('百', size / 2, size * 0.52)
  writeFileSync(`src/${name}`, ic.toBuffer('image/png'))
  console.log(`✔ src/${name} ${size}x${size}`)
}
genIcon(192, 'icon-192.png')
genIcon(512, 'icon-512.png')
genIcon(180, 'apple-touch-icon.png')
