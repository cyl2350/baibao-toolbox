;(function () {
  'use strict'
  var textEl = document.getElementById('qr-text')
  var sizeEl = document.getElementById('qr-size')
  var ecEl = document.getElementById('qr-ec')
  var canvas = document.getElementById('qr-canvas')
  var lastSvg = null

  function generate() {
    var value = textEl.value.trim()
    if (!value) { window.bbToast('请先输入内容'); return }
    try {
      var qr = qrcode(0, ecEl.value)
      qr.addData(value)
      qr.make()
      var size = parseInt(sizeEl.value, 10)
      var modCount = qr.getModuleCount()
      var px = Math.floor(size / modCount)
      if (px < 1) px = 1
      var total = modCount * px
      canvas.width = total
      canvas.height = total
      var ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, total, total)
      ctx.fillStyle = '#000000'
      for (var r = 0; r < modCount; r++) {
        for (var c = 0; c < modCount; c++) {
          if (qr.isDark(r, c)) ctx.fillRect(c * px, r * px, px, px)
        }
      }
      lastSvg = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true })
      window.bbToast('二维码已生成')
    } catch (e) {
      window.bbToast('生成失败:' + e.message)
    }
  }

  document.getElementById('qr-generate').addEventListener('click', generate)
  textEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') generate() })
  document.getElementById('qr-download').addEventListener('click', function () {
    if (!canvas.width) { window.bbToast('请先生成二维码'); return }
    canvas.toBlob(function (blob) {
      if (blob) window.bbDownload('qrcode.png', blob, 'image/png')
    }, 'image/png')
  })
})()
