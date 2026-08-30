;(function () {
  'use strict'
  var inEl = document.getElementById('rmb-in')
  var outEl = document.getElementById('rmb-out')

  var CN_NUM = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  var CN_UNIT_INT = ['', '拾', '佰', '仟']
  var CN_UNIT_SECTION = ['', '万', '亿', '万亿']

  // 从右数第 secIdx 个四位段(0=个段)内是否有非零数字
  function sectionNonZero(s, n, secIdx) {
    for (var p = secIdx * 4; p < Math.min((secIdx + 1) * 4, n); p++) {
      if (+s[n - 1 - p] !== 0) return true
    }
    return false
  }

  // 整数部分转中文(逐位处理,正确处理段间零与段单位)
  function integerToChinese(num) {
    if (num === 0) return '零'
    var s = String(num)
    var n = s.length
    var out = ''
    var zeroPending = false
    for (var i = 0; i < n; i++) {
      var d = +s[i]
      var pos = n - 1 - i // 0 = 个位
      var posInSec = pos % 4
      var secIdx = Math.floor(pos / 4)
      if (d === 0) {
        zeroPending = true
      } else {
        if (zeroPending) out += '零'
        zeroPending = false
        out += CN_NUM[d] + CN_UNIT_INT[posInSec]
      }
      // 段单位:段内个位处理完后,若该段(万/亿…)有非零数字,输出段单位
      if (posInSec === 0 && secIdx > 0 && sectionNonZero(s, n, secIdx)) {
        out += CN_UNIT_SECTION[secIdx]
      }
    }
    return out
  }

  function convert(value) {
    if (value === '' || value === null) return ''
    var num = Number(value)
    if (!isFinite(num)) return '无效金额'
    if (num < 0) return '不支持负数'
    if (num >= 100000000000000) return '金额过大,最大支持 9999 亿'

    var integer = Math.floor(num)
    var decimals = Math.round((num - integer) * 100)
    var jiao = Math.floor(decimals / 10)
    var fen = decimals % 10

    var result = ''
    if (integer > 0) {
      result += integerToChinese(integer) + '圆'
    } else {
      if (jiao === 0 && fen === 0) return '零圆整'
      result += '零圆'
    }
    if (jiao > 0) {
      result += CN_NUM[jiao] + '角'
    } else if (fen > 0) {
      // 角位为 0、分位不为 0 时,「圆」后必须写「零」
      result += '零'
    }
    if (fen > 0) result += CN_NUM[fen] + '分'
    if (jiao === 0 && fen === 0) result += '整'
    return result
  }

  document.getElementById('rmb-run').addEventListener('click', function () {
    var result = convert(inEl.value.trim())
    outEl.textContent = result
  })

  document.getElementById('rmb-copy').addEventListener('click', function () {
    if (outEl.textContent && outEl.textContent !== '输入金额后点击转换') window.bbCopy(outEl.textContent)
  })

  document.querySelectorAll('[data-v]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      inEl.value = btn.getAttribute('data-v')
      outEl.textContent = convert(inEl.value)
    })
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('rmb-run').click() })
})()
