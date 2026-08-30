;(function () {
  'use strict'
  var fileEl = document.getElementById('b64-file')
  var rawEl = document.getElementById('b64-raw')
  var outEl = document.getElementById('b64-out')

  document.getElementById('b64-convert').addEventListener('click', function () {
    var f = fileEl.files[0]
    if (!f) { window.bbToast('请先选择图片'); return }
    var reader = new FileReader()
    reader.onload = function () {
      var data = reader.result
      if (rawEl.checked && data.indexOf(',') > -1) {
        data = data.slice(data.indexOf(',') + 1)
      }
      outEl.value = data
      window.bbToast('转换完成,共 ' + data.length + ' 字符')
    }
    reader.onerror = function () { window.bbToast('读取文件失败') }
    reader.readAsDataURL(f)
  })

  document.getElementById('b64-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
  document.getElementById('b64-download').addEventListener('click', function () {
    if (outEl.value) window.bbDownload('image-base64.txt', outEl.value, 'text/plain')
  })
})()
