// ============================================================
// 百宝工具箱 —— 静态站点生成器
// 用法: node build.mjs   (输出到 dist/)
// 依赖: config/site.mjs  config/tools.mjs  src/css  src/js  src/tools  vendor
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { site, pages } from './config/site.mjs'
import { tools } from './config/tools.mjs'
import { articles } from './config/articles.mjs'

const root = dirname(fileURLToPath(import.meta.url))
const dist = join(root, 'dist')

// ---------------- 读取资源 ----------------
const css = readFileSync(join(root, 'src/css/style.css'), 'utf8')
const commonJs = readFileSync(join(root, 'src/js/common.js'), 'utf8')
const vendorCache = {}
const toolHtml = {}
const toolJs = {}
const articleHtml = {}
for (const t of tools) {
  toolHtml[t.id] = readFileSync(join(root, `src/tools/${t.id}.html`), 'utf8')
  toolJs[t.id] = readFileSync(join(root, `src/tools/${t.id}.js`), 'utf8')
  for (const v of t.vendor || []) {
    if (!vendorCache[v]) vendorCache[v] = readFileSync(join(root, `vendor/${v}`), 'utf8')
  }
}
for (const a of articles) {
  articleHtml[a.id] = readFileSync(join(root, `src/articles/${a.id}.html`), 'utf8')
}
const toolById = Object.fromEntries(tools.map((t) => [t.id, t]))

// ---------------- 工具函数 ----------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// 相对路径前缀:根页面 '' ,子目录页面 '../'
const rel = (depth) => (depth === 0 ? '' : '../')

function siteConfigScript() {
  const cfg = {
    name: site.name,
    domain: site.domain,
    monetization: {
      adsenseClient: site.monetization.adsenseClient,
      baiduAdUnit: site.monetization.baiduAdUnit,
      taokeUrl: site.monetization.taokeUrl,
    },
  }
  return `<script>window.SITE_CONFIG = ${JSON.stringify(cfg)};</script>`
}

function analyticsScripts() {
  let s = ''
  if (site.analytics.baiduTongjiId) {
    s += `<script>var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?${site.analytics.baiduTongjiId}";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(hm,t);})();</script>`
  }
  if (site.analytics.ga4Id) {
    s += `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.analytics.ga4Id}"></script>`
    s += `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.analytics.ga4Id}');</script>`
  }
  return s
}

function adsenseHeadScript() {
  if (!site.monetization.adsenseClient) return ''
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.monetization.adsenseClient}" crossorigin="anonymous"></script>`
}

function adSlot(depth, dataSlot, label) {
  if (site.monetization.adsenseClient) {
    return `<div class="ad-slot" data-ad="banner" data-slot="${dataSlot}">
<ins class="adsbygoogle" style="display:block" data-ad-client="${site.monetization.adsenseClient}" data-ad-slot="${dataSlot}" data-ad-format="auto" data-full-width-responsive="true"></ins>
</div>`
  }
  // 未配置广告时,common.js 会渲染占位提示
  return `<div class="ad-slot" data-ad="banner" data-slot="${dataSlot}" data-label="${label || ''}"></div>`
}

function header(depth) {
  const r = rel(depth)
  const nav = tools
    .map((t) => `<a href="${r}${t.id}/">${t.name}</a>`)
    .join('')
  return `<header class="site-header">
  <div class="header-inner">
    <a class="logo" href="${r}"><span class="logo-mark">百</span><span>${site.name}</span></a>
    <nav class="nav-links">${nav}</nav>
    <div class="header-actions">
      <button class="theme-toggle" id="theme-toggle" title="切换主题" aria-label="切换主题">🌓</button>
    </div>
  </div>
</header>`
}

function footer(depth) {
  const r = rel(depth)
  const pageLinks = pages.map((p) => `<a href="${r}${p.id}/">${p.title}</a>`).join('')
  const icp = site.icp ? `<span>${site.icp}</span>` : ''
  return `<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-links">
      <a href="${r}">首页</a>
      <a href="${r}articles/">使用教程</a>
      ${pageLinks}
      <a href="mailto:${site.email}">广告合作:${site.email}</a>
    </div>
    <div>© ${site.year} ${site.name} · ${esc(site.slogan)}</div>
    ${icp}
  </div>
</footer>`
}

