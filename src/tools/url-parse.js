;(function () {
  'use strict'
  var inEl = document.getElementById('up-in')
  var outEl = document.getElementById('up-out')

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  document.getElementById('up-run').addEventListener('click', function () {
    var raw = inEl.value.trim()
    if (!raw) { window.bbToast('请输入网址'); return }
    var url
    try {
      url = new URL(raw)
    } catch (e) {
      outEl.textContent = '解析失败:请确认网址格式(可加 https:// 前缀)'
      return
    }
    var params = Array.from(url.searchParams.entries()).map(function (p) {
      return '<tr><td style="padding:4px 8px">' + esc(p[0]) + '</td><td style="padding:4px 8px">' + esc(p[1]) + '</td></tr>'
    }).join('')
    outEl.innerHTML =
      '协议:<b>' + esc(url.protocol) + '</b><br>' +
      '主机名:<b>' + esc(url.hostname) + '</b><br>' +
      '端口:<b>' + (url.port || '(默认)') + '</b><br>' +
      '路径:<b>' + esc(url.pathname) + '</b><br>' +
      '查询字符串:<b>' + esc(url.search || '(无)') + '</b><br>' +
      '哈希:<b>' + esc(url.hash || '(无)') + '</b><br>' +
      '完整地址:<b>' + esc(url.href) + '</b>' +
      (params ? '<br><br><b>查询参数:</b><table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:4px">' +
        '<thead><tr style="background:var(--bg)"><th style="padding:4px 8px;text-align:left">参数名</th><th style="padding:4px 8px;text-align:left">值</th></tr></thead>' + params + '</table>' : '')
  })

  document.getElementById('up-copy').addEventListener('click', function () {
    var url
    try { url = new URL(inEl.value.trim()) } catch (e) { return }
    window.bbCopy(url.href)
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('up-run').click() })
})()
