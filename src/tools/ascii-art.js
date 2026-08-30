;(function () {
  'use strict'
  var fileEl = document.getElementById('aa-file')
  var widthEl = document.getElementById('aa-width')
  var charsEl = document.getElementById('aa-chars')
  var outEl = document.getElementById('aa-out')
  var img = null

  var SETS = {
    dense: '@%#*+=-:. ',
    simple: '#*+.: ',
    block: '█▓▒░ ',
  }

  fileEl.addEventListener('change', function () {
    var f = fileEl.files[0]
    if (!f) return
    var url = URL.createObjectURL(f)
    var image = new Image()
    image.onload = function () {
      URL.revokeObjectURL(url)
      img = image
      window.bbToast('已加载图片,点击生成')
    }
    image.src = url
  })

  document.getElementById('aa-run').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    var cols = parseInt(widthEl.value, 10) || 100
    cols = Math.max(20, Math.min(300, cols))
    widthEl.value = cols
    var ratio = img.height / img.width
    // 字符高度约为宽度 2 倍,故行数 = cols * ratio / 2
    var rows = Math.max(10, Math.round(cols * ratio * 0.5))

    var canvas = document.createElement('canvas')
    canvas.width = cols
    canvas.height = rows
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, cols, rows)
    var data = ctx.getImageData(0, 0, cols, rows).data

    var set = SETS[charsEl.value]
    var out = ''
    for (var r = 0; r < rows; r++) {
      var line = ''
      for (var c = 0; c < cols; c++) {
        var i = (r * cols + c) * 4
        var lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
        var idx = Math.floor(lum * set.length)
        idx = Math.max(0, Math.min(set.length - 1, idx))
        line += set[idx]
      }
      out += line + '\n'
    }
    outEl.textContent = out
    window.bbToast('字符画已生成(' + cols + '×' + rows + ')')
  })

  document.getElementById('aa-copy').addEventListener('click', function () {
    if (outEl.textContent) window.bbCopy(outEl.textContent)
  })
})()
