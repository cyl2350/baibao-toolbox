;(function () {
  'use strict'
  var modeEl = document.getElementById('dc-mode')
  var diffRow = document.getElementById('dc-diff-row')
  var addRow = document.getElementById('dc-add-row')
  var outEl = document.getElementById('dc-out')

  function parse(v) {
    var d = new Date(v + 'T00:00:00')
    return isNaN(d.getTime()) ? null : d
  }
  function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / 86400000)
  }
  function workdays(a, b) {
    if (b < a) { var t = a; a = b; b = t }
    var count = 0
    var cur = new Date(a)
    while (cur <= b) {
      var day = cur.getDay()
      if (day !== 0 && day !== 6) count++
      cur.setDate(cur.getDate() + 1)
    }
    return count
  }

  modeEl.addEventListener('change', function () {
    diffRow.style.display = modeEl.value === 'diff' ? 'flex' : 'none'
    addRow.style.display = modeEl.value === 'add' ? 'flex' : 'none'
  })

  document.getElementById('dc-run').addEventListener('click', function () {
    if (modeEl.value === 'diff') {
      var a = parse(document.getElementById('dc-d1').value)
      var b = parse(document.getElementById('dc-d2').value)
      if (!a || !b) { outEl.textContent = '请选择有效日期'; return }
      var diff = daysBetween(a, b)
      var sign = diff < 0 ? '-' : ''
      var abs = Math.abs(diff)
      var weeks = Math.floor(abs / 7)
      var wd = workdays(a, b)
      outEl.innerHTML =
        '相隔天数:<b>' + sign + abs + '</b> 天<br>' +
        '约 <b>' + sign + weeks + '</b> 周零 ' + sign + (abs % 7) + ' 天<br>' +
        '其中工作日(周一~周五):<b>' + wd + '</b> 天<br>' +
        '结束日期是星期' + '日一二三四五六'[b.getDay()] + ';开始日期是星期' + '日一二三四五六'[a.getDay()]
    } else {
      var base = parse(document.getElementById('dc-base').value)
      var days = parseInt(document.getElementById('dc-days').value, 10) || 0
      if (!base) { outEl.textContent = '请选择有效日期'; return }
      var res = new Date(base)
      res.setDate(res.getDate() + days)
      outEl.innerHTML =
        base.getFullYear() + '-' + String(base.getMonth() + 1).padStart(2, '0') + '-' + String(base.getDate()).padStart(2, '0') +
        (days >= 0 ? ' 加上 ' : ' 减去 ') + Math.abs(days) + ' 天 = <b>' +
        res.getFullYear() + '-' + String(res.getMonth() + 1).padStart(2, '0') + '-' + String(res.getDate()).padStart(2, '0') +
        '</b> (星期' + '日一二三四五六'[res.getDay()] + ')'
    }
  })
})()
