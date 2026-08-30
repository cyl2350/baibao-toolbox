;(function () {
  'use strict'
  var searchEl = document.getElementById('as-search')
  var outEl = document.getElementById('as-out')

  var CTRL = {
    0: 'NUL 空字符', 1: 'SOH 标题开始', 2: 'STX 正文开始', 3: 'ETX 正文结束', 4: 'EOT 传输结束',
    5: 'ENQ 询问', 6: 'ACK 确认', 7: 'BEL 响铃', 8: 'BS 退格', 9: 'TAB 水平制表',
    10: 'LF 换行', 11: 'VT 垂直制表', 12: 'FF 换页', 13: 'CR 回车', 14: 'SO 移出',
    15: 'SI 移入', 16: 'DLE 数据链路转义', 17: 'DC1 设备控制1', 18: 'DC2 设备控制2', 19: 'DC3 设备控制3',
    20: 'DC4 设备控制4', 21: 'NAK 否认', 22: 'SYN 同步空闲', 23: 'ETB 传输块结束', 24: 'CAN 取消',
    25: 'EM 介质结束', 26: 'SUB 替换', 27: 'ESC 转义', 28: 'FS 文件分隔', 29: 'GS 组分隔',
    30: 'RS 记录分隔', 31: 'US 单元分隔', 32: 'SP 空格', 127: 'DEL 删除',
  }

  var rows = []
  for (var i = 0; i <= 127; i++) {
    var ch = i >= 33 && i <= 126 ? String.fromCharCode(i) : (i === 32 ? '(空格)' : '')
    var desc = CTRL[i] || ''
    rows.push({ dec: i, hex: '0x' + i.toString(16).toUpperCase().padStart(2, '0'), bin: i.toString(2).padStart(8, '0'), ch: ch, desc: desc })
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function render(kw) {
    var k = (kw || '').trim().toLowerCase()
    var items = rows.filter(function (r) {
      if (!k) return true
      return String(r.dec) === k || r.hex.toLowerCase().includes(k) || (k.length === 1 && r.ch.toLowerCase() === k) || r.desc.toLowerCase().includes(k)
    })
    if (!items.length) { outEl.textContent = '没有匹配项'; return }
    outEl.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
      '<thead><tr style="background:var(--bg)"><th style="padding:6px 8px;text-align:left">十进制</th><th style="padding:6px 8px;text-align:left">十六进制</th><th style="padding:6px 8px;text-align:left">二进制</th><th style="padding:6px 8px;text-align:left">字符</th><th style="padding:6px 8px;text-align:left">说明</th></tr></thead>' +
      items.map(function (r) {
        return '<tr style="border-bottom:1px solid var(--border)">' +
          '<td style="padding:5px 8px;font-family:monospace">' + r.dec + '</td>' +
          '<td style="padding:5px 8px;font-family:monospace">' + r.hex + '</td>' +
          '<td style="padding:5px 8px;font-family:monospace">' + r.bin + '</td>' +
          '<td style="padding:5px 8px"><b>' + esc(r.ch) + '</b></td>' +
          '<td style="padding:5px 8px;color:var(--muted)">' + esc(r.desc) + '</td></tr>'
      }).join('') + '</table>'
  }

  searchEl.addEventListener('input', function () { render(searchEl.value) })
  render('')
})()
