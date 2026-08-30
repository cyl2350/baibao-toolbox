;(function () {
  'use strict'
  var styleEl = document.getElementById('rc-style')
  var countEl = document.getElementById('rc-count')
  var paletteEl = document.getElementById('rc-palette')

  function hslToHex(h, s, l) {
    s /= 100; l /= 100
    var c = (1 - Math.abs(2 * l - 1)) * s
    var x = c * (1 - Math.abs((h / 60) % 2 - 1))
    var m = l - c / 2
    var r, g, b
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }
    var toHex = function (v) { return ('0' + Math.round((v + m) * 255).toString(16)).slice(-2) }
    return '#' + toHex(r) + toHex(g) + toHex(b)
  }

  function generate() {
    var style = styleEl.value
    var count = parseInt(countEl.value, 10) || 6
    count = Math.max(1, Math.min(20, count))
    countEl.value = count
    var html = ''
    var all = []
    for (var i = 0; i < count; i++) {
      var h = Math.floor(Math.random() * 360)
      var s = style === 'pastel' ? 50 + Math.random() * 20 : style === 'dark' ? 30 + Math.random() * 25 : 65 + Math.random() * 30
      var l = style === 'pastel' ? 75 + Math.random() * 12 : style === 'dark' ? 25 + Math.random() * 15 : 45 + Math.random() * 20
      var hex = hslToHex(h, s, l)
      all.push(hex)
      var rgb = [0, 1, 2].map(function (i) { return parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) }).join(', ')
      html += '<div class="panel" style="display:flex;align-items:center;gap:14px;padding:10px 14px;cursor:pointer" data-hex="' + hex + '">' +
        '<span style="width:56px;height:56px;border-radius:10px;background:' + hex + ';border:1px solid var(--border);flex:none"></span>' +
        '<span style="flex:1"><b>' + hex + '</b><br><span style="font-size:13px;color:var(--muted)">rgb(' + rgb + ')</span></span>' +
        '<span style="font-size:12px;color:var(--muted)">点击复制</span>' +
        '</div>'
    }
    paletteEl.innerHTML = html
    paletteEl._all = all
    paletteEl.querySelectorAll('[data-hex]').forEach(function (el) {
      el.addEventListener('click', function () { window.bbCopy(el.getAttribute('data-hex')) })
    })
  }

  document.getElementById('rc-run').addEventListener('click', generate)
  document.getElementById('rc-copy-all').addEventListener('click', function () {
    if (paletteEl._all && paletteEl._all.length) window.bbCopy(paletteEl._all.join(' '))
  })
  generate()
})()
