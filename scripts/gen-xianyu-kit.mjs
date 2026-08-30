// ============================================================
// 闲鱼 AI 代运营工作台 · 物料生成器
// 用法: node scripts/gen-xianyu-kit.mjs   (或 npm run xianyu)
// 数据源: config/xianyu.mjs(改产品/话术/任务,重跑一次即可)
// 输出:   docs/闲鱼AI代运营工作台/
// ============================================================
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { xianyu, listingBlock } from '../config/xianyu.mjs'
import { parseNotes, buildPlan } from './lib/xhs-notes.mjs'

const root = process.cwd()
const OUT = 'docs/闲鱼AI代运营工作台'
const CARDS = join(OUT, '上架卡片')

const pad = (n) => String(n).padStart(2, '0')
const now = new Date()
const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

mkdirSync(join(root, CARDS), { recursive: true })

// ---------------- 小红书笔记解析 + 多平台文案 ----------------
const xhsNotes = parseNotes(readFileSync(join(root, 'docs/运营/小红书引流笔记.md'), 'utf8'))
const plan = buildPlan(xhsNotes, 4)
const XHS_NOTE_BY_PRODUCT = { 'ai-handbook': 7, 'xhs-templates': 8, 'resume-pack': 9, 'bundle-5in1': 10 }
function platformCopy(p) {
  const note = xhsNotes.find((n) => n.no === XHS_NOTE_BY_PRODUCT[p.id])
  const xhs = note
    ? { title: note.title, body: note.body.join('\n') }
    : {
        title: p.id === 'gzh-cheatsheet'
          ? '公众号排版字号行距配色,一张速查表全搞定 ✍️'
          : '36 个 AI 办公脚本,批量改名压缩合并 Excel 直接抄 ⚡',
        body: [p.desc[0], p.desc[1], `评论区扣「${p.tags[0]}」或私信~ 网盘秒发,原创整理可商用。`].join('\n'),
      }
  return {
    xhs,
    video: `【${p.name}】${p.tags[0]}效率神器,网盘秒发,点击橱窗直接买~`,
    moment: `${p.name}上架啦!${p.tags[0]}效率神器,网盘秒发,私信领链接~ #闲鱼 #效率工具 #副业`,
    star: `# 星球福利 · ${p.name}\n\n${p.desc.join('\n')}\n\n定价 ¥${p.price},星球成员专享 ¥${p.promoPrice},评论区扣「${p.tags[0]}」领取。`,
  }
}

// ---------------- 1. 上架卡片(每款一张) ----------------
const products = xianyu.products
products.forEach((p, i) => {
  const block = listingBlock(p, xianyu.shop)
  const md = `# ${pad(i + 1)} · ${p.name}

> 定价 **¥${p.price}**(新号跑量价 **¥${p.promoPrice}**) · 上架约 3 分钟 · 每天「擦亮」1 次

## ① 标题(直接复制)
\`\`\`
${p.title}
\`\`\`

## ② 描述(直接复制)
\`\`\`
${p.desc.join('\n')}
\`\`\`

## ③ 图片(按顺序传到手机,再上传闲鱼)
\`\`\`
${p.images.map((im) => 'docs/产品/详情图打包/' + im).join('\n')}
\`\`\`

## ④ 其他设置
- 类目:${p.category}
- 价格:${p.price}(建议新号先用 ${p.promoPrice} 跑量,看数据再调)
- 发货方式:${xianyu.shop.delivery}(建议开启闲鱼「虚拟商品自动发货」,成交后系统自动发)

## ⑤ 发布 → 完成,记入台账
`
  writeFileSync(join(root, CARDS, `${pad(i + 1)}-${p.id}.md`), md)
})

// ---------------- 2. 回复话术库 ----------------
const replyMd = `# 💬 买家消息回复话术库(AI 预生成 · 一键复制)

> 更新方式:改 \`config/xianyu.mjs\` 的 \`replies\`,然后 \`npm run xianyu\` 重新生成。

${Object.entries(xianyu.replies)
  .map(
    ([cat, list]) => `## ${cat}

${list.map((t) => `\`\`\`\n${t}\n\`\`\``).join('\n\n')}`
  )
  .join('\n\n')}

---
> 发货通用:把话术里的【粘贴网盘链接】换成 ${xianyu.shop.netdisk},【密码】换成 ${xianyu.shop.netdiskPwd}。
`
writeFileSync(join(root, OUT, '回复话术库.md'), replyMd)

// ---------------- 3. 今日任务(带日期) ----------------
const titles = { morning: '早上(5 分钟)', noon: '中午(5 分钟)', evening: '晚上(10 分钟)', weekly: '每周' }
const taskMd = `# ✅ 闲鱼今日任务(${today})

> 每天打开 ` + '`工作台.html`' + ` 勾选完成;或复制到备忘录。次日重新运行 \`npm run xianyu\` 刷新日期。

${Object.entries(xianyu.routine)
  .map(
    ([g, list]) => `## ${titles[g] || g}

${list.map((t) => `- [ ] ${t}`).join('\n')}`
  )
  .join('\n\n')}

---
**收尾 3 件事:** ① 台账记一笔(工作台「台账」页) ② 回复所有未读 ③ 数据复盘(曝光 < 50 换标题/首图,咨询 < 3 降价试水)。
`
writeFileSync(join(root, OUT, '今日任务.md'), taskMd)

// ---------------- 4. 销售台账(CSV 模板) ----------------
writeFileSync(
  join(root, OUT, '销售台账.csv'),
  '\uFEFF日期,产品,金额,备注\n' + products.map((p) => `${today},${p.name},,`).join('\n') + '\n'
)

