;(function () {
  'use strict'
  var inEl = document.getElementById('md5-in')
  var outEl = document.getElementById('md5-out')

  function hex(bytes) {
    return Array.prototype.map.call(bytes, function (b) {
      return ('0' + b.toString(16)).slice(-2)
    }).join('')
  }

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return hex(new Uint8Array(buf))
    })
  }

  document.getElementById('md5-lower').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    try { outEl.value = window.md5(v); window.bbToast('计算完成') } catch (e) { window.bbToast('计算失败:' + e.message) }
  })
  document.getElementById('md5-upper').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    try { outEl.value = window.md5(v).toUpperCase(); window.bbToast('计算完成') } catch (e) { window.bbToast('计算失败:' + e.message) }
  })
  document.getElementById('md5-sha256').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    sha256(v).then(function (h) { outEl.value = h; window.bbToast('计算完成') })
      .catch(function () { window.bbToast('计算失败') })
  })
  document.getElementById('md5-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
