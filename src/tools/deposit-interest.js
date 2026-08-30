;(function () {
  'use strict'
  var outEl = document.getElementById('di-out')

  function money(n) { return Math.round(n).toLocaleString('zh-CN') }

  document.getElementById('di-run').addEventListener('click', function () {
    var P = parseFloat(document.getElementById('di-principal').value)
    var rate = parseFloat(document.getElementById('di-rate').value)
    var years = parseInt(document.getElementById('di-years').value, 10)
    if (isNaN(P) || P < 0) { outEl.textContent = '请输入有效本金'; return }
    if (isNaN(rate) || rate < 0) { outEl.textContent = '请输入有效年利率'; return }
    if (isNaN(years) || years < 1 || years > 30) { outEl.textContent = '存期需在 1~30 年之间'; return }

    var r = rate / 100
    var simpleInterest = P * r * years
    var simpleTotal = P + simpleInterest
    var compoundTotal = P * Math.pow(1 + r, years)
    var compoundInterest = compoundTotal - P

    outEl.innerHTML =
      '—— 单利(整存整取)——<br>' +
      '到期利息:<b>' + money(simpleInterest) + '</b> 元<br>' +
      '到期本息合计:<b>' + money(simpleTotal) + '</b> 元<br><br>' +
      '—— 复利(每年转存)——<br>' +
      '到期本息:<b style="font-size:20px">' + money(compoundTotal) + '</b> 元<br>' +
      '复利利息:<b>' + money(compoundInterest) + '</b> 元(比单利多 ' + money(compoundInterest - simpleInterest) + ' 元)<br>' +
      '<span class="tip">利率仅供参考:2025 年前后国有大行一年期定存约 1%~1.5%,三年期约 2% 左右,以银行当期挂牌为准。</span>'
  })

  document.getElementById('di-demo').addEventListener('click', function () {
    document.getElementById('di-principal').value = '100000'
    document.getElementById('di-rate').value = '2.5'
    document.getElementById('di-years').value = '3'
    document.getElementById('di-run').click()
  })
})()
