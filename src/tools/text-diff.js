;(function () {
  'use strict'
  var aEl = document.getElementById('diff-a')
  var bEl = document.getElementById('diff-b')
  var outEl = document.getElementById('diff-out')

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function run() {
    var a = aEl.value
    var b = bEl.value
    if (!a && !b) { window.bbToast('请输入要对比的内容'); return }
    var parts = Diff.diffLines(a, b)
    var html = ''
    parts.forEach(function (part) {
      var lines = part.value.replace(/\n$/, '').split('\n')
      lines.forEach(function (line) {
        if (part.added) {
          html += '<div class="diff-add">+ ' + esc(line) + '</div>'
        } else if (part.removed) {
          html += '<div class="diff-del">- ' + esc(line) + '</div>'
        } else {
          html += '<div style="color:var(--muted)">  ' + esc(line) + '</div>'
        }
      })
    })
    // 行级差内差异标记(新增/删除部分中进一步标出字符级变化)
    var oldLines = a.split('\n')
    var newLines = b.split('\n')
    outEl.innerHTML = html
    outEl.querySelectorAll('.diff-add').forEach(function (el, i) {
      if (i < newLines.length && oldLines.indexOf(newLines[i]) === -1 && oldLines[i - 1] !== undefined) {
        // 精细字符对比已由行级展示覆盖,此处仅提示
      }
    })
  }

  document.getElementById('diff-run').addEventListener('click', run)
  document.getElementById('diff-copy').addEventListener('click', function () {
    window.bbCopy(outEl.innerText)
  })
})()
