;(function () {
  'use strict'
  var inEl = document.getElementById('bc-in')
  var fromEl = document.getElementById('bc-from')
  var outEl = document.getElementById('bc-out')

  var DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

  function parseBigInt(str, radix) {
    var s = str.trim().toLowerCase()
    if (!s) return null
    var neg = false
    if (s[0] === '-') { neg = true; s = s.slice(1) }
    if (!s) return null
    var zero = 0n
    for (var i = 0; i < s.length; i++) {
      var d = DIGITS.indexOf(s[i])
      if (d < 0 || d >= radix) return null
      zero = zero * BigInt(radix) + BigInt(d)
    }
    return neg ? -zero : zero
  }

  function toBase(n, radix) {
    if (n === 0n) return '0'
    var neg = n < 0n
    var x = neg ? -n : n
    var out = ''
    var base = BigInt(radix)
    while (x > 0n) {
      var rem = Number(x % base)
      out = DIGITS[rem] + out
      x = x / base
    }
    return (neg ? '-' : '') + out
  }

  document.getElementById('bc-run').addEventListener('click', function () {
    var radix = parseInt(fromEl.value, 10)
    var n = parseBigInt(inEl.value, radix)
    if (n === null) {
      outEl.textContent = '输入无效:请确认数值与所选进制匹配'
      return
    }
    outEl.innerHTML =
      '十进制:<b>' + toBase(n, 10) + '</b><br>' +
      '二进制:<b>' + toBase(n, 2) + '</b><br>' +
      '八进制:<b>' + toBase(n, 8) + '</b><br>' +
      '十六进制:<b>' + toBase(n, 16).toUpperCase() + '</b>'
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('bc-run').click() })
})()
