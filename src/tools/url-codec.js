;(function () {
  'use strict'
  var inEl = document.getElementById('uc-in')
  var outEl = document.getElementById('uc-out')

  document.getElementById('uc-encode').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    try { outEl.value = encodeURI(v); window.bbToast('编码完成') } catch (e) { window.bbToast('编码失败') }
  })
  document.getElementById('uc-component').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    try { outEl.value = encodeURIComponent(v); window.bbToast('编码完成') } catch (e) { window.bbToast('编码失败') }
  })
  document.getElementById('uc-decode').addEventListener('click', function () {
    var v = inEl.value
    if (!v) { window.bbToast('请输入内容'); return }
    try { outEl.value = decodeURIComponent(v); window.bbToast('解码完成') } catch (e) { window.bbToast('解码失败:内容不是合法的编码') }
  })
  document.getElementById('uc-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