function layout({ depth, title, desc, keywords, path, body, jsonld, extraHead = '', extraScripts = '' }) {
  const r = rel(depth)
  const canonical = `https://${site.domain}${path}`
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(keywords || '')}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://${site.domain}/og-image.png">
<link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${r}css/style.css">
${jsonld || ''}
${siteConfigScript()}
${adsenseHeadScript()}
${extraHead}
</head>
<body>
${header(depth)}
<main class="container">
${body}
</main>
${footer(depth)}
<div id="toast"></div>
<script src="${r}js/common.js"></script>
${extraScripts}
${analyticsScripts()}
</body>
</html>`
}

// ---------------- 首页 ----------------
function homePage() {
  const categories = []
  for (const t of tools) {
    if (!categories.some((c) => c.name === t.category)) categories.push({ name: t.category, items: [] })
    categories.find((c) => c.name === t.category).items.push(t)
  }
  let catsHtml = ''
  for (const c of categories) {
    const cards = c.items
      .map((t) => `<a class="tool-card" href="${t.id}/">
        <span class="t-icon">${t.icon}</span>
        <span><span class="t-name">${t.name}</span><div class="t-summary">${esc(t.summary)}</div></span>
      </a>`)
      .join('')
    catsHtml += `<h2 class="category-title">${c.name}</h2><div class="tool-grid">${cards}</div>`
  }
  const body = `
<div class="hero">
  <h1>${site.name} —— 免费在线工具集</h1>
  <p>${esc(site.slogan)}。共 ${tools.length} 款工具,全部在浏览器本地运行,无需注册、无需下载、保护隐私。</p>
</div>
${adSlot(0, '1234567890', '首页顶部横幅')}
${catsHtml}
${adSlot(0, '2234567890', '首页中部横幅')}
<div class="panel">
  <h2>使用教程与干货</h2>
  <div style="display:grid;gap:10px">
    ${articles.map((a) => `<a href="articles/${a.id}/" style="display:block;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--bg)">
      <b style="color:var(--text)">${esc(a.title)}</b>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">${esc(a.desc)}</div>
    </a>`).join('')}
  </div>
</div>
<div class="panel">
  <h2>为什么选择百宝工具箱?</h2>
  <p>所有工具均为纯前端实现,数据只在您的设备上处理,不会上传到服务器,私密又安全。页面轻量、打开即用,兼容手机与电脑浏览器。</p>
  <p>我们持续收录开发、设计、文本处理等场景的高频小工具,并保持完全免费。如果网站对您有帮助,欢迎分享给朋友,或通过 <a href="about/">关于我们</a> 联系我们洽谈合作。</p>
</div>`
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: `https://${site.domain}/`,
    description: site.description,
  })}</script>`
  writePage('index.html', layout({
    depth: 0, path: '/', title: `${site.name} - 免费在线工具集`, desc: site.description,
    keywords: '在线工具,免费工具,工具箱,图片压缩,二维码生成,json格式化',
    body, jsonld,
  }))
}

// ---------------- 工具页 ----------------
function toolPage(t) {
  const related = tools.filter((x) => x.id !== t.id && x.category === t.category).slice(0, 6)
  const relatedHtml = related.length
    ? `<div class="panel"><h3>相关工具</h3><div class="tool-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">` +
      related.map((x) => `<a class="tool-card" href="../${x.id}/"><span class="t-icon">${x.icon}</span><span class="t-name">${x.name}</span></a>`).join('') +
      `</div></div>`
    : ''
  const vendorScripts = (t.vendor || [])
    .map((v) => `<script src="../vendor/${v}"></script>`)
    .join('')
  const body = `
<nav class="breadcrumb"><a href="../">首页</a> › ${esc(t.name)}</nav>
<div class="tool-page">
  <h1>${esc(t.name)}</h1>
  <p class="tool-desc">${esc(t.desc)}</p>
  ${adSlot(1, '3234567890', '工具顶部横幅')}
  <div class="panel"><div class="tool-body">${toolHtml[t.id]}</div></div>
  ${adSlot(1, '4234567890', '工具底部横幅')}
  ${relatedHtml}
