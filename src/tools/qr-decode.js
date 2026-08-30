;(function () {
  'use strict'
  var fileEl = document.getElementById('qd-file')
  var outEl = document.getElementById('qd-out')
  var previewEl = document.getElementById('qd-preview')
  var lastResult = ''

  fileEl.addEventListener('change', function () {
    var f = fileEl.files[0]
    if (!f) return
    var url = URL.createObjectURL(f)
    previewEl.onload = function () { URL.revokeObjectURL(url) }
    previewEl.src = url
    previewEl.style.display = 'block'
  })

  document.getElementById('qd-run').addEventListener('click', function () {
    var f = fileEl.files[0]
    if (!f) { window.bbToast('请先选择图片'); return }
    var img = new Image()
    var url = URL.createObjectURL(f)
    img.onload = function () {
      URL.revokeObjectURL(url)
      var canvas = document.createElement('canvas')
      var maxW = 800
      var scale = img.width > maxW ? maxW / img.width : 1
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      var code
      try {
        code = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: 'dontInvert' })
        if (!code) code = jsQR(imageData.data, canvas.width, canvas.height)
      } catch (e) {
        outEl.textContent = '解码出错:' + e.message
        return
      }
      if (code && code.data) {
        lastResult = code.data
        var isUrl = /^https?:\/\//i.test(code.data)
        outEl.innerHTML = '<b style="color:var(--ok)">✓ 识别成功</b><br>内容:<b>' + code.data + '</b><br>' +
          (isUrl ? '<a href="' + code.data + '" target="_blank" rel="noopener nofollow">打开链接(谨慎,确认来源可信)</a>' : '')
      } else {
        lastResult = ''
        outEl.textContent = '未识别到二维码:请换更清晰、无遮挡的图片重试'
      }
    }
    img.onerror = function () { URL.revokeObjectURL(url); outEl.textContent = '图片加载失败' }
    img.src = url
  })

  document.getElementById('qd-copy').addEventListener('click', function () {
    if (lastResult) window.bbCopy(lastResult)
  })
})()
