;(function () {
  'use strict'
  var aEl = document.getElementById('tz-a')
  var bEl = document.getElementById('tz-b')
  var timeEl = document.getElementById('tz-time')
  var outEl = document.getElementById('tz-out')

  var ZONES = [
    { city: '北京', offset: 8 }, { city: '上海', offset: 8 }, { city: '香港', offset: 8 },
    { city: '东京', offset: 9 }, { city: '首尔', offset: 9 }, { city: '悉尼', offset: 10 },
    { city: '新加坡', offset: 8 }, { city: '曼谷', offset: 7 }, { city: '迪拜', offset: 4 },
    { city: '莫斯科', offset: 3 }, { city: '柏林', offset: 1 }, { city: '巴黎', offset: 1 },
    { city: '伦敦', offset: 0 }, { city: '纽约', offset: -5 }, { city: '洛杉矶', offset: -8 },
    { city: '旧金山', offset: -8 }, { city: '芝加哥', offset: -6 }, { city: '温哥华', offset: -8 },
    { city: '多伦多', offset: -5 }, { city: '圣保罗', offset: -3 }, { city: 'UTC', offset: 0 },
  ]

  function fill(sel) {
    sel.innerHTML = ZONES.map(function (z, i) {
      var off = (z.offset >= 0 ? 'UTC+' : 'UTC') + z.offset
      return '<option value="' + i + '">' + z.city + ' (' + off + ')</option>'
    }).join('')
  }
  fill(aEl)
  fill(bEl)
  aEl.value = '0' // 北京
  bEl.value = '13' // 伦敦

  function fmt(d) {
    function p(n) { return String(n).padStart(2, '0') }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
  }

  document.getElementById('tz-run').addEventListener('click', function () {
    var za = ZONES[+aEl.value]
    var zb = ZONES[+bEl.value]
    var base
    if (timeEl.value) {
      base = new Date(timeEl.value)
      if (isNaN(base.getTime())) { outEl.textContent = '时间格式无效'; return }
      // 把用户输入的 A 地本地时间换算成 UTC 时刻
      base = new Date(base.getTime() - za.offset * 3600000)
    } else {
      base = new Date()
    }
    var ta = new Date(base.getTime() + za.offset * 3600000)
    var tb = new Date(base.getTime() + zb.offset * 3600000)
    var diff = zb.offset - za.offset
    outEl.innerHTML =
      za.city + ' 时间:<b>' + fmt(ta) + '</b> (UTC' + (za.offset >= 0 ? '+' : '') + za.offset + ')<br>' +
      zb.city + ' 时间:<b>' + fmt(tb) + '</b> (UTC' + (zb.offset >= 0 ? '+' : '') + zb.offset + ')<br>' +
      '时差:' + zb.city + ' 比 ' + za.city + (diff >= 0 ? ' 快 ' : ' 慢 ') + Math.abs(diff) + ' 小时'
  })
})()
