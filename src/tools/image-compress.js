;(function () {
  'use strict'
  var fileEl = document.getElementById('img-file')
  var qualityEl = document.getElementById('img-quality')
  var qualityLabel = document.getElementById('img-quality-label')
  var maxwEl = document.getElementById('img-maxw')
  var formatEl = document.getElementById('img-format')
  var infoEl = document.getElementById('img-info')
  var previewEl = document.getElementById('img-preview')
  var downloadBtn = document.getElementById('img-download')
  var outBlob = null

  qualityEl.addEventListener('input', function () { qualityLabel.textContent = qualityEl.value })

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  fileEl.addEventListener('change', function () {
    var f = fileEl.files[0]
    if (!f) return
    infoEl.textContent = '已选择:' + f.name + ' (' + fmtSize(f.size) + ')'
    var url = URL.createObjectURL(f)
    previewEl.onload = function () { URL.revokeObjectURL(url) }
    previewEl.src = url
    previewEl.style.display = 'block'
  })

  document.getElementById('img-compress').addEventListener('click', function () {
    var f = fileEl.files[0]
    if (!f) { window.bbToast('请先选择图片'); return }
    var img = new Image()
    var url = URL.createObjectURL(f)
    img.onload = function () {
      var scale = 1
      var maxw = parseInt(maxwEl.value, 10) || 0
      if (maxw > 0 && img.width > maxw) scale = maxw / img.width
      var w = Math.max(1, Math.round(img.width * scale))
      var h = Math.max(1, Math.round(img.height * scale))
      var canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        function (blob) {
          URL.revokeObjectURL(url)
          if (!blob) { infoEl.textContent = '压缩失败,请重试'; return }
          outBlob = blob
          var ratio = (blob.size / f.size * 100).toFixed(1)
          infoEl.textContent =
            '原图:' + fmtSize(f.size) + ' → 压缩后:' + fmtSize(blob.size) +
            ' (节省 ' + (100 - parseFloat(ratio)).toFixed(1) + '%) | 尺寸 ' + w + '×' + h
          downloadBtn.disabled = false
          var purl = URL.createObjectURL(blob)
          previewEl.onload = function () { URL.revokeObjectURL(purl) }
          previewEl.src = purl
          window.bbToast('压缩完成')
        },
        formatEl.value,
        parseFloat(qualityEl.value)
      )
    }
    img.onerror = function () { URL.revokeObjectURL(url); infoEl.textContent = '图片加载失败' }
    img.src = url
  })

  downloadBtn.addEventListener('click', function () {
    if (!outBlob) return
    var ext = formatEl.value === 'image/png' ? 'png' : formatEl.value === 'image/webp' ? 'webp' : 'jpg'
    window.bbDownload('compressed.' + ext, outBlob, formatEl.value)
  })
})()
