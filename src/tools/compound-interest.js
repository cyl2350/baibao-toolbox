;(function () {
  'use strict'
  var outEl = document.getElementById('ci-out')
  var tbody = document.getElementById('ci-tbody')

  function money(n) { return Math.round(n).toLocaleString('zh-CN') }

  document.getElementById('ci-run').addEventListener('click', function () {
    var P = parseFloat(document.getElementById('ci-principal').value) || 0
    var r = (parseFloat(document.getElementById('ci-rate').value) || 0) / 100
    var n = parseInt(document.getElementById('ci-years').value, 10) || 10
    var A = parseFloat(document.getElementById('ci-annual').value) || 0
    if (n < 1 || n > 60) { outEl.textContent = '年数需在 1~60 之间'; return }

    var fv = P * Math.pow(1 + r, n) + (r > 0 ? A * (Math.pow(1 + r, n) - 1) / r : A * n)
    var totalIn = P + A * n
    var gain = fv - totalIn

    // 明细
    var rows = []
    var bal = P
    for (var i = 1; i <= Math.min(n, 15); i++) {
      bal = bal * (1 + r) + A
      rows.push({ y: i, bal: bal, in: P + A * i, gain: bal - (P + A * i) })
    }
    tbody.innerHTML = rows.map(function (row) {
      return '<tr><td style="padding:5px 8px">第 ' + row.y + ' 年</td>' +
        '<td style="padding:5px 8px;text-align:right">' + money(row.bal) + '</td>' +
        '<td style="padding:5px 8px;text-align:right">' + money(row.in) + '</td>' +
        '<td style="padding:5px 8px;text-align:right;color:var(--ok)">+' + money(row.gain) + '</td></tr>'
    }).join('')

    outEl.innerHTML =
      '第 ' + n + ' 年后终值:<b style="font-size:24px">' + money(fv) + '</b> 元<br>' +
      '累计投入:<b>' + money(totalIn) + '</b> 元<br>' +
      '收益:<b style="color:var(--ok)">+' + money(gain) + '</b> 元(是投入的 ' + (gain / Math.max(1, totalIn) * 100).toFixed(1) + '%)<br>' +
      '<span class="tip">' + (A > 0 ? '如果' + '不每年追加,只投本金,终值为 ' + money(P * Math.pow(1 + r, n)) + ' 元——这就是复利+定投的威力。' : '') + '</span>'
  })
})()
