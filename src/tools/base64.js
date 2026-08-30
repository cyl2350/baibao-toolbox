;(function () {
  'use strict'
  var inEl = document.getElementById('b64-in')
  var outEl = document.getElementById('b64-out')

  function encodeUtf8Base64(str) {
    var bytes = new TextEncoder().encode(str)
    var bin = ''
    var CHUNK = 0x8000
    for (var i = 0; i < bytes.length; i += CHUNK) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK))
    }
    return btoa(bin)
  }

  function decodeUtf8Base64(b64) {
    var bin = atob(b64.replace(/\s+/g, ''))
    var bytes = new Uint8Array(bin.length)
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return new TextDecoder('utf-8').decode(bytes)
  }

  document.getElementById('b64-encode').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    try { outEl.value = encodeUtf8Base64(v); window.bbToast('编码完成') }
    catch (e) { window.bbToast('编码失败:' + e.message) }
  })

  document.getElementById('b64-decode').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    try { outEl.value = decodeUtf8Base64(v); window.bbToast('解码完成') }
    catch (e) { window.bbToast('解码失败:不是合法的 Base64') }
  })

  document.getElementById('b64-swap').addEventListener('click', function () {
    var t = inEl.value
    inEl.value = outEl.value
    outEl.value = t
  })

  document.getElementById('b64-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
