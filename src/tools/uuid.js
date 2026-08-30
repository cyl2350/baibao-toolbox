;(function () {
  'use strict'
  var countEl = document.getElementById('uuid-count')
  var formatEl = document.getElementById('uuid-format')
  var outEl = document.getElementById('uuid-out')

  document.getElementById('uuid-gen').addEventListener('click', function () {
    var n = parseInt(countEl.value, 10) || 5
    n = Math.max(1, Math.min(100, n))
    countEl.value = n
    var fmt = formatEl.value
    var lines = []
    for (var i = 0; i < n; i++) {
      var id = crypto.randomUUID()
      if (fmt === 'upper') id = id.toUpperCase()
      if (fmt === 'nodash') id = id.replace(/-/g, '')
      lines.push(id)
    }
    outEl.value = lines.join('\n')
    window.bbToast('已生成 ' + n + ' 个 UUID')
  })

  document.getElementById('uuid-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
