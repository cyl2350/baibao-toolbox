;(function () {
  'use strict'
  var lenEl = document.getElementById('pw-len')
  var outEl = document.getElementById('pw-out')
  var strengthEl = document.getElementById('pw-strength')

  var UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  var LOWER = 'abcdefghijkmnpqrstuvwxyz'
  var DIGIT = '23456789'
  var SYMBOL = '!@#$%^&*()-_=+[]{};:,.<>?'
  var UPPER_ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var LOWER_ALL = 'abcdefghijklmnopqrstuvwxyz'
  var DIGIT_ALL = '0123456789'

  function randomInt(max) {
    // crypto.getRandomValues 无偏采样
    var buf = new Uint32Array(1)
    var limit = Math.floor(0x100000000 / max) * max
    var x
    do {
      crypto.getRandomValues(buf)
      x = buf[0]
    } while (x >= limit)
    return x % max
  }

  function generate() {
    var len = parseInt(lenEl.value, 10) || 16
    len = Math.max(4, Math.min(128, len))
    lenEl.value = len
    var ambig = document.getElementById('pw-ambig').checked
    var pool = ''
    var groups = []
    if (document.getElementById('pw-upper').checked) { groups.push(ambig ? UPPER : UPPER_ALL); pool += groups[groups.length - 1] }
    if (document.getElementById('pw-lower').checked) { groups.push(ambig ? LOWER : LOWER_ALL); pool += groups[groups.length - 1] }
    if (document.getElementById('pw-digit').checked) { groups.push(ambig ? DIGIT : DIGIT_ALL); pool += groups[groups.length - 1] }
    if (document.getElementById('pw-symbol').checked) { groups.push(SYMBOL); pool += SYMBOL }
    if (!pool) { window.bbToast('请至少选择一种字符'); return '' }

    var chars = []
    // 保证每组至少出现一次
    groups.forEach(function (g) { chars.push(g[randomInt(g.length)]) })
    for (var i = chars.length; i < len; i++) chars.push(pool[randomInt(pool.length)])
    // Fisher-Yates 洗牌
    for (var j = chars.length - 1; j > 0; j--) {
      var k = randomInt(j + 1)
      var t = chars[j]; chars[j] = chars[k]; chars[k] = t
    }
    return chars.join('')
  }

  function strength(pw) {
    var entropy = pw.length * Math.log2(pw.length > 0 ? new Set(pw).size : 1)
    if (entropy >= 100) return { label: '非常强', color: 'var(--ok)' }
    if (entropy >= 70) return { label: '很强', color: 'var(--ok)' }
    if (entropy >= 45) return { label: '中等', color: '#d97706' }
    return { label: '较弱', color: 'var(--err)' }
  }

  document.getElementById('pw-gen').addEventListener('click', function () {
    var pw = generate()
    if (!pw) return
    outEl.textContent = pw
    var s = strength(pw)
    strengthEl.innerHTML = '强度评估:<b style="color:' + s.color + '">' + s.label + '</b> (估算熵约 ' + (pw.length * Math.log2(new Set(pw).size)).toFixed(0) + ' bit)'
  })

  document.getElementById('pw-copy').addEventListener('click', function () {
    if (outEl.textContent && outEl.textContent !== '密码将显示在这里') window.bbCopy(outEl.textContent)
  })
})()
