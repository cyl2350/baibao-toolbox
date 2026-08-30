// ============================================================
// 教程文章清单:每篇生成独立 SEO 页面 dist/articles/<id>/index.html
// body: 文章正文 HTML(存于 src/articles/<id>.html)
// tool: 关联工具页(用于内链)
// ============================================================

export const articles = [
  {
    id: 'image-compress-guide',
    title: '图片太大怎么办?在线压缩图片的 5 个实用技巧',
    category: '图片处理',
    date: '2025-01-10',
    desc: '图片太大发不出去?本文教你 5 个免费压缩图片的技巧,从选格式、调质量到在线工具,手机电脑都适用。',
    keywords: '图片太大怎么压缩,图片压缩技巧,图片太大怎么办,压缩图片不糊',
    tool: 'image-compress',
  },
  {
    id: 'mortgage-guide',
    title: '房贷月供怎么算?等额本息和等额本金到底有什么区别',
    category: '生活计算',
    date: '2025-01-10',
    desc: '买房必看:房贷月供的计算公式、等额本息与等额本金的区别、提前还款怎么选,附在线房贷计算器。',
    keywords: '房贷月供怎么算,等额本息和等额本金的区别,房贷利率计算,提前还款',
    tool: 'mortgage',
  },
  {
    id: 'timestamp-guide',
    title: '时间戳是什么?Unix 时间戳入门与常见问题解答',
    category: '开发工具',
    date: '2025-01-10',
    desc: '程序员必懂的时间戳:什么是 Unix 时间戳、秒和毫秒怎么区分、为什么用 1970 年,附在线转换工具。',
    keywords: '时间戳是什么,unix时间戳,时间戳换算,13位时间戳',
    tool: 'timestamp',
  },
  {
    id: 'bmi-guide',
    title: 'BMI 多少算正常?中国成人标准对照表与常见误区',
    category: '生活计算',
    date: '2025-01-10',
    desc: 'BMI 指数怎么看?中国成人标准与 WHO 标准有何不同,健身人群 BMI 偏高正常吗,附在线 BMI 计算器。',
    keywords: 'bmi多少算正常,bmi标准对照表,体重指数,中国bmi标准',
    tool: 'bmi',
  },
  {
    id: 'base64-guide',
    title: 'Base64 是什么?编码原理、常见用途与在线转换',
    category: '编码转换',
    date: '2025-01-10',
    desc: 'Base64 编码入门:它是什么、为什么图片和接口里到处是它、中文乱码怎么解决,附在线编解码工具。',
    keywords: 'base64是什么,base64编码原理,base64有什么用,base64中文乱码',
    tool: 'base64',
  },
  {
    id: 'qrcode-guide',
    title: '二维码是怎么生成的?免费在线生成二维码的 3 种方法',
    category: '图片处理',
    date: '2025-01-10',
    desc: '二维码生成原理入门:QR 码如何编码信息、容错等级是什么意思,附免费在线二维码生成器使用方法。',
    keywords: '二维码怎么生成,二维码生成原理,免费二维码生成器,qr码容错',
    tool: 'qrcode',
  },
  {
    id: 'date-calc-guide',
    title: '日期差怎么算?相隔天数、工作日计算的 3 个实用场景',
    category: '生活计算',
    date: '2025-01-10',
    desc: '合同期限、倒计时、排期都离不开日期计算:自然日与工作日的区别、跨月跨年怎么算,附在线日期计算器。',
    keywords: '日期差怎么算,相隔天数计算,工作日计算,日期加减,倒计时计算',
    tool: 'date-calculator',
  },
  {
    id: 'rmb-upper-guide',
    title: '人民币大写怎么写?金额大写转换的规则与常见错误',
    category: '生活计算',
    date: '2025-01-10',
    desc: '发票、报销、合同上的金额大写怎么填?大写数字规则、零的处理、常见错误一次讲清,附在线转换工具。',
    keywords: '人民币大写怎么写,金额大写规则,发票大写,数字转大写,大写金额',
    tool: 'rmb-upper',
  },
  {
    id: 'random-picker-guide',
    title: '随机抽奖怎么做才公平?抽奖工具的使用与常见坑',
    category: '生活计算',
    date: '2025-01-10',
    desc: '年会抽奖、课堂点名、幸运观众怎么抽才公平?伪随机与真随机的区别,附免费随机抽取工具。',
    keywords: '随机抽奖,抽奖工具,公平抽奖,点名器,随机数',
    tool: 'random-picker',
  },
]