</div>`
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${t.name} - ${site.name}`,
    url: `https://${site.domain}/${t.id}/`,
    description: t.desc,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' },
  })}</script>`
  writePage(`${t.id}/index.html`, layout({
    depth: 1, path: `/${t.id}/`,
    title: `${t.name} - 免费在线使用 | ${site.name}`,
    desc: t.desc, keywords: t.keywords,
    body, jsonld,
    extraScripts: vendorScripts + `<script>${toolJs[t.id]}</script>`,
  }))
}

// ---------------- 内容页 ----------------
const contentBodies = {
  about: `<h1>关于我们</h1>
<p>${site.name} 是一个完全免费的在线工具集,提供图片、编码、文本、开发、设计等场景的高频小工具。</p>
<h2>我们的理念</h2>
<ul>
<li><b>免费:</b>所有工具永久免费,无会员、无次数限制。</li>
<li><b>隐私:</b>全部工具在浏览器本地运行,您的数据不上传任何服务器。</li>
<li><b>轻量:</b>无广告弹窗、无强制下载,打开即用。</li>
</ul>
<h2>联系我们</h2>
<p>商务合作、广告投放或功能建议,请发送邮件至 <a href="mailto:${site.email}">${site.email}</a>。</p>`,
  privacy: `<h1>隐私政策</h1>
<p>更新日期:${site.year} 年。${site.name}(以下简称"本站")重视您的隐私。本政策说明本站如何处理信息。</p>
<h2>1. 数据本地处理</h2>
<p>本站所有工具(图片压缩、二维码生成、Base64 编解码等)均在您的浏览器本地完成计算,<b>不会将您输入的内容或上传的文件发送到任何服务器</b>。</p>
<h2>2. 第三方服务</h2>
<p>本站可能使用第三方广告服务(如 Google AdSense)与统计服务(如百度统计、Google Analytics),它们可能通过 Cookie 等方式收集匿名访问数据(如 IP、浏览器类型、访问页面),用于广告投放与访问分析。相关数据处理遵循第三方各自的隐私政策。</p>
<h2>3. Cookie 与本地存储</h2>
<p>本站仅在您的浏览器本地存储少量设置(如主题偏好),不使用 Cookie 存储个人身份信息。</p>
<h2>4. 未成年人</h2>
<p>本站不面向未成年人收集个人信息。</p>
<h2>5. 政策更新</h2>
<p>本站可能不时更新本政策,更新后将在本页面公布。</p>
<p>如有疑问,请联系 <a href="mailto:${site.email}">${site.email}</a>。</p>`,
  disclaimer: `<h1>免责声明</h1>
<h2>1. 内容与工具</h2>
<p>本站提供的工具与内容仅供个人学习、工作参考使用,不构成任何形式的专业建议。使用本站工具产生的任何结果,使用者应自行判断与承担风险。</p>
<h2>2. 第三方链接与广告</h2>
<p>本站可能包含第三方网站链接与广告内容,本站不对其内容、准确性及服务负责。广告内容由广告平台提供,不代表本站观点。</p>
<h2>3. 责任限制</h2>
<p>因使用或无法使用本站导致的任何直接或间接损失,本站不承担赔偿责任。本站不保证服务的持续可用性与绝对准确性。</p>
<h2>4. 版权</h2>
<p>本站原创内容版权归本站所有,转载需注明出处。如您认为本站内容侵犯了您的权益,请联系 <a href="mailto:${site.email}">${site.email}</a>,我们将尽快处理。</p>`,
}

function contentPage(p) {
  const body = `<div class="content-page">${contentBodies[p.id]}</div>`
  writePage(`${p.id}/index.html`, layout({
    depth: 1, path: `/${p.id}/`,
    title: `${p.title} | ${site.name}`, desc: p.desc,
    keywords: `${p.title},${site.name}`,
    body,
  }))
}

// ---------------- 文章页 ----------------
function articlePage(a) {
  const tool = toolById[a.tool]
  const others = articles.filter((x) => x.id !== a.id).slice(0, 5)
  const otherList = others.length
    ? `<div class="panel"><h3>更多教程</h3><div style="display:grid;gap:8px">` +
      others.map((x) => `<a href="../${x.id}/">${esc(x.title)}</a>`).join('') +
      `</div></div>`
    : ''
  const body = `
<nav class="breadcrumb"><a href="../">首页</a> › <a href="../articles/">使用教程</a> › ${esc(a.title)}</nav>
<article class="content-page">
  <h1>${esc(a.title)}</h1>
  <p style="color:var(--muted);font-size:13px">${a.date} · ${esc(a.category)}</p>
  ${articleHtml[a.id]}
