;(function () {
  'use strict'
  var inEl = document.getElementById('ts-in')
  var outEl = document.getElementById('ts-out')
  var out2El = document.getElementById('ts-out2')
  var dtEl = document.getElementById('ts-dt')

  var cn = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  var utc = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  var weekday = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', weekday: 'long' })

  document.getElementById('ts-convert').addEventListener('click', function () {
    var raw = inEl.value.trim()
    if (!raw) { window.bbToast('请输入时间戳'); return }
    var n = Number(raw)
    if (!isFinite(n) || n <= 0) { outEl.textContent = '无效的时间戳'; return }
    var ms = String(Math.round(n)).length > 10 ? n : n * 1000
    var d = new Date(ms)
    if (isNaN(d.getTime())) { outEl.textContent = '超出可表示的时间范围'; return }
    outEl.textContent =
      '北京时间:' + cn.format(d) + ' ' + weekday.format(d) + '\n' +
      'UTC 时间:' + utc.format(d) + '\n' +
      'ISO 8601:' + d.toISOString() + '\n' +
      '秒级:' + Math.floor(ms / 1000) + '  毫秒级:' + ms
  })

  document.getElementById('ts-now').addEventListener('click', function () {
    var ms = Date.now()
    inEl.value = String(ms)
    var d = new Date(ms)
    outEl.textContent = '秒级:' + Math.floor(ms / 1000) + '\n毫秒级:' + ms + '\n当前时间:' + cn.format(d)
  })

  document.getElementById('ts-reverse').addEventListener('click', function () {
    var v = dtEl.value
    if (!v) { window.bbToast('请先选择日期时间'); return }
    var d = new Date(v)
    if (isNaN(d.getTime())) { out2El.textContent = '无效的日期时间'; return }
    out2El.textContent = '秒级:' + Math.floor(d.getTime() / 1000) + '\n毫秒级:' + d.getTime()
  })
})()
