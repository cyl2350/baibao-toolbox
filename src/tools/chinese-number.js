;(function () {
  'use strict'
  var inEl = document.getElementById('cn-in')
  var outEl = document.getElementById('cn-out')

  var CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  var UNITS = ['', '十', '百', '千']
  var SECTIONS = ['', '万', '亿', '万亿']

  function sectionNonZero(s, n, secIdx) {
    for (var p = secIdx * 4; p < Math.min((secIdx + 1) * 4, n); p++) {
      if (+s[n - 1 - p] !== 0) return true
    }
    return false
  }

  function integerToChinese(num) {
    if (num === 0) return '零'
    var s = String(num)
    var n = s.length
    var out = ''
    var zeroPending = false
    for (var i = 0; i < n; i++) {
      var d = +s[i]
      var pos = n - 1 - i
      var posInSec = pos % 4
      var secIdx = Math.floor(pos / 4)
      if (d === 0) {
        zeroPending = true
      } else {
        if (zeroPending) out += '零'
        zeroPending = false
        out += CN[d] + UNITS[posInSec]
      }
      if (posInSec === 0 && secIdx > 0 && sectionNonZero(s, n, secIdx)) {
        out += SECTIONS[secIdx]
      }
    }
    return out
  }

  function convert(value) {
    var num = Number(value)
    if (value.trim() === '' || isNaN(num)) return '无效数字'
    if (num >= 1e16) return '数字过大,最大支持 9999 万亿'

    var neg = num < 0
    var abs = Math.abs(num)
    var integer = Math.floor(abs)
    // 处理小数(最多 6 位,避免浮点误差)
    var fracStr = (abs - integer).toFixed(6).replace(/0+$/, '').replace(/^0\./, '')
    if (fracStr === '' || fracStr === '.') fracStr = ''

    var result = neg ? '负' : ''
    result += integerToChinese(integer)
    if (fracStr) {
      result += '点'
      for (var i = 0; i < fracStr.length; i++) {
        result += CN[+fracStr[i]]
      }
    }
    return result
  }

  document.getElementById('cn-run').addEventListener('click', function () {
    outEl.textContent = convert(inEl.value.trim())
  })

  document.getElementById('cn-copy').addEventListener('click', function () {
    if (outEl.textContent && outEl.textContent !== '输入数字后点击转换') window.bbCopy(outEl.textContent)
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('cn-run').click() })
})()
