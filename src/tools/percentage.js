;(function () {
  'use strict'
  var modeEl = document.getElementById('pct-mode')
  var in1El = document.getElementById('pct-in1')
  var in2El = document.getElementById('pct-in2')
  var label1El = document.getElementById('pct-label1')
  var label2El = document.getElementById('pct-label2')
  var outEl = document.getElementById('pct-out')

  modeEl.addEventListener('change', function () {
    if (modeEl.value === 'of') {
      label1El.textContent = '数值 X'
      label2El.textContent = '百分比 Y(%)'
    } else if (modeEl.value === 'ratio') {
      label1El.textContent = '数值 X(部分)'
      label2El.textContent = '数值 Y(总量)'
    } else {
      label1El.textContent = '数值 X'
      label2El.textContent = '变化百分比 Y(%)'
    }
  })

  document.getElementById('pct-run').addEventListener('click', function () {
    var x = parseFloat(in1El.value)
    var y = parseFloat(in2El.value)
    if (isNaN(x) || isNaN(y)) { outEl.textContent = '请输入有效数字'; return }
    var mode = modeEl.value
    if (mode === 'of') {
      outEl.innerHTML = x + ' 的 ' + y + '% = <b>' + (x * y / 100).toLocaleString('zh-CN', { maximumFractionDigits: 6 }) + '</b>'
    } else if (mode === 'ratio') {
      if (y === 0) { outEl.textContent = '总量不能为 0'; return }
      outEl.innerHTML = x + ' 占 ' + y + ' 的 <b>' + (x / y * 100).toFixed(2) + '%</b>'
    } else {
      var result = x * (1 + y / 100)
      var verb = y >= 0 ? '增加' : '减少'
      outEl.innerHTML = x + ' ' + verb + ' ' + Math.abs(y) + '% 后 = <b>' + result.toLocaleString('zh-CN', { maximumFractionDigits: 6 }) + '</b>'
    }
  })
})()
