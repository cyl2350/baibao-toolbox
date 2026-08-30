;(function () {
  'use strict'
  var fileEl = document.getElementById('ng-file')
  var outEl = document.getElementById('ng-out')
  var img = null
  var pieces = []

  fileEl.addEventListener('change', function () {
    var f = fileEl.files[0]
    if (!f) return
    var url = URL.createObjectURL(f)
    var image = new Image()
    image.onload = function () {
      URL.revokeObjectURL(url)
      img = image
      outEl.textContent = '已加载图片 ' + image.width + '×' + image.height + ',点击「切成九宫格」'
    }
    image.src = url
  })

  document.getElementById('ng-split').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    var side = Math.min(img.width, img.height)
    var sx = (img.width - side) / 2
    var sy = (img.height - side) / 2
    pieces = []
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        var canvas = document.createElement('canvas')
        canvas.width = Math.round(side / 3)
        canvas.height = Math.round(side / 3)
        var ctx = canvas.getContext('2d')
        ctx.drawImage(img, sx + c * side / 3, sy + r * side / 3, side / 3, side / 3, 0, 0, canvas.width, canvas.height)
        pieces.push({ canvas: canvas, name: 'grid-' + (r * 3 + c + 1) + '.png' })
      }
    }
    var html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;max-width:360px;margin:0 auto">'
    pieces.forEach(function (p) {
      html += '<canvas data-i="' + pieces.indexOf(p) + '" style="width:100%;border-radius:4px;border:1px solid var(--border);cursor:pointer" width="' + p.canvas.width + '" height="' + p.canvas.height + '"></canvas>'
    })
    html += '</div>'
    outEl.innerHTML = html
    outEl.querySelectorAll('canvas[data-i]').forEach(function (el) {
      el.getContext('2d').drawImage(pieces[+el.getAttribute('data-i')].canvas, 0, 0)
      el.addEventListener('click', function () {
        var idx = +el.getAttribute('data-i')
        pieces[idx].canvas.toBlob(function (blob) {
          if (blob) window.bbDownload(pieces[idx].name, blob, 'image/png')
        }, 'image/png')
      })
    })
    window.bbToast('已切成 9 张,点击小图可单独下载')
  })

  document.getElementById('ng-grid').addEventListener('click', function () {
    if (!pieces.length) { window.bbToast('请先切图'); return }
    var canvas = document.createElement('canvas')
    canvas.width = pieces[0].canvas.width * 3
    canvas.height = pieces[0].canvas.height * 3
    var ctx = canvas.getContext('2d')
    pieces.forEach(function (p, i) {
      ctx.drawImage(p.canvas, (i % 3) * p.canvas.width, Math.floor(i / 3) * p.canvas.height)
    })
    var w = Math.min(1200, canvas.width)
    var h = Math.round(canvas.height * w / canvas.width)
    var thumb = document.createElement('canvas')
    thumb.width = w
    thumb.height = h
    thumb.getContext('2d').drawImage(canvas, 0, 0, w, h)
    var win = window.open('', '_blank')
    if (win) {
      win.document.write('<title>九宫格拼图预览</title><img src="' + thumb.toDataURL('image/png') + '" style="width:100%;max-width:600px">')
    } else {
      thumb.toBlob(function (blob) {
        if (blob) window.bbDownload('grid-preview.png', blob, 'image/png')
      }, 'image/png')
    }
  })

  document.getElementById('ng-download').addEventListener('click', function () {
    if (!pieces.length) { window.bbToast('请先切图'); return }
    // 依次下载 9 张(浏览器会逐个弹出保存)
    var i = 0
    function next() {
      if (i >= pieces.length) { window.bbToast('已开始下载 9 张,请逐个保存'); return }
      pieces[i].canvas.toBlob(function (blob) {
        if (blob) window.bbDownload(pieces[i].name, blob, 'image/png')
      }, 'image/png')
      i++
      setTimeout(next, 500)
    }
    next()
  })
})()
