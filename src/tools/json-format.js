;(function () {
  'use strict'
  var inEl = document.getElementById('json-in')
  var outEl = document.getElementById('json-out')
  var msgEl = document.getElementById('json-msg')

  function parse() {
    var raw = inEl.value.trim()
    if (!raw) { window.bbToast('请输入 JSON'); return null }
    try {
      return { ok: true, value: JSON.parse(raw) }
    } catch (e) {
      msgEl.className = 'error-text'
      msgEl.textContent = 'JSON 解析失败:' + e.message
      outEl.value = ''
      return null
    }
  }

  function run(mode) {
    var r = parse()
    if (!r) return
    msgEl.className = 'ok-text'
    if (mode === 'validate') {
      msgEl.textContent = '✓ 合法 JSON'
      return
    }
    outEl.value = JSON.stringify(r.value, null, mode === 'format' ? 2 : 0)
    msgEl.textContent = '✓ 处理成功,共 ' + outEl.value.length + ' 字符'
  }

  document.getElementById('json-format').addEventListener('click', function () { run('format') })
  document.getElementById('json-compress').addEventListener('click', function () { run('compress') })
  document.getElementById('json-validate').addEventListener('click', function () { run('validate') })
  document.getElementById('json-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
