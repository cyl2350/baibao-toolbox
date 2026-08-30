;(function () {
  'use strict'
  var searchEl = document.getElementById('ips-search')
  var outEl = document.getElementById('ips-out')

  var DATA = [
    ['一寸', '2.5 × 3.5', '295 × 413', '身份证、学生证、简历最常用'],
    ['小一寸', '2.2 × 3.2', '260 × 378', '驾照、部分考试报名'],
    ['大一寸', '3.3 × 4.8', '390 × 567', '护照、签证、港澳通行证常用'],
    ['二寸', '3.5 × 4.9', '413 × 579', '毕业证、学位证、部分报名表'],
    ['小二寸', '3.5 × 4.5', '413 × 531', '公务员考试、部分签证'],
    ['大二寸', '3.5 × 5.3', '413 × 626', '部分考试报名、出国材料'],
    ['三寸', '5.5 × 8.4', '649 × 992', '荣誉证书、纪念照'],
    ['五寸', '12.7 × 8.9', '1500 × 1050', '普通照片冲洗'],
    ['六寸', '15.2 × 10.2', '1795 × 1205', '照片冲洗常用尺寸'],
    ['七寸', '17.8 × 12.7', '2100 × 1500', '相册、摆台'],
    ['身份证', '8.56 × 5.4', '1012 × 638', '二代身份证(公安部标准)'],
    ['驾驶证(一版)', '2.2 × 3.2', '260 × 378', '驾驶证照片'],
    ['签证(美签)', '5.1 × 5.1', '602 × 602', '美国签证照片(正方形)'],
    ['签证(申根)', '3.5 × 4.5', '413 × 531', '申根签证照片'],
    ['日本签证', '4.5 × 4.5', '531 × 531', '日本签证照片'],
    ['韩国签证', '3.5 × 4.5', '413 × 531', '韩国签证照片'],
    ['港澳通行证', '3.3 × 4.8', '390 × 567', '港澳通行证照片'],
    ['台湾通行证', '3.3 × 4.8', '390 × 567', '往来台湾通行证'],
  ]

  function px(cm) { return cm }

  function render(kw) {
    var k = (kw || '').trim().toLowerCase()
    var items = DATA.filter(function (r) {
      if (!k) return true
      return r[0].toLowerCase().includes(k) || r[1].includes(k) || r[3].toLowerCase().includes(k)
    })
    if (!items.length) { outEl.textContent = '没有匹配的尺寸,试试「一寸」「护照」等关键词'; return }
    outEl.innerHTML = '<table style="width:100%;border-collapse:collapse;font-size:13px">' +
      '<thead><tr style="background:var(--bg)"><th style="padding:6px 8px;text-align:left">类型</th><th style="padding:6px 8px;text-align:right">尺寸(cm)</th><th style="padding:6px 8px;text-align:right">像素(300dpi)</th><th style="padding:6px 8px;text-align:left">用途</th></tr></thead>' +
      items.map(function (r) {
        return '<tr style="border-bottom:1px solid var(--border)">' +
          '<td style="padding:6px 8px"><b>' + r[0] + '</b></td>' +
          '<td style="padding:6px 8px;text-align:right">' + r[1] + '</td>' +
          '<td style="padding:6px 8px;text-align:right;font-family:monospace">' + r[2] + '</td>' +
          '<td style="padding:6px 8px;color:var(--muted)">' + r[3] + '</td></tr>'
      }).join('') + '</table>'
  }

  searchEl.addEventListener('input', function () { render(searchEl.value) })
  render('')
})()
