;(function () {
  'use strict'
  var inEl = document.getElementById('isbn-in')
  var outEl = document.getElementById('isbn-out')

  function check13(digits) {
    var sum = 0
    for (var i = 0; i < 12; i++) sum += digits[i] * (i % 2 === 0 ? 1 : 3)
    return (10 - (sum % 10)) % 10
  }

  function check10(digits) {
    var sum = 0
    for (var i = 0; i < 9; i++) sum += digits[i] * (10 - i)
    var check = (11 - (sum % 11)) % 11
    return check === 10 ? 'X' : String(check)
  }

  document.getElementById('isbn-run').addEventListener('click', function () {
    var raw = inEl.value.trim().replace(/-/g, '')
    var html = ''
    if (/^\d{13}$/.test(raw)) {
      var d13 = raw.split('').map(Number)
      var expect13 = check13(d13)
      var ok13 = expect13 === d13[12]
      html = '<b style="color:' + (ok13 ? 'var(--ok)' : 'var(--err)') + '">' + (ok13 ? '✓' : '✗') + ' ISBN-13 校验' + (ok13 ? '通过' : '失败') + '</b><br>' +
        '校验位:应为 <b>' + expect13 + '</b>,实际 <b>' + d13[12] + '</b><br>'
      if (/^978|^979/.test(raw)) html += '前缀:<b>978/979</b>(图书产品代码)'
    } else if (/^\d{9}[\dX]$/i.test(raw)) {
      var d10 = raw.slice(0, 9).split('').map(Number)
      var expect10 = check10(d10)
      var last = raw[9].toUpperCase()
      var ok10 = expect10 === last
      html = '<b style="color:' + (ok10 ? 'var(--ok)' : 'var(--err)') + '">' + (ok10 ? '✓' : '✗') + ' ISBN-10 校验' + (ok10 ? '通过' : '失败') + '</b><br>' +
        '校验位:应为 <b>' + expect10 + '</b>,实际 <b>' + last + '</b>'
    } else {
      html = '格式无法识别:请输入 10 位(9 位数字 + 校验位)或 13 位数字的 ISBN'
    }
    outEl.innerHTML = html
  })

  document.getElementById('isbn-demo').addEventListener('click', function () {
    inEl.value = '9787111213826'
    document.getElementById('isbn-run').click()
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('isbn-run').click() })
})()
