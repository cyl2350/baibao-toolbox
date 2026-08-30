;(function () {
  'use strict'
  var fileEl = document.getElementById('ie-file')
  var cropEl = document.getElementById('ie-crop')
  var formatEl = document.getElementById('ie-format')
  var canvas = document.getElementById('ie-canvas')
  var img = null

  function draw() {
    if (!img) return
    var ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
  }

  function replaceWithCanvas() {
    // 把当前 canvas 内容作为新"原图"
    var tmp = document.createElement('canvas')
    tmp.width = canvas.width
    tmp.height = canvas.height
    tmp.getContext('2d').drawImage(canvas, 0, 0)
    img = tmp
  }

  fileEl.addEventListener('change', function () {
    var f = fileEl.files[0]
    if (!f) return
    var url = URL.createObjectURL(f)
    var image = new Image()
    image.onload = function () {
      URL.revokeObjectURL(url)
      img = image
      draw()
      window.bbToast('已加载图片')
    }
    image.src = url
  })

  document.getElementById('ie-rotl').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    replaceWithCanvas()
    var ctx = canvas.getContext('2d')
    var w = img.width, h = img.height
    canvas.width = h
    canvas.height = w
    ctx.translate(h / 2, w / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.drawImage(img, -w / 2, -h / 2)
    replaceWithCanvas()
    draw()
  })

  document.getElementById('ie-rotr').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    replaceWithCanvas()
    var ctx = canvas.getContext('2d')
    var w = img.width, h = img.height
    canvas.width = h
    canvas.height = w
    ctx.translate(h / 2, w / 2)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(img, -w / 2, -h / 2)
    replaceWithCanvas()
    draw()
  })

  document.getElementById('ie-fliph').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    replaceWithCanvas()
    var ctx = canvas.getContext('2d')
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(img, 0, 0)
    replaceWithCanvas()
    draw()
  })

  document.getElementById('ie-flipv').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    replaceWithCanvas()
    var ctx = canvas.getContext('2d')
    ctx.translate(0, canvas.height)
    ctx.scale(1, -1)
    ctx.drawImage(img, 0, 0)
    replaceWithCanvas()
    draw()
  })

  document.getElementById('ie-crop-btn').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    var ratio = cropEl.value
    if (ratio === 'free') { window.bbToast('当前为原比例,无需裁剪'); return }
    var parts = ratio.split(':').map(Number)
    var w = img.width, h = img.height
    var targetRatio = parts[0] / parts[1]
    var cw, ch
    if (w / h > targetRatio) { cw = h * targetRatio; ch = h }
    else { cw = w; ch = w / targetRatio }
    var sx = (w - cw) / 2, sy = (h - ch) / 2
    var ctx = canvas.getContext('2d')
    canvas.width = Math.round(cw)
    canvas.height = Math.round(ch)
    ctx.drawImage(img, sx, sy, cw, ch, 0, 0, cw, ch)
    replaceWithCanvas()
    draw()
    window.bbToast('已裁剪')
  })

  document.getElementById('ie-download').addEventListener('click', function () {
    if (!img) { window.bbToast('请先选择图片'); return }
    canvas.toBlob(function (blob) {
      if (blob) {
        var ext = formatEl.value === 'image/jpeg' ? 'jpg' : 'png'
        window.bbDownload('edited.' + ext, blob, formatEl.value)
      }
    }, formatEl.value, 0.92)
  })
})()
