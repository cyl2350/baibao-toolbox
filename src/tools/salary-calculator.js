;(function () {
  'use strict'
  var outEl = document.getElementById('sc-out')

  // 7 级累进税率(应纳税所得额/月)
  var BRACKETS = [
    { up: 3000, rate: 0.03, quick: 0 },
    { up: 12000, rate: 0.10, quick: 210 },
    { up: 25000, rate: 0.20, quick: 1410 },
    { up: 35000, rate: 0.25, quick: 2660 },
    { up: 55000, rate: 0.30, quick: 4410 },
    { up: 80000, rate: 0.35, quick: 7160 },
    { up: Infinity, rate: 0.45, quick: 15160 },
  ]

  function tax(taxable) {
    if (taxable <= 0) return 0
    for (var i = 0; i < BRACKETS.length; i++) {
      if (taxable <= BRACKETS[i].up) {
        return taxable * BRACKETS[i].rate - BRACKETS[i].quick
      }
    }
  }

  function money(n) { return Math.round(n).toLocaleString('zh-CN') }

  document.getElementById('sc-run').addEventListener('click', function () {
    var salary = parseFloat(document.getElementById('sc-salary').value)
    var fundRate = parseFloat(document.getElementById('sc-fund').value)
    var deduct = parseFloat(document.getElementById('sc-deduct').value) || 0
    if (isNaN(salary) || salary < 0) { outEl.textContent = '请输入有效税前工资'; return }
    if (isNaN(deduct) || deduct < 0) deduct = 0

    var pension = salary * 0.08       // 养老 8%
    var medical = salary * 0.02 + 3   // 医疗 2% + 3 元大病
    var unemployment = salary * 0.005 // 失业 0.5%
    var fund = salary * fundRate      // 公积金
    var social = pension + medical + unemployment + fund

    var taxable = salary - social - 5000 - deduct // 应纳税所得额
    var t = tax(Math.max(0, taxable))
    var afterTax = salary - social - t

    outEl.innerHTML =
      '税后实发:<b style="font-size:24px">' + money(afterTax) + '</b> 元<br>' +
      '—— 扣款明细 ——<br>' +
      '养老保险(8%):<b>' + money(pension) + '</b> 元<br>' +
      '医疗保险(2%+3):<b>' + money(medical) + '</b> 元<br>' +
      '失业保险(0.5%):<b>' + money(unemployment) + '</b> 元<br>' +
      '住房公积金(' + Math.round(fundRate * 100) + '%):<b>' + money(fund) + '</b> 元<br>' +
      '五险一金合计:<b>' + money(social) + '</b> 元<br>' +
      '应纳税所得额:' + money(Math.max(0, taxable)) + ' 元(税前 − 五险一金 − 5000 − 专项扣除 ' + money(deduct) + ')<br>' +
      '个人所得税:<b>' + money(t) + '</b> 元<br>' +
      '<span class="tip">提示:实际以当地社保缴费基数上下限与公积金政策为准,本结果供参考。</span>'
  })

  document.getElementById('sc-demo').addEventListener('click', function () {
    document.getElementById('sc-salary').value = '15000'
    document.getElementById('sc-fund').value = '0.12'
    document.getElementById('sc-deduct').value = '1000'
    document.getElementById('sc-run').click()
  })
})()
