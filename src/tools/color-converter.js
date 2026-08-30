;(function () {
  'use strict'
  var inEl = document.getElementById('cc-in')
  var previewEl = document.getElementById('cc-preview')
  var outEl = document.getElementById('cc-out')
  var pickerEl = document.getElementById('cc-picker')

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

  // 解析各种格式 -> {r,g,b,a} (0-255, a 0-1)
  function parseColor(str) {
    var s = str.trim().toLowerCase()
    var m
    if ((m = s.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/))) {
      var hex = m[1]
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(function (c) { return c + c }).join('')
      }
      var r = parseInt(hex.slice(0, 2), 16)
      var g = parseInt(hex.slice(2, 4), 16)
      var b = parseInt(hex.slice(4, 6), 16)
      var a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
      return { r: r, g: g, b: b, a: a }
    }
    if ((m = s.match(/^rgba?\(\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*,\s*([\d.]+%?)\s*(?:,\s*([\d.]+%?)\s*)?\)$/))) {
      var to255 = function (v) {
        if (v.indexOf('%') > -1) return Math.round(parseFloat(v) / 100 * 255)
        return Math.round(parseFloat(v))
      }
      var a = m[4] === undefined ? 1 : (m[4].indexOf('%') > -1 ? parseFloat(m[4]) / 100 : parseFloat(m[4]))
      return { r: clamp(to255(m[1]), 0, 255), g: clamp(to255(m[2]), 0, 255), b: clamp(to255(m[3]), 0, 255), a: clamp(a, 0, 1) }
    }
    if ((m = s.match(/^hsla?\(\s*([\d.]+)(?:deg)?\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+%?)\s*)?\)$/))) {
      var h = ((parseFloat(m[1]) % 360) + 360) % 360
      var s2 = clamp(parseFloat(m[2]) / 100, 0, 1)
      var l = clamp(parseFloat(m[3]) / 100, 0, 1)
      var a2 = m[4] === undefined ? 1 : (m[4].indexOf('%') > -1 ? parseFloat(m[4]) / 100 : parseFloat(m[4]))
      var c = (1 - Math.abs(2 * l - 1)) * s2
      var x = c * (1 - Math.abs((h / 60) % 2 - 1))
      var mm = l - c / 2
      var rgb
      if (h < 60) rgb = [c, x, 0]
      else if (h < 120) rgb = [x, c, 0]
      else if (h < 180) rgb = [0, c, x]
      else if (h < 240) rgb = [0, x, c]
      else if (h < 300) rgb = [x, 0, c]
      else rgb = [c, 0, x]
      return {
        r: Math.round((rgb[0] + mm) * 255),
        g: Math.round((rgb[1] + mm) * 255),
        b: Math.round((rgb[2] + mm) * 255),
        a: clamp(a2, 0, 1),
      }
    }
    return null
  }

  function rgbToHsl(r, g, b) {
    var rn = r / 255, gn = g / 255, bn = b / 255
    var max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
    var h = 0, s = 0, l = (max + min) / 2
    var d = max - min
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break
        case gn: h = (bn - rn) / d + 2; break
        case bn: h = (rn - gn) / d + 4; break
      }
      h *= 60
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  function toHex(r, g, b, a) {
    var hex = '#' + [r, g, b].map(function (v) { return ('0' + v.toString(16)).slice(-2) }).join('')
    if (a < 1) hex += ('0' + Math.round(a * 255).toString(16)).slice(-2)
    return hex
  }

  function render() {
    var c = parseColor(inEl.value)
    if (!c) {
      outEl.textContent = '无法识别该颜色格式,请尝试 #4f6ef7、rgb(79,110,247) 或 hsl(230,91%,64%)'
      return
    }
    var hsl = rgbToHsl(c.r, c.g, c.b)
    var hex = toHex(c.r, c.g, c.b, c.a)
    previewEl.style.background = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')'
    outEl.innerHTML =
      'HEX:<b>' + hex + '</b>　<a href="javascript:void 0" onclick="window.bbCopy(\'' + hex + '\')">复制</a><br>' +
      'RGB:<b>rgb(' + c.r + ', ' + c.g + ', ' + c.b + (c.a < 1 ? ', ' + c.a : '') + ')</b><br>' +
      'HSL:<b>hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)</b>'
  }

  inEl.addEventListener('input', render)
  pickerEl.addEventListener('input', function () {
    inEl.value = pickerEl.value
    render()
  })
  render()
})()
