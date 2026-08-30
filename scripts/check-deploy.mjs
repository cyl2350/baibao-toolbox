// ============================================================
// 部署就绪检查:一键报告项目当前状态与待办
// 用法: node scripts/check-deploy.mjs
// ============================================================
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { site } from '../config/site.mjs'
import { tools } from '../config/tools.mjs'
import { articles } from '../config/articles.mjs'

const root = dirname(fileURLToPath(import.meta.url)) + '/..'
const dist = join(root, 'dist')

let warn = 0, info = 0, ok = 0
function report(status, msg) {
  const icons = { OK: '✅', WARN: '⚠️ ', INFO: 'ℹ️ ' }
  console.log(` ${icons[status]} [${status}] ${msg}`)
  if (status === 'WARN') warn++
  else if (status === 'OK') ok++
  else info++
}

console.log('========== 百宝工具箱 · 部署就绪检查 ==========\n')

// 1. 配置检查
console.log('【配置检查 config/site.mjs】')
if (site.domain.includes('example')) { report('WARN', `domain 仍是占位域名 "${site.domain}",请改为真实域名`) }
else { report('OK', `domain: ${site.domain}`) }
if (site.email.includes('example')) { report('WARN', 'email 仍是占位邮箱,请改为真实邮箱(用于广告合作)') }
else { report('OK', `email: ${site.email}`) }
if (site.monetization.adsenseClient) { report('OK', `AdSense 已配置: ${site.monetization.adsenseClient}`) }
else { report('INFO', 'AdSense 未配置:部署并申请通过后填入即可显示广告') }
if (site.monetization.baiduAdUnit) { report('OK', '百度联盟已配置') }
else { report('INFO', '百度联盟未配置(需要国内备案域名)') }
if (site.monetization.taokeUrl) { report('OK', '淘宝客推广位已配置') }
else { report('INFO', '淘宝客未配置(可选,填 alimama 推广链接)') }
if (site.analytics.baiduTongjiId) { report('OK', '百度统计已配置') }
else { report('INFO', '百度统计未配置(建议在百度搜索资源平台开启流量统计)') }

// 2. 构建产物检查
console.log('\n【构建产物检查 dist/】')
if (!existsSync(join(dist, 'index.html'))) { report('WARN', 'dist/index.html 不存在,请先运行 node build.mjs'); process.exit(1) }
else { report('OK', 'dist/index.html 存在') }
const toolIds = new Set(tools.map((t) => t.id))
const toolDirs = readdirSync(dist).filter((n) => toolIds.has(n))
const articleDirs = existsSync(join(dist, 'articles')) ? readdirSync(join(dist, 'articles')).filter((n) => !n.includes('.')) : []
report('OK', `工具页 ${toolDirs.length}/${tools.length} 个生成`)
report('OK', `文章页 ${articleDirs.length}/${articles.length} 篇生成`)
const sitemap = existsSync(join(dist, 'sitemap.xml')) ? readFileSync(join(dist, 'sitemap.xml'), 'utf8') : ''
const sitemapCount = (sitemap.match(/<loc>/g) || []).length
report('OK', `sitemap.xml 存在,含 ${sitemapCount} 个 URL`)
for (const f of ['robots.txt', 'favicon.svg', 'og-image.png', '404.html']) {
  report(existsSync(join(dist, f)) ? 'OK' : 'WARN', `${f} ${existsSync(join(dist, f)) ? '存在' : '缺失'}`)
}

// 3. 部署文件检查
console.log('\n【部署文件检查】')
report(existsSync(join(root, '.github/workflows/pages.yml')) ? 'OK' : 'INFO', '.github/workflows/pages.yml (推 GitHub 自动部署)')
report(existsSync(join(root, 'server.mjs')) ? 'OK' : 'INFO', 'server.mjs (本地预览)')
const pdfs = readdirSync(join(root, 'docs/产品')).filter((n) => n.endsWith('.pdf'))
report(pdfs.length ? 'OK' : 'INFO', `数字产品 PDF ${pdfs.length} 款`)
const imgs = (() => {
  const d = join(root, 'docs/产品/详情图')
  if (!existsSync(d)) return 0
  let n = 0
  for (const sub of readdirSync(d)) {
    const p = join(d, sub)
    if (statSync(p).isDirectory()) n += readdirSync(p).filter((f) => f.endsWith('.png')).length
    else if (sub.endsWith('.png')) n++
  }
  return n
})()
report(imgs ? 'OK' : 'INFO', `闲鱼详情图 ${imgs} 张`)

// 4. 总结
console.log('\n========== 总结 ==========')
if (warn === 0) {
  console.log(' ✅ 无必改项:项目已达到「可部署」状态')
  console.log(' 下一步:推送到 GitHub → Settings → Pages 选 GitHub Actions')
} else {
  console.log(` ⚠️  有 ${warn} 项需要修改后即可上线:`)
  console.log('  1. 修改 config/site.mjs 中的占位值(见上方 WARN 项)')
  console.log('  2. 运行 node build.mjs 重新构建')
  console.log('  3. 推送到 GitHub 自动部署')
}
console.log(` 数字产品上架与变现步骤见 docs/运营变现手册.md`)