</article>
${otherList}`
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    datePublished: a.date,
    description: a.desc,
    url: `https://${site.domain}/articles/${a.id}/`,
    author: { '@type': 'Organization', name: site.name },
  })}</script>`
  writePage(`articles/${a.id}/index.html`, layout({
    depth: 1, path: `/articles/${a.id}/`,
    title: `${a.title} | ${site.name}`,
    desc: a.desc, keywords: a.keywords,
    body, jsonld,
  }))
}

function articlesIndexPage() {
  const list = articles
    .map((a) => `<a class="tool-card" href="${a.id}/" style="display:block">
      <span style="flex:1"><span class="t-name">${esc(a.title)}</span><div class="t-summary">${esc(a.desc)}</div><div style="font-size:12px;color:var(--muted);margin-top:4px">${a.date} · ${esc(a.category)}</div></span>
    </a>`)
    .join('')
  const body = `
<nav class="breadcrumb"><a href="../">首页</a> › 使用教程</nav>
<div class="content-page">
  <h1>使用教程与干货文章</h1>
  <p>工具使用方法、原理科普与实用技巧,与本站工具一一对应。</p>
  <div class="tool-grid" style="grid-template-columns:1fr">${list}</div>
</div>`
  writePage('articles/index.html', layout({
    depth: 1, path: '/articles/',
    title: `使用教程与干货文章 | ${site.name}`,
    desc: '百宝工具箱使用教程:图片压缩技巧、房贷月供计算、时间戳原理、Base64 科普等实用干货。',
    keywords: '在线工具教程,图片压缩技巧,房贷计算,时间戳,base64,二维码生成',
    body,
  }))
}

// ---------------- 404 ----------------
function notFoundPage() {
  writePage('404.html', layout({
    depth: 0, path: '/404.html',
    title: `页面不存在 | ${site.name}`, desc: '您访问的页面不存在。',
    keywords: '',
    body: `<div class="notfound"><h1>404</h1><p>页面不存在或已被移动。</p><p><a class="btn" href="./">返回首页</a></p></div>`,
  }))
}

// ---------------- sitemap / robots ----------------
function sitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = ['/']
  for (const t of tools) urls.push(`/${t.id}/`)
  for (const p of pages) urls.push(`/${p.id}/`)
  urls.push('/articles/')
  for (const a of articles) urls.push(`/articles/${a.id}/`)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>https://${site.domain}${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>`
  writeFileSync(join(dist, 'sitemap.xml'), xml, 'utf8')
}

function robots() {
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${site.domain}/sitemap.xml\n`, 'utf8')
}

// ---------------- 写入与资源复制 ----------------
function writePage(relPath, html) {
  const full = join(dist, relPath)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, html, 'utf8')
  console.log('  ✓ ' + relPath)
}

mkdirSync(join(dist, 'css'), { recursive: true })
mkdirSync(join(dist, 'js'), { recursive: true })
mkdirSync(join(dist, 'vendor'), { recursive: true })
writeFileSync(join(dist, 'css/style.css'), css, 'utf8')
writeFileSync(join(dist, 'js/common.js'), commonJs, 'utf8')
for (const [name, content] of Object.entries(vendorCache)) {
  writeFileSync(join(dist, 'vendor', name), content, 'utf8')
}
// og:image(社交分享图)
const ogSrc = join(root, 'src/og-image.png')
if (existsSync(ogSrc)) copyFileSync(ogSrc, join(dist, 'og-image.png'))
// favicon
writeFileSync(join(dist, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f6ef7"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="44" font-size="34" font-weight="bold" fill="#fff" text-anchor="middle" font-family="PingFang SC,Microsoft YaHei,sans-serif">百</text></svg>`, 'utf8')

console.log('生成首页…')
homePage()
console.log('生成工具页…')
for (const t of tools) toolPage(t)
console.log('生成内容页…')
for (const p of pages) contentPage(p)
console.log('生成文章页…')
for (const a of articles) articlePage(a)
articlesIndexPage()
console.log('生成 404 / sitemap / robots…')
notFoundPage()
sitemap()
robots()
console.log('✔ 构建完成 →', dist)
