;(function () {
  'use strict'
  var birthEl = document.getElementById('age-birth')
  var outEl = document.getElementById('age-out')

  var ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  var BRANCH_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

  // 星座分界(月,日)
  var CONSTELLATIONS = [
    { name: '摩羯座', m: 1, d: 20 }, { name: '水瓶座', m: 2, d: 19 }, { name: '双鱼座', m: 3, d: 21 },
    { name: '白羊座', m: 4, d: 20 }, { name: '金牛座', m: 5, d: 21 }, { name: '双子座', m: 6, d: 22 },
    { name: '巨蟹座', m: 7, d: 23 }, { name: '狮子座', m: 8, d: 23 }, { name: '处女座', m: 9, d: 23 },
    { name: '天秤座', m: 10, d: 24 }, { name: '天蝎座', m: 11, d: 23 }, { name: '射手座', m: 12, d: 22 },
    { name: '摩羯座', m: 12, d: 31 },
  ]

  function zodiac(year) {
    // 2020 年为鼠年
    return ZODIAC[((year - 2020) % 12 + 12) % 12]
  }

  function ganzhi(year) {
    return STEMS[((year - 4) % 10 + 10) % 10] + BRANCHES[((year - 4) % 12 + 12) % 12]
  }

  function constellation(m, d) {
    for (var i = 0; i < CONSTELLATIONS.length; i++) {
      if (m < CONSTELLATIONS[i].m || (m === CONSTELLATIONS[i].m && d <= CONSTELLATIONS[i].d)) {
        return CONSTELLATIONS[i].name
      }
    }
    return '摩羯座'
  }

  document.getElementById('age-run').addEventListener('click', function () {
    var v = birthEl.value
    if (!v) { outEl.textContent = '请选择出生日期'; return }
    var birth = new Date(v + 'T00:00:00')
    if (isNaN(birth.getTime())) { outEl.textContent = '无效日期'; return }
    var now = new Date()
    if (birth > now) { outEl.textContent = '出生日期不能晚于今天'; return }

    // 周岁
    var age = now.getFullYear() - birth.getFullYear()
    var mDiff = now.getMonth() - birth.getMonth()
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) age--
    // 虚岁
    var xu = now.getFullYear() - birth.getFullYear() + 1
    // 已出生天数
    var days = Math.floor((now.setHours(0, 0, 0, 0) - birth.getTime()) / 86400000)
    // 距下次生日
    var next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      next = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate())
    }
    var daysToNext = Math.round((next - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000)

    var year = birth.getFullYear()
    outEl.innerHTML =
      '周岁:<b>' + age + '</b> 岁　虚岁:<b>' + xu + '</b> 岁<br>' +
      '已出生:<b>' + days.toLocaleString('zh-CN') + '</b> 天　距离下次生日还有 <b>' + daysToNext + '</b> 天<br>' +
      '生肖:<b>' + zodiac(year) + '</b>　星座:<b>' + constellation(birth.getMonth() + 1, birth.getDate()) + '</b>　' +
      '干支纪年:<b>' + ganzhi(year) + '年</b>'
  })
})()
