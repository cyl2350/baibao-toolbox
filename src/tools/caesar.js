;(function () {
  'use strict'
  var inEl = document.getElementById('cs-in')
  var shiftEl = document.getElementById('cs-shift')
  var modeEl = document.getElementById('cs-mode')
  var outEl = document.getElementById('cs-out')

  function shiftChar(ch, n, direction) {
    var code = ch.charCodeAt(0)
    var base
    if (code >= 65 && code <= 90) base = 65
    else if (code >= 97 && code <= 122) base = 97
    else return ch
    var k = direction === 'enc' ? n : (26 - n) % 26
    return String.fromCharCode(base + ((code - base + k) % 26))
  }

  document.getElementById('cs-run').addEventListener('click', function () {
    var text = inEl.value
    if (!text) { window.bbToast('请输入文本'); return }
    var n = parseInt(shiftEl.value, 10) || 3
    var dir = modeEl.value
    var out = ''
    for (var i = 0; i < text.length; i++) out += shiftChar(text[i], n, dir)
    outEl.value = out
    window.bbToast('完成')
  })

  document.getElementById('cs-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
