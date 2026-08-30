;(function () {
  'use strict'
  var textEl = document.getElementById('ti-text')
  var styleEl = document.getElementById('ti-style')
  var sizeEl = document.getElementById('ti-size')
  var canvas = document.getElementById('ti-canvas')

  var STYLES = {
    sunset: ['#f97316', '#ec4899'],
    ocean: ['#0ea5e9', '#2563eb'],
    forest: ['#22c55e', '#0f766e'],
    dark: ['#1f2937', '#111827'],
    blush: ['#fda4af', '#c084fc'],
  }

  function wrapText(ctx, text, maxWidth) {
    var lines = []
    text.split('\n').forEach(function (raw) {
      if (!raw) { lines.push(''); return }
      var line = ''
      for (var ch of raw) {
        if (ctx.measureText(line + ch).width > maxWidth && line) { lines.push(line); line = ch }
        else line += ch
      }
      lines.push(line)
    })
    return lines
  }

  function generate() {
    var text = textEl.value.trim()
    if (!text) { window.bbToast('请输入文字'); return }
    var parts = sizeEl.value.split(',').map(Number)
    canvas.width = parts[0]
    canvas.height = parts[1]
    var ctx = canvas.getContext('2d')

    var colors = STYLES[styleEl.value]
    var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, colors[0])
    grad.addColorStop(1, colors[1])
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 装饰圆
    ctx.fillStyle = 'rgba(255,255,255,0.07)'
    ctx.beginPath(); ctx.arc(canvas.width * 0.85, canvas.height * 0.15, canvas.width * 0.3, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(canvas.width * 0.12, canvas.height * 0.9, canvas.width * 0.2, 0, Math.PI * 2); ctx.fill()

    // 文字
    var fontSize = Math.max(28, Math.round(canvas.width / 16))
    ctx.font = 'bold ' + fontSize + 'px "SimHei", "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    var lines = wrapText(ctx, text, canvas.width * 0.8)
    var lineHeight = fontSize * 1.6
    var startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = fontSize * 0.15
    ctx.fillStyle = '#ffffff'
    lines.forEach(function (line, i) {
      ctx.fillText(line, canvas.width / 2, startY + i * lineHeight)
    })
    ctx.shadowBlur = 0
  }

  document.getElementById('ti-gen').addEventListener('click', generate)
  document.getElementById('ti-download').addEventListener('click', function () {
    if (!canvas.width) { window.bbToast('请先生成卡片'); return }
    canvas.toBlob(function (blob) {
      if (blob) window.bbDownload('text-card.png', blob, 'image/png')
    }, 'image/png')
  })
  generate()
})()
