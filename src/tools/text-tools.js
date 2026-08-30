;(function () {
  'use strict'
  var inEl = document.getElementById('tt-in')
  var outEl = document.getElementById('tt-out')

  document.getElementById('tt-run').addEventListener('click', function () {
    var text = inEl.value
    if (!text) { window.bbToast('请输入文本'); return }
    var lines = text.split(/\r\n|\r|\n/)

    if (document.getElementById('tt-trim').checked) {
      lines = lines.map(function (l) { return l.replace(/^\s+|\s+$/g, '') })
    }
    if (document.getElementById('tt-empty').checked) {
      lines = lines.filter(function (l) { return l !== '' })
    }
    if (document.getElementById('tt-dedup').checked) {
      lines = Array.from(new Set(lines))
    }
    if (document.getElementById('tt-sort').checked) {
      lines.sort(function (a, b) { return a.localeCompare(b, 'zh-CN') })
    }
    if (document.getElementById('tt-sort-desc').checked) {
      lines.reverse()
    }
    if (document.getElementById('tt-upper').checked) {
      lines = lines.map(function (l) { return l.toUpperCase() })
    }
    if (document.getElementById('tt-lower').checked) {
      lines = lines.map(function (l) { return l.toLowerCase() })
    }
    outEl.value = lines.join('\n')
    window.bbToast('处理完成,共 ' + lines.length + ' 行')
  })

  document.getElementById('tt-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
