;(function () {
  'use strict'
  var inEl = document.getElementById('mo-in')
  var outEl = document.getElementById('mo-out')

  var MAP = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
    I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
    Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.',
    '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
    '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.',
  }
  var REV = {}
  for (var k in MAP) REV[MAP[k]] = k

  // 渲染对照表(字母+数字)
  var tableEl = document.getElementById('mo-table')
  var rows = []
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  letters.forEach(function (ch, i) {
    rows.push('<b>' + ch + '</b> ' + MAP[ch] + '&nbsp;&nbsp;&nbsp;')
    if ((i + 1) % 6 === 0) rows.push('<br>')
  })
  rows.push('<br>')
  for (var d = 0; d <= 9; d++) rows.push('<b>' + d + '</b> ' + MAP[d] + '&nbsp;&nbsp;&nbsp;')
  tableEl.innerHTML = rows.join('')

  document.getElementById('mo-encode').addEventListener('click', function () {
    var text = inEl.value.trim().toUpperCase()
    if (!text) { window.bbToast('请输入文本'); return }
    var out = []
    text.split(/\s+/).forEach(function (word) {
      var codes = []
      for (var i = 0; i < word.length; i++) {
        if (MAP[word[i]]) codes.push(MAP[word[i]])
      }
      if (codes.length) out.push(codes.join(' '))
    })
    outEl.value = out.join(' / ')
    window.bbToast('转换完成')
  })

  document.getElementById('mo-decode').addEventListener('click', function () {
    var text = inEl.value.trim()
    if (!text) { window.bbToast('请输入摩斯电码'); return }
    var out = []
    text.split(/\s*\/\s*/).forEach(function (word) {
      var chars = []
      word.trim().split(/\s+/).forEach(function (code) {
        if (REV[code]) chars.push(REV[code])
      })
      out.push(chars.join(''))
    })
    outEl.value = out.join(' ')
    window.bbToast('转换完成')
  })

  document.getElementById('mo-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
