// ============================================================
// AdSense 审核合规预检:对生成的站点逐项检查是否符合
// Google AdSense 政策要求(内容/页面/技术层面)
// 用法: node scripts/check-adsense.mjs
// ============================================================
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url)) + '/..'
const dist = join(root, 'dist')

let pass = 0, fail = 0, warn = 0
function report(ok, msg) {
  console.log(` ${ok === true ? '✅' : ok === false ? '❌' : '⚠️ '} ${msg}`)
  if (ok === true) pass++
  else if (ok === false) fail++
  else warn++
}

console.log('========== AdSense 审核合规预检 ==========\n')

// 1. 必备页面
console.log('【必备页面】')
report(existsSync(join(dist, 'privacy/index.html')), '隐私政策页 /privacy/(AdSense 硬性要求)')
report(existsSync(join(dist, 'about/index.html')), '关于页 /about/(提升信任度)')
report(existsSync(join(dist, 'disclaimer/index.html')), '免责声明页 /disclaimer/')
report(existsSync(join(dist, '404.html')), '404 页面(减少无效访问)')

// 2. 内容质量
console.log('\n【内容质量】')
const toolDirs = readdirSync(dist).filter((n) => {
  const p = join(dist, n)
  return statSync(p).isDirectory() && existsSync(join(p, 'index.html')) && !['css', 'js', 'vendor', 'articles', 'privacy', 'about', 'disclaimer'].includes(n)
})
let allHtml = ''
for (const d of readdirSync(dist)) {
  const p = join(dist, d)
  if (statSync(p).isDirectory()) {
    for (const f of readdirSync(p)) {
      if (f.endsWith('.html')) allHtml += readFileSync(join(p, f), 'utf8')
    }
  } else if (d.endsWith('.html')) {
    allHtml += readFileSync(join(dist, d), 'utf8')
  }
}
report(toolDirs.length >= 20, `内容页面数量足够:${toolDirs.length} 个工具页 + 文章页(AdSense 建议有实质内容)`)
const bodyLen = allHtml.length
report(bodyLen > 200000, `站点总 HTML 体量 ${(bodyLen / 1024).toFixed(0)} KB(内容充实度)`)

// 3. 禁止内容扫描
console.log('\n【禁止内容扫描】(AdSense 政策:色情/赌博/盗版/药品等)')
const banned = [
  ['博彩', /(博彩|赌博|百家乐|彩票代购|六合彩)/],
  ['成人', /(成人影片|色情|裸聊|约炮)/],
  ['盗版', /(破解版下载|盗版资源|外挂|私服)/],
  ['违禁品', /(违禁品|毒品|假证|代开发票)/],
  ['医疗夸大', /(包治|根治|特效药|治愈率100)/],
]
let bannedHit = 0
for (const [name, re] of banned) {
  const hits = allHtml.match(re)
  if (hits) { report(false, `检测到疑似「${name}」相关内容(请人工确认上下文):${hits.slice(0, 3).join(', ')}`); bannedHit++ }
  else report(true, `未发现「${name}」类内容`)
}
if (bannedHit) console.log('  ⚠️  若为误报(如文章中引用示例),可忽略;若真实存在请删除后再申请 AdSense')

// 4. 技术指标
console.log('\n【技术指标】')
const idxHtml = readFileSync(join(dist, 'index.html'), 'utf8')
report(idxHtml.includes('viewport'), '移动端 viewport meta(移动友好是审核加分项)')
report(idxHtml.includes('og:image'), 'og:image 社交分享图')
report(existsSync(join(dist, 'sitemap.xml')), 'sitemap.xml')
report(existsSync(join(dist, 'robots.txt')), 'robots.txt')
// 每页 meta description
let missingDesc = 0, totalPages = 0
for (const d of readdirSync(dist)) {
  const p = join(dist, d)
  if (statSync(p).isDirectory()) {
    for (const f of readdirSync(p)) {
      if (!f.endsWith('.html')) continue
      totalPages++
      if (!readFileSync(join(p, f), 'utf8').includes('name="description"')) missingDesc++
    }
  } else if (d.endsWith('.html')) {
    totalPages++
    if (!readFileSync(join(dist, d), 'utf8').includes('name="description"')) missingDesc++
  }
}
report(missingDesc === 0, `所有页面均有 meta description(${totalPages} 页,缺失 ${missingDesc})`)

// 5. 域名配置
console.log('\n【域名与 HTTPS】')
const siteSrc = readFileSync(join(root, 'config/site.mjs'), 'utf8')
const domainMatch = siteSrc.match(/domain: '([^']+)'/)
const domain = domainMatch ? domainMatch[1] : ''
report(!domain.includes('example'), `已配置正式域名(当前:"${domain}",example 为占位)`)
console.log('  ℹ️  上线后请确保:域名启用 HTTPS(免费 Let\u2019s Encrypt / Cloudflare 均可)')
console.log('  ℹ️  AdSense 审核一般需要:网站可正常访问 + 隐私政策 + 一定内容量 + 无违规内容')

console.log(`\n========== 结果:通过 ${pass} / 警告 ${warn} / 未通过 ${fail} ==========`)
if (fail === 0) console.log(' ✅ 站点层面满足 AdSense 主要要求,可提交申请')
else console.log(' ❌ 有未通过项,请修复后重新检查(见上方 ❌ 行)')
