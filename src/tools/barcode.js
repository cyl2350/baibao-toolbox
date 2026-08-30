;(function () {
  'use strict'
  var valueEl = document.getElementById('bc-value')
  var formatEl = document.getElementById('bc-format')
  var heightEl = document.getElementById('bc-height')
  var textEl = document.getElementById('bc-text')
  var svgEl = document.getElementById('bc-svg')
  var lastCanvas = null

  function generate() {
    var value = valueEl.value.trim()
    var format = formatEl.value
    if (!value) { window.bbToast('请输入条形码内容'); return }
    // EAN/UPC 长度检查
    if (format === 'EAN13' && !/^\d{12}$/.test(value)) { window.bbToast('EAN-13 需要 12 位数字(校验位自动生成)'); return }
    if (format === 'EAN8' && !/^\d{7}$/.test(value)) { window.bbToast('EAN-8 需要 7 位数字'); return }
    if (format === 'UPC' && !/^\d{11}$/.test(value)) { window.bbToast('UPC 需要 11 位数字'); return }
    try {
      JsBarcode('#bc-svg', value, {
        format: format,
        width: 2,
        height: parseInt(heightEl.value, 10) || 80,
        displayValue: textEl.checked,
        font: 'monospace',
        fontSize: 14,
        margin: 8,
        background: '#ffffff',
        lineColor: '#000000',
      })
      lastCanvas = null
      window.bbToast('条形码已生成')
    } catch (e) {
      window.bbToast('生成失败:' + e.message)
    }
  }

  document.getElementById('bc-gen').addEventListener('click', generate)
  valueEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') generate() })

  document.getElementById('bc-download').addEventListener('click', function () {
    var value = valueEl.value.trim()
    if (!value) { window.bbToast('请先生成条形码'); return }
    // 用 canvas 重新渲染以导出 PNG
    var canvas = document.createElement('canvas')
    try {
      JsBarcode(canvas, value, {
        format: formatEl.value,
        width: 2,
        height: parseInt(heightEl.value, 10) || 80,
        displayValue: textEl.checked,
        font: 'monospace',
        fontSize: 14,
        margin: 8,
      })
      canvas.toBlob(function (blob) {
        if (blob) window.bbDownload('barcode.png', blob, 'image/png')
      }, 'image/png')
    } catch (e) {
      window.bbToast('下载失败:' + e.message)
    }
  })
})()
