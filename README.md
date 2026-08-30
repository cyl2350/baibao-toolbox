# 百宝工具箱 (baibao-toolbox)

一个**免费在线工具集**静态网站,包含 26 款纯前端小工具(二维码、图片压缩、房贷计算、日期计算、人民币大写、BMI、JSON 格式化、时间戳转换、Base64、Markdown 编辑器等),所有工具在浏览器本地运行,不上传任何数据。

项目定位:**零服务器成本的轻量内容站**,通过广告联盟(Google AdSense / 百度联盟)、淘宝客推荐位、以及后续高级功能变现。已内置 SEO(每个工具独立页面 + sitemap + JSON-LD 结构化数据)与广告位框架,改两个配置即可上线。

## 快速开始

```bash
# 1. 构建静态站点(输出到 dist/)
node build.mjs

# 2. 本地预览
node server.mjs 8080
# 打开 http://127.0.0.1:8080/
```

## 目录结构

```
config/site.mjs       # 站点信息 + 变现/统计配置(部署前必改)
config/tools.mjs      # 工具清单(新增工具只需在此添加条目 + 页面文件)
src/css/style.css     # 全局样式
src/js/common.js      # 公共脚本(主题/复制/广告位渲染)
src/tools/<id>.html   # 每个工具的面板 HTML
src/tools/<id>.js     # 每个工具的逻辑
scripts/gen-handbook-pdf.mjs  # 生成《AI提示词实战手册》成品 PDF(npm run pdf)
vendor/               # 本地化前端库(qrcode / marked / md5 / diff)
build.mjs             # 静态站点生成器(含 sitemap/robots/JSON-LD)
server.mjs            # 本地预览服务器
docs/运营变现手册.md   # ★ 部署 / 变现 / SEO 完整执行指南(必读)
docs/产品/            # ★ 可售数字产品(PDF + 闲鱼上架文案)
```

## 配置上线(3 步)

1. 编辑 `config/site.mjs`:
   - `domain`:改为你的真实域名
   - `monetization.adsenseClient`:AdSense 审核通过后填入发布商 ID
   - `monetization.baiduAdUnit`:百度联盟(需备案)广告位 ID
   - `analytics.*`:百度统计 / GA4 追踪 ID
2. 重新构建:`node build.mjs`
3. 把 `dist/` 部署到任意静态托管(GitHub Pages / Cloudflare Pages / Vercel / Netlify / 国内云服务器均可)。

> 详细步骤、广告申请条件、SEO 收录与收入预期,见 **[docs/运营变现手册.md](docs/运营变现手册.md)**。

## 新增一个工具

1. 在 `config/tools.mjs` 的 `tools` 数组追加一项(`id` 唯一,`icon` 用 emoji 或字符,`vendor` 列该页需要加载的本地库)。
2. 创建 `src/tools/<id>.html`(面板结构)与 `src/tools/<id>.js`(逻辑,可用 `window.bbCopy` / `window.bbToast` / `window.bbDownload` 公共方法)。
3. `node build.mjs` 重新构建,自动生成页面、内链、sitemap 条目。

## 技术要点

- 纯静态、零依赖(运行时不需要 npm install;构建仅需 Node ≥ 18)。
- 每个工具独立 URL(`/<id>/`),便于搜索引擎收录长尾关键词。
- 相对路径资源引用,可部署在任何子路径(如 GitHub Pages 项目页)。
- 主题(亮/暗)、复制提示、下载、广告位占位等公共能力集中在 `common.js`。
