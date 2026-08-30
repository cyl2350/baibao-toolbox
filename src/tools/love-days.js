;(function () {
  'use strict'
  var dateEl = document.getElementById('ld-date')
  var outEl = document.getElementById('ld-out')

  function fmt(d) {
    return d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日'
  }

  document.getElementById('ld-run').addEventListener('click', function () {
    var v = dateEl.value
    if (!v) { outEl.textContent = '请选择日期'; return }
    var start = new Date(v + 'T00:00:00')
    if (isNaN(start.getTime())) { outEl.textContent = '无效日期'; return }
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    if (start > today) { outEl.textContent = '在一起的日期不能晚于今天'; return }

    var days = Math.round((today - start) / 86400000)
    // 下一个里程碑(100/200/300/365/500/520/521/666/777/888/999/1000/1314/2000/3650)
    var milestones = [100, 200, 300, 365, 500, 520, 521, 666, 777, 888, 999, 1000, 1314, 2000, 3650]
    var nextMile = null
    for (var i = 0; i < milestones.length; i++) {
      if (days < milestones[i]) { nextMile = milestones[i]; break }
    }
    var weeks = Math.floor(days / 7)
    var months = Math.floor(days / 30)
    var years = Math.floor(days / 365)

    var html =
      '已在一起:<b style="font-size:26px">' + days + '</b> 天<br>' +
      '≈ <b>' + weeks + '</b> 周 · <b>' + months + '</b> 个月 · <b>' + years + '</b> 年<br>' +
      '纪念日:<b>' + fmt(start) + '</b> 开始<br>'
    if (nextMile) {
      var left = nextMile - days
      var target = new Date(start)
      target.setDate(target.getDate() + nextMile)
      html += '距离 <b>' + nextMile + '</b> 天纪念日还有 <b>' + left + '</b> 天(' + fmt(target) + ')<br>'
    }
    html += '1000 天纪念日:' + fmt(new Date(start.getTime() + 1000 * 86400000)) + '<br>'
    html += '<span class="tip">每一个值得纪念的日子,都是你们一起走过的路。</span>'
    outEl.innerHTML = html
  })

  document.getElementById('ld-today').addEventListener('click', function () {
    var t = new Date()
    var p = function (n) { return String(n).padStart(2, '0') }
    dateEl.value = t.getFullYear() + '-' + p(t.getMonth() + 1) + '-' + p(t.getDate())
    document.getElementById('ld-run').click()
  })
})()
