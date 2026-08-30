// ============================================================
// 闲鱼 AI 代运营工作台 · 物料生成器
// 用法: node scripts/gen-xianyu-kit.mjs   (或 npm run xianyu)
// 数据源: config/xianyu.mjs(改产品/话术/任务,重跑一次即可)
// 输出:   docs/闲鱼AI代运营工作台/
// ============================================================
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { xianyu, listingBlock } from '../config/xianyu.mjs'

const root = process.cwd()
const OUT = 'docs/闲鱼AI代运营工作台'
const CARDS = join(OUT, '上架卡片')

const pad = (n) => String(n).padStart(2, '0')
const now = new Date()
const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

mkdirSync(join(root, CARDS), { recursive: true })

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

// ---------------- 5. 工作台(离线 HTML 仪表盘) ----------------
const template = readFileSync(join(root, 'src/xianyu-workbench.template.html'), 'utf8')
const data = JSON.stringify({
  shop: xianyu.shop,
  products,
  replies: xianyu.replies,
  routine: xianyu.routine,
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
4. **任务**:「任务」页勾选今日清单(自动按天保存);
5. **台账**:「台账」页每单记一笔,可导出 CSV。

## 文件清单

| 文件 | 说明 |
| --- | --- |
| \`工作台.html\` | 离线仪表盘:上架卡片 / 回复话术 / 今日任务 / 销售台账 |
| \`上架卡片/\` | 每款产品一张卡片(标题/描述/图片/设置),共 ${products.length} 张 |
| \`回复话术库.md\` | 买家消息回复话术全集 |
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
  join(OUT, '今日任务.md'),
  join(OUT, '销售台账.csv'),
  ...products.map((p, i) => join(CARDS, `${pad(i + 1)}-${p.id}.md`)),
]
console.log('✔ 闲鱼 AI 代运营工作台生成完毕')
console.log(`  · 上架卡片 ${products.length} 张 · 话术 ${Object.values(xianyu.replies).flat().length} 条 · 任务 ${Object.values(xianyu.routine).flat().length} 项`)
for (const f of outFiles) {
  const full = join(root, f)
  const { statSync } = await import('node:fs')
  console.log(`  · ${f} (${statSync(full).size} B)`)
}
