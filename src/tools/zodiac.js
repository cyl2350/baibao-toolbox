;(function () {
  'use strict'
  var birthEl = document.getElementById('zd-birth')
  var outEl = document.getElementById('zd-out')

  var ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  var STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  var BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

  var CONSTELLATIONS = [
    { name: '摩羯座', m: 1, d: 20 }, { name: '水瓶座', m: 2, d: 19 }, { name: '双鱼座', m: 3, d: 21 },
    { name: '白羊座', m: 4, d: 20 }, { name: '金牛座', m: 5, d: 21 }, { name: '双子座', m: 6, d: 22 },
    { name: '巨蟹座', m: 7, d: 23 }, { name: '狮子座', m: 8, d: 23 }, { name: '处女座', m: 9, d: 23 },
    { name: '天秤座', m: 10, d: 24 }, { name: '天蝎座', m: 11, d: 23 }, { name: '射手座', m: 12, d: 22 },
    { name: '摩羯座', m: 12, d: 31 },
  ]

  function zodiac(year) { return ANIMALS[((year - 2020) % 12 + 12) % 12] }
  function ganzhi(year) { return STEMS[((year - 4) % 10 + 10) % 10] + BRANCHES[((year - 4) % 12 + 12) % 12] }
  function constellation(m, d) {
    for (var i = 0; i < CONSTELLATIONS.length; i++) {
      if (m < CONSTELLATIONS[i].m || (m === CONSTELLATIONS[i].m && d <= CONSTELLATIONS[i].d)) return CONSTELLATIONS[i].name
    }
    return '摩羯座'
  }

  var TRAITS = {
    '鼠': '机智灵活,善于交际,适应力强', '牛': '踏实稳重,勤奋坚韧,责任感强',
    '虎': '勇敢自信,行动力强,富有魄力', '兔': '温和细心,善解人意,审美在线',
    '龙': '自信果敢,志向远大,气场强大', '蛇': '冷静理性,洞察力强,深思熟虑',
    '马': '热情奔放,精力充沛,追求自由', '羊': '温柔善良,创造力强,重感情',
    '猴': '聪明机敏,幽默风趣,应变力强', '鸡': '认真细致,追求完美,直言不讳',
    '狗': '忠诚正直,责任心强,讲义气', '猪': '豁达乐观,诚实宽厚,心态好',
  }

  document.getElementById('zd-run').addEventListener('click', function () {
    var v = birthEl.value
    if (!v) { outEl.textContent = '请选择出生日期'; return }
    var birth = new Date(v + 'T00:00:00')
    if (isNaN(birth.getTime())) { outEl.textContent = '无效日期'; return }
    var year = birth.getFullYear()
    var z = zodiac(year)
    var cs = constellation(birth.getMonth() + 1, birth.getDate())
    outEl.innerHTML =
      '生肖:<b style="font-size:22px">' + z + '</b>　星座:<b style="font-size:22px">' + cs + '</b><br>' +
      '干支纪年:<b>' + ganzhi(year) + '年</b>(' + year + ' 年出生)<br>' +
      '生肖性格简析:' + TRAITS[z]
  })
})()
