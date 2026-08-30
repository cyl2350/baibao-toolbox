;(function () {
  'use strict'
  var typeEl = document.getElementById('ct-type')
  var authorsEl = document.getElementById('ct-authors')
  var yearEl = document.getElementById('ct-year')
  var titleEl = document.getElementById('ct-title')
  var extraEl = document.getElementById('ct-extra-input')
  var extraLabelEl = document.getElementById('ct-extra-label')
  var outEl = document.getElementById('ct-out')

  var LABELS = {
    journal: '期刊名(含卷期页码,如: 软件学报, 2024, 35(2): 1-10)',
    book: '出版社(含出版地,如: 北京: 人民邮电出版社)',
    thesis: '学校(含城市,如: 北京: 清华大学)',
    web: '网址/访问日期(如: https://example.com [2024-01-01])',
  }

  typeEl.addEventListener('change', function () {
    extraLabelEl.textContent = LABELS[typeEl.value]
  })

  document.getElementById('ct-run').addEventListener('click', function () {
    var authors = authorsEl.value.trim()
    var year = yearEl.value.trim()
    var title = titleEl.value.trim()
    var extra = extraEl.value.trim()
    if (!authors || !title) { outEl.textContent = '请填写作者与题名'; return }
    if (typeEl.value === 'web' && !extra) { outEl.textContent = '网页类型请填写网址(格式: https://xxx [访问日期])'; return }

    var result
    var a = authors
    switch (typeEl.value) {
      case 'journal':
        result = a + '. ' + title + '[J]. ' + extra + (year ? ', ' + year : '') + '.'
        break
      case 'book':
        result = a + '. ' + title + '[M]. ' + (extra ? extra + (year ? ', ' + year : '') + '.' : (year ? year + '.' : ''))
        break
      case 'thesis':
        result = a + '. ' + title + '[D]. ' + (extra ? extra + (year ? ', ' + year : '') + '.' : (year ? year + '.' : ''))
        break
      case 'web':
        result = a + '. ' + title + '[EB/OL]. ' + extra + '.'
        break
    }
    outEl.textContent = result
    window.bbToast('已生成')
  })

  document.getElementById('ct-copy').addEventListener('click', function () {
    if (outEl.textContent && outEl.textContent !== '填写信息后点击生成') window.bbCopy(outEl.textContent)
  })

  // 示例填充按钮
  var demo = document.createElement('button')
  demo.className = 'btn secondary small'
  demo.textContent = '填入示例'
  demo.style.marginLeft = '8px'
  demo.addEventListener('click', function () {
    authorsEl.value = '张三, 李四'
    yearEl.value = '2024'
    titleEl.value = '基于深度学习的图像压缩方法研究'
    extraEl.value = '软件学报, 2024, 35(2): 1-10'
    typeEl.value = 'journal'
    extraLabelEl.textContent = LABELS.journal
    document.getElementById('ct-run').click()
  })
  document.querySelector('.field-row').appendChild(demo)
})()
