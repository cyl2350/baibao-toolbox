;(function () {
  'use strict'
  var inEl = document.getElementById('luhn-in')
  var outEl = document.getElementById('luhn-out')

  // Luhn 校验
  function luhnCheck(num) {
    var sum = 0
    var double = false
    for (var i = num.length - 1; i >= 0; i--) {
      var d = +num[i]
      if (double) {
        d *= 2
        if (d > 9) d -= 9
      }
      sum += d
      double = !double
    }
    return sum % 10 === 0
  }

  // BIN 识别
  function detectBrand(num) {
    if (/^4/.test(num)) return { brand: 'Visa 维萨', len: [13, 16, 19] }
    if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(num)) return { brand: 'Mastercard 万事达', len: [16] }
    if (/^62/.test(num)) return { brand: '银联 UnionPay', len: [16, 17, 18, 19] }
    if (/^34|^37/.test(num)) return { brand: 'American Express 美国运通', len: [15] }
    if (/^35/.test(num)) return { brand: 'JCB', len: [16, 17, 18, 19] }
    if (/^60/.test(num)) return { brand: 'Discover', len: [16, 19] }
    if (/^(65|64[4-9])/.test(num)) return { brand: 'Discover', len: [16, 19] }
    return { brand: '未知/其他卡组织', len: [13, 14, 15, 16, 17, 18, 19] }
  }

  function luhnChecksum(base) {
    // 给定前 n 位,计算最后一位校验位(用于演示)
    var sum = 0
    var double = true
    for (var i = base.length - 1; i >= 0; i--) {
      var d = +base[i]
      if (double) {
        d *= 2
        if (d > 9) d -= 9
      }
      sum += d
      double = !double
    }
    return (10 - (sum % 10)) % 10
  }

  document.getElementById('luhn-run').addEventListener('click', function () {
    var num = inEl.value.trim().replace(/\s/g, '')
    if (!/^\d{13,19}$/.test(num)) { outEl.textContent = '卡号应为 13~19 位数字(可含空格)'; return }
    var ok = luhnCheck(num)
    var brand = detectBrand(num)
    var lenOk = brand.len.includes(num.length)
    var html = ok
      ? '<b style="color:var(--ok)">✓ Luhn 校验通过</b>(卡号格式合法,未发现抄写错误)'
      : '<b style="color:var(--err)">✗ Luhn 校验失败</b>(卡号很可能输错了,请逐位核对)'
    html += '<br>识别卡组织:<b>' + brand.brand + '</b>(规则判断,仅供参考)<br>'
    html += '卡号长度:<b>' + num.length + '</b> 位' + (lenOk ? '(符合该卡组织常见长度)' : '(与该卡组织常见长度不符)')
    outEl.innerHTML = html
  })

  document.getElementById('luhn-demo').addEventListener('click', function () {
    var base = '622202123456789'
    inEl.value = base + luhnChecksum(base)
    document.getElementById('luhn-run').click()
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('luhn-run').click() })
})()
