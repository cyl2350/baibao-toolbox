;(function () {
  'use strict'
  var inEl = document.getElementById('idc-in')
  var outEl = document.getElementById('idc-out')

  var WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  var CHECK = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  var PROVINCES = {
    '11': '北京市', '12': '天津市', '13': '河北省', '14': '山西省', '15': '内蒙古自治区',
    '21': '辽宁省', '22': '吉林省', '23': '黑龙江省',
    '31': '上海市', '32': '江苏省', '33': '浙江省', '34': '安徽省', '35': '福建省', '36': '江西省', '37': '山东省',
    '41': '河南省', '42': '湖北省', '43': '湖南省', '44': '广东省', '45': '广西壮族自治区', '46': '海南省',
    '50': '重庆市', '51': '四川省', '52': '贵州省', '53': '云南省', '54': '西藏自治区',
    '61': '陕西省', '62': '甘肃省', '63': '青海省', '64': '宁夏回族自治区', '65': '新疆维吾尔自治区',
    '71': '台湾省', '81': '香港特别行政区', '82': '澳门特别行政区',
  }

  var ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  var CONSTELLATIONS = [
    { name: '摩羯座', m: 1, d: 20 }, { name: '水瓶座', m: 2, d: 19 }, { name: '双鱼座', m: 3, d: 21 },
    { name: '白羊座', m: 4, d: 20 }, { name: '金牛座', m: 5, d: 21 }, { name: '双子座', m: 6, d: 22 },
    { name: '巨蟹座', m: 7, d: 23 }, { name: '狮子座', m: 8, d: 23 }, { name: '处女座', m: 9, d: 23 },
    { name: '天秤座', m: 10, d: 24 }, { name: '天蝎座', m: 11, d: 23 }, { name: '射手座', m: 12, d: 22 },
    { name: '摩羯座', m: 12, d: 31 },
  ]

  function constellation(m, d) {
    for (var i = 0; i < CONSTELLATIONS.length; i++) {
      if (m < CONSTELLATIONS[i].m || (m === CONSTELLATIONS[i].m && d <= CONSTELLATIONS[i].d)) return CONSTELLATIONS[i].name
    }
    return '摩羯座'
  }

  document.getElementById('idc-run').addEventListener('click', function () {
    var id = inEl.value.trim().toUpperCase()
    var err = []
    if (!/^\d{17}[\dX]$/.test(id)) { outEl.textContent = '格式错误:必须为 17 位数字 + 1 位数字或 X'; return }
    // 出生日期
    var y = +id.slice(6, 10), m = +id.slice(10, 12), d = +id.slice(12, 14)
    var birth = new Date(y, m - 1, d)
    var validDate = birth.getFullYear() === y && birth.getMonth() === m - 1 && birth.getDate() === d &&
      y >= 1900 && new Date(y, m - 1, d) <= new Date()
    if (!validDate) err.push('出生日期不合法')
    // 校验码
    var sum = 0
    for (var i = 0; i < 17; i++) sum += +id[i] * WEIGHTS[i]
    var expect = CHECK[sum % 11]
    if (id[17] !== expect) err.push('校验码错误(应为 ' + expect + ')')
    // 省级
    var province = PROVINCES[id.slice(0, 2)] || '未知省份'
    var sex = (+id[16] % 2 === 0) ? '女' : '男'
    var zodiac = ZODIAC[((y - 2020) % 12 + 12) % 12]

    if (err.length) {
      outEl.innerHTML = '<b style="color:var(--err)">✗ 校验未通过</b><br>' + err.map(function (e) { return '· ' + e }).join('<br>') +
        '<br><span class="tip">出生日期解析:' + y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0') +
        ',户籍省份:' + province + ',性别:' + sex + '</span>'
      return
    }
    var age = new Date().getFullYear() - y - (new Date().getMonth() + 1 < m || (new Date().getMonth() + 1 === m && new Date().getDate() < d) ? 1 : 0)
    outEl.innerHTML =
      '<b style="color:var(--ok)">✓ 校验通过(格式、日期、校验码均正确)</b><br>' +
      '出生日期:<b>' + y + ' 年 ' + m + ' 月 ' + d + ' 日</b>(年龄 ' + age + ' 岁)<br>' +
      '性别:<b>' + sex + '</b>　户籍省份:<b>' + province + '</b><br>' +
      '生肖:<b>' + zodiac + '</b>　星座:<b>' + constellation(m, d) + '</b><br>' +
      '<span class="tip">提示:归属地仅到省级,详细市县需官方数据。请勿在非必要场景随意提供身份证号。</span>'
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('idc-run').click() })
})()
