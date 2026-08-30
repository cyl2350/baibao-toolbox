// ============================================================
// 站点全局配置 —— 部署/变现前只需改这里
// ============================================================
export const site = {
  name: '百宝工具箱',
  shortName: '百宝',
  slogan: '免费、轻量、无广告弹窗的在线工具集',
  // 部署后换成你的真实域名(不带 https:// 前缀,如 www.example.com)
  domain: 'www.baibao-toolbox.example',
  // 备案号(国内服务器部署时填写,如 京ICP备XXXXXXXX号;海外托管可不填)
  icp: '',
  // 版权年份
  year: new Date().getFullYear(),
  // 联系邮箱(用于广告合作等)
  email: 'contact@example.com',
  // 站点描述(首页 meta)
  description:
    '百宝工具箱提供二维码生成、图片压缩、房贷计算、日期计算、人民币大写、BMI计算、JSON格式化、时间戳转换、Base64编解码、Markdown编辑器等 26 款免费在线工具,无需注册下载,打开即用。',

  // ---------------- 变现配置 ----------------
  monetization: {
    // Google AdSense 发布商 ID,如 ca-pub-XXXXXXXXXXXXXXXX;申请通过后填入即可显示广告
    adsenseClient: '',
    // 百度联盟 广告位 ID(需要国内备案域名);不填则跳过
    baiduAdUnit: '',
    // 淘宝客/联盟推广位(页面预留的推荐位,可放自己的推广链接)
    taokeUrl: '',
  },

  // ---------------- 统计配置 ----------------
  analytics: {
    // 百度统计 hm.js 的站点 ID(形如 1a2b3c...);不填则不注入
    baiduTongjiId: '',
    // Google Analytics 4 的测量 ID(形如 G-XXXXXXXXXX);不填则不注入
    ga4Id: '',
  },
}

// 网站底部导航内容页(自动生成对应页面并加入 sitemap)
export const pages = [
  { id: 'about', title: '关于我们', desc: '了解百宝工具箱的定位、理念与联系方式。' },
  { id: 'privacy', title: '隐私政策', desc: '百宝工具箱的隐私政策:本站在浏览器本地处理您的数据,不上传服务器。' },
  { id: 'disclaimer', title: '免责声明', desc: '百宝工具箱的免责声明与使用条款。' },
]
