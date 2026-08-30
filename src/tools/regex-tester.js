;(function () {
  'use strict'
  var patternEl = document.getElementById('rx-pattern')
  var flagsEl = document.getElementById('rx-flags')
  var textEl = document.getElementById('rx-text')
  var hlEl = document.getElementById('rx-highlight')
  var msgEl = document.getElementById('rx-msg')

  document.getElementById('rx-preset').addEventListener('change', function () {
    if (this.value) patternEl.value = this.value
  })

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  document.getElementById('rx-run').addEventListener('click', function () {
    var pattern = patternEl.value
    var flags = flagsEl.value || ''
    var text = textEl.value
    if (!pattern) { window.bbToast('请输入正则表达式'); return }
    var re
    try {
      re = new RegExp(pattern, flags)
    } catch (e) {
      msgEl.className = 'error-text'
      msgEl.textContent = '正则表达式错误:' + e.message
      return
    }
    if (text === '') { msgEl.className = 'tip'; msgEl.textContent = '请粘贴测试文本'; return }

    var matches = []
    var highlighted = ''
    var last = 0
    var count = 0
    // 重建带高亮的文本
    var re2 = new RegExp(pattern, flags.indexOf('g') > -1 ? flags : flags + 'g')
    var m
    while ((m = re2.exec(text)) !== null) {
      count++
      matches.push({ value: m[0], index: m.index })
      highlighted += esc(text.slice(last, m.index)) + '<span class="hl-match">' + esc(m[0]) + '</span>'
      last = m.index + m[0].length
      if (m[0].length === 0) re2.lastIndex++
      if (count > 5000) break
    }
    highlighted += esc(text.slice(last))

    if (count === 0) {
      hlEl.innerHTML = esc(text)
      msgEl.className = 'tip'
      msgEl.textContent = '未找到匹配项'
      return
    }
    hlEl.innerHTML = highlighted
    var detail = matches.slice(0, 50).map(function (x) { return '[' + x.index + '] ' + x.value }).join('\n')
    msgEl.className = 'ok-text'
    msgEl.textContent = '共匹配 ' + count + ' 处' + (count > 50 ? '(仅显示前 50 处)' : '') + '\n' + detail
  })

  document.getElementById('rx-clear').addEventListener('click', function () {
    patternEl.value = ''
    flagsEl.value = 'g'
    textEl.value = ''
    hlEl.textContent = ''
    msgEl.textContent = ''
  })
})()
