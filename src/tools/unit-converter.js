;(function () {
  'use strict'
  var categoryEl = document.getElementById('uc-category')
  var fromEl = document.getElementById('uc-from')
  var toEl = document.getElementById('uc-to')
  var valueEl = document.getElementById('uc-value')
  var outEl = document.getElementById('uc-out')

  // factor: 相对基准单位
  var UNITS = {
    length: { base: '米', units: { '米': 1, '千米': 1000, '厘米': 0.01, '毫米': 0.001, '英里': 1609.344, '英尺': 0.3048, '英寸': 0.0254, '市里': 500, '市尺': 1 / 3, '海里': 1852 } },
    weight: { base: '千克', units: { '千克': 1, '克': 0.001, '吨': 1000, '市斤': 0.5, '市两': 0.05, '磅': 0.45359237, '盎司': 0.028349523125, '克拉': 0.0002 } },
    temperature: { special: true, units: { '摄氏 ℃': 'C', '华氏 ℉': 'F', '开氏 K': 'K' } },
    area: { base: '平方米', units: { '平方米': 1, '平方千米': 1e6, '公顷': 10000, '市亩': 2000 / 3, '平方英尺': 0.09290304, '平方英寸': 0.00064516, '平方英里': 2589988.110336 } },
    volume: { base: '升', units: { '升': 1, '毫升': 0.001, '立方米': 1000, '立方厘米': 0.001, '美制加仑': 3.785411784, '英制加仑': 4.54609, '品脱(美)': 0.473176473 } },
    speed: { base: '米/秒', units: { '米/秒': 1, '千米/时': 1 / 3.6, '英里/时': 0.44704, '节': 0.514444, '马赫': 340.3 } },
    storage: { base: '字节', units: { '字节 B': 1, '千字节 KB': 1024, '兆字节 MB': 1048576, '吉字节 GB': 1073741824, '太字节 TB': 1099511627776, '位 bit': 0.125 } },
    time: { base: '秒', units: { '秒': 1, '分钟': 60, '小时': 3600, '天': 86400, '周': 604800, '月(30天)': 2592000, '年(365天)': 31536000 } },
  }

  function fillUnits() {
    var def = UNITS[categoryEl.value]
    var names = Object.keys(def.units)
    fromEl.innerHTML = names.map(function (n) { return '<option value="' + n + '">' + n + '</option>' }).join('')
    toEl.innerHTML = names.map(function (n) { return '<option value="' + n + '">' + n + '</option>' }).join('')
    if (names.length > 1) toEl.selectedIndex = 1
  }

  function convertTemp(v, from, to) {
    // 统一到摄氏
    var c
    if (from === 'C') c = v
    else if (from === 'F') c = (v - 32) * 5 / 9
    else c = v - 273.15
    if (to === 'C') return c
    if (to === 'F') return c * 9 / 5 + 32
    return c + 273.15
  }

  document.getElementById('uc-run').addEventListener('click', function () {
    var v = parseFloat(valueEl.value)
    if (isNaN(v)) { outEl.textContent = '请输入有效数值'; return }
    var def = UNITS[categoryEl.value]
    var from = fromEl.value
    var to = toEl.value
    var result
    if (def.special) {
      result = convertTemp(v, def.units[from], def.units[to])
    } else {
      result = v * def.units[from] / def.units[to]
    }
    outEl.innerHTML = v + ' ' + from + ' = <b>' + result.toLocaleString('zh-CN', { maximumFractionDigits: 6 }) + '</b> ' + to
  })

  categoryEl.addEventListener('change', fillUnits)
  fillUnits()
})()
