;(function () {
  'use strict'
  var styleEl = document.getElementById('av-style')
  var sizeEl = document.getElementById('av-size')
  var letterEl = document.getElementById('av-letter')
  var canvas = document.getElementById('av-canvas')

  function rand(min, max) { return min + Math.random() * (max - min) }

  function hsl(h, s, l, a) { return 'hsla(' + h + ',' + s + '%,' + l + '%,' + (a === undefined ? 1 : a) + ')' }

  function generate() {
    var size = parseInt(sizeEl.value, 10) || 512
    canvas.width = size
    canvas.height = size
    var ctx = canvas.getContext('2d')

    // 渐变背景
    var h1 = Math.floor(rand(0, 360))
    var h2 = (h1 + Math.floor(rand(30, 120))) % 360
    var grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, hsl(h1, rand(60, 80), rand(45, 65)))
    grad.addColorStop(1, hsl(h2, rand(60, 80), rand(40, 60)))
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    var style = styleEl.value
    ctx.save()
    if (style === 'geo') {
      // 几何图案
      for (var i = 0; i < 8; i++) {
        ctx.fillStyle = hsl(rand(0, 360), rand(50, 90), rand(60, 85), rand(0.25, 0.5))
        var s = size * rand(0.2, 0.5)
        var x = rand(-0.1, 0.9) * size
        var y = rand(-0.1, 0.9) * size
        var shape = Math.floor(rand(0, 3))
        if (shape === 0) { ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.fill() }
        else if (shape === 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(rand(0, Math.PI)); ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore() }
        else { ctx.beginPath(); ctx.moveTo(x, y - s / 2); ctx.lineTo(x + s / 2, y + s / 2); ctx.lineTo(x - s / 2, y + s / 2); ctx.closePath(); ctx.fill() }
      }
    } else if (style === 'waves') {
      // 波纹线条
      ctx.lineWidth = size * 0.03
      for (var w = 0; w < 6; w++) {
        ctx.strokeStyle = hsl(rand(0, 360), rand(60, 90), rand(65, 85), rand(0.3, 0.55))
        ctx.beginPath()
        var baseY = size * rand(0.15, 0.85)
        var amp = size * rand(0.05, 0.15)
        var phase = rand(0, Math.PI * 2)
        ctx.moveTo(0, baseY + Math.sin(phase) * amp)
        for (var x = 0; x <= size; x += size / 20) {
          ctx.lineTo(x, baseY + Math.sin(x / size * Math.PI * rand(2, 5) + phase) * amp)
        }
        ctx.stroke()
      }
    } else {
      // 圆点阵列
      var gap = size / 10
      for (var r = 0; r < 10; r++) {
        for (var c = 0; c < 10; c++) {
          var cx = c * gap + gap / 2
          var cy = r * gap + gap / 2
          if (Math.random() > 0.4) continue
          ctx.fillStyle = hsl(rand(0, 360), rand(55, 90), rand(60, 85), rand(0.35, 0.6))
          ctx.beginPath()
          ctx.arc(cx + rand(-8, 8), cy + rand(-8, 8), gap * rand(0.12, 0.3), 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    ctx.restore()

    // 首字母
    var letter = letterEl.value.trim()
    if (letter) {
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.font = 'bold ' + Math.round(size * 0.4) + 'px "SimHei", "PingFang SC", "Microsoft YaHei", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0,0,0,0.25)'
      ctx.shadowBlur = size * 0.05
      ctx.fillText(letter.toUpperCase(), size / 2, size * 0.52)
    }
  }

  document.getElementById('av-gen').addEventListener('click', generate)
  document.getElementById('av-download').addEventListener('click', function () {
    if (!canvas.width) { window.bbToast('请先生成头像'); return }
    canvas.toBlob(function (blob) {
      if (blob) window.bbDownload('avatar-' + Math.floor(Math.random() * 10000) + '.png', blob, 'image/png')
    }, 'image/png')
  })
  generate()
})()