// ---------------- 4.5 小红书引流轮发计划 ----------------
const planMd = `# 📅 小红书引流轮发计划(未来 4 周)

> 规则:每周二/四/六发,引流(A)与卖产品(B)交替;每篇间隔 ≥ 14 天。工作台「引流」页标记已发后,自动跳过近 14 天发过的笔记。
> 生成时间:${stamp}

| 日期 | 星期 | 类型 | 笔记 |
| --- | --- | --- | --- |
${plan.map((r) => `| ${r.date} | ${r.weekday} | ${r.type === 'A' ? '引流' : '卖产品'} | 第 ${r.no} 条 · ${r.title} |`).join('\n')}

---
> 笔记全文在 \`docs/运营/小红书引流笔记.md\`(10 条);封面建议:工具截图/大字标题,手机截图即可,别用网图。
`
writeFileSync(join(root, OUT, '引流计划.md'), planMd)

// ---------------- 4.6 多平台分发文案 ----------------
const multiMd = `# 📤 多平台分发文案(一键复制)

> 同一套产品,4 个渠道现成文案:小红书笔记 / 视频号橱窗 / 朋友圈 / 知识星球(闲鱼版见「上架卡片」)。
> 更新方式:改 \`config/xianyu.mjs\` 后 \`npm run xianyu\` 重新生成。

${products
  .map((p, i) => {
    const c = platformCopy(p)
    return `## ${i + 1}. ${p.name}(¥${p.price})

### 小红书笔记
\`\`\`
${c.xhs.title}

${c.xhs.body}
\`\`\`

### 视频号橱窗
\`\`\`
${c.video}
\`\`\`

### 朋友圈
\`\`\`
${c.moment}
\`\`\`

### 知识星球
\`\`\`
${c.star}
\`\`\`
`
  })
  .join('\n')}
`
writeFileSync(join(root, OUT, '多平台文案.md'), multiMd)

// ---------------- 5. 工作台(离线 HTML 仪表盘) ----------------
const template = readFileSync(join(root, 'src/xianyu-workbench.template.html'), 'utf8')
const data = JSON.stringify({
  shop: xianyu.shop,
  products,
  replies: xianyu.replies,
  routine: xianyu.routine,
  xhsNotes,
  plan,
  multi: products.map((p) => ({ name: p.name, price: p.price, platforms: platformCopy(p) })),
  generated: stamp,
})
const html = template.replace('/*__DATA__*/', data)
writeFileSync(join(root, OUT, '工作台.html'), html)

// ---------------- 6. README 索引 ----------------
const readme = `# 🛠 闲鱼 AI 代运营工作台

> AI 已把"想文案→想话术→排任务→记台账"全部自动化,你只做最后一步:**粘贴发布 / 回复买家**(每款约 3 分钟)。
> 数据源:\`config/xianyu.mjs\` · 重新生成:\`npm run xianyu\` · 生成时间:${stamp}

## 怎么用(每天 10 分钟)

1. **打开工作台**:双击 \`工作台.html\`(离线可用,数据存在本机浏览器);
2. **上架**:「上架」页 → 复制整套文案 → 手机传图(图片在 \`docs/产品/详情图打包/\`)→ 粘贴发布;
3. **回复**:「话术」页搜索关键词(发货/砍价/好评)一键复制;
4. **引流**:「引流」页看今天该发哪条小红书笔记,发完点「标记已发」(自动轮换不重复);
5. **多平台**:「多平台」页一键复制小红书/视频号橱窗/朋友圈/知识星球文案;
6. **任务**:「任务」页勾选今日清单(自动按天保存);
7. **台账**:「台账」页每单记一笔,可导出 CSV。

## 文件清单

| 文件 | 说明 |
| --- | --- |
| \`工作台.html\` | 离线仪表盘:上架 / 话术 / 引流 / 多平台 / 任务 / 台账 |
| \`上架卡片/\` | 每款产品一张卡片(标题/描述/图片/设置),共 ${products.length} 张 |
| \`回复话术库.md\` | 买家消息回复话术全集 |
| \`引流计划.md\` | 小红书未来 4 周轮发计划(周二/四/六) |
| \`多平台文案.md\` | 小红书/视频号/朋友圈/知识星球 分发文案 |
| \`今日任务.md\` | 带日期的每日运营清单 |
| \`销售台账.csv\` | 销售记录表(工作台导出同格式) |

## 上架顺序建议

${products.map((p, i) => `${i + 1}. **${p.name}**(¥${p.price},跑量 ¥${p.promoPrice})`).join('\n')}

> 合规提醒:只卖原创内容;标题/描述不用「最」「第一」「百分百」等违禁词;收款走闲鱼官方交易,不私下转账。
`
writeFileSync(join(root, OUT, 'README.md'), readme)

// ---------------- 汇总校验 ----------------
const outFiles = [
  join(OUT, 'README.md'),
  join(OUT, '工作台.html'),
  join(OUT, '回复话术库.md'),
  join(OUT, '引流计划.md'),
  join(OUT, '多平台文案.md'),
  join(OUT, '今日任务.md'),
  join(OUT, '销售台账.csv'),
  ...products.map((p, i) => join(CARDS, `${pad(i + 1)}-${p.id}.md`)),
]
console.log('✔ 闲鱼 AI 代运营工作台生成完毕')
console.log(`  · 上架卡片 ${products.length} 张 · 话术 ${Object.values(xianyu.replies).flat().length} 条 · 任务 ${Object.values(xianyu.routine).flat().length} 项 · 引流笔记 ${xhsNotes.length} 条 · 轮发计划 ${plan.length} 期`)
for (const f of outFiles) {
  const full = join(root, f)
  const { statSync } = await import('node:fs')
  console.log(`  · ${f} (${statSync(full).size} B)`)
}
