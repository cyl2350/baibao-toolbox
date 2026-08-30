;(function () {
  'use strict'
  var amountEl = document.getElementById('mt-amount')
  var rateEl = document.getElementById('mt-rate')
  var yearsEl = document.getElementById('mt-years')
  var methodEl = document.getElementById('mt-method')
  var outEl = document.getElementById('mt-out')
  var tbody = document.getElementById('mt-tbody')

  function money(n) { return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

  document.getElementById('mt-run').addEventListener('click', function () {
    var P = (parseFloat(amountEl.value) || 0) * 10000
    var annual = parseFloat(rateEl.value) || 0
    var years = parseInt(yearsEl.value, 10) || 1
    var n = years * 12
    var r = annual / 100 / 12
    if (P <= 0 || annual < 0 || years <= 0) { outEl.textContent = '请输入有效的贷款参数'; return }

    var rows = []
    var totalInterest, monthly
    if (methodEl.value === 'equal') {
      // 等额本息
      monthly = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
      totalInterest = monthly * n - P
      var remain = P
      for (var i = 1; i <= Math.min(n, 24); i++) {
        var interest = remain * r
        var principal = monthly - interest
        remain = Math.max(0, remain - principal)
        rows.push({ i: i, pay: monthly, principal: principal, interest: interest, remain: remain })
      }
      outEl.innerHTML =
        '月供:<b>' + money(monthly) + '</b> 元<br>' +
        '贷款总额:<b>' + money(P) + '</b> 元<br>' +
        '总利息:<b>' + money(totalInterest) + '</b> 元<br>' +
        '还款总额:<b>' + money(P + totalInterest) + '</b> 元'
    } else {
      // 等额本金
      var baseP = P / n
      var firstInterest = P * r
      var firstPay = baseP + firstInterest
      totalInterest = r * P * (n + 1) / 2
      var remain2 = P
      for (var j = 1; j <= Math.min(n, 24); j++) {
        var i2 = remain2 * r
        remain2 = Math.max(0, remain2 - baseP)
        rows.push({ i: j, pay: baseP + i2, principal: baseP, interest: i2, remain: remain2 })
      }
      outEl.innerHTML =
        '首月月供:<b>' + money(firstPay) + '</b> 元(每月递减 ' + money(P * r / n) + ' 元)<br>' +
        '贷款总额:<b>' + money(P) + '</b> 元<br>' +
        '总利息:<b>' + money(totalInterest) + '</b> 元<br>' +
        '还款总额:<b>' + money(P + totalInterest) + '</b> 元'
    }

    tbody.innerHTML = rows.map(function (row) {
      return '<tr><td style="padding:5px 8px">' + row.i + '</td><td style="padding:5px 8px;text-align:right">' + money(row.pay) +
        '</td><td style="padding:5px 8px;text-align:right">' + money(row.principal) +
        '</td><td style="padding:5px 8px;text-align:right">' + money(row.interest) +
        '</td><td style="padding:5px 8px;text-align:right">' + money(row.remain) + '</td></tr>'
    }).join('')
    window.bbToast('计算完成')
  })
})()
