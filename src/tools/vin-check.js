;(function () {
  'use strict'
  var inEl = document.getElementById('vin-in')
  var outEl = document.getElementById('vin-out')

  // 字符→值映射
  var VALUES = {}
  var map = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 }
  for (var k in map) VALUES[k] = map[k]
  for (var d = 0; d <= 9; d++) VALUES[String(d)] = d

  var WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

  // 第 10 位:车型年份(1980 起 30 年循环)
  var YEAR_CHARS = 'ABCDEFGHJKLMNPRSTVWXY123456789'
  function yearFromChar(ch) {
    var idx = YEAR_CHARS.indexOf(ch.toUpperCase())
    if (idx < 0) return '未知'
    var year = 1980 + idx
    if (year > 2009) year -= 30 // 2010 起循环
    return year + ' 年'
  }

  function wmiRegion(wmi) {
    var c = wmi[0]
    if (c >= '1' && c <= '5') return '北美(美国/加拿大/墨西哥)'
    if (c === '6' || c === '7') return '大洋洲(澳大利亚/新西兰)'
    if (c === '8' || c === '9') return '南美(巴西/阿根廷等)'
    if (c >= 'A' && c <= 'H') return '非洲'
    if (c === 'J' || c === 'K' || c === 'L') return '亚洲(日本/韩国/中国等)'
    if (c === 'M' || c === 'N' || c === 'P' || c === 'R') return '欧洲'
    if (c === 'S' || c === 'T') return '欧洲(英国/德国等)'
    if (c === 'V' || c === 'W' || c === 'X' || c === 'Y' || c === 'Z') return '欧洲'
    return '未知区域'
  }

  document.getElementById('vin-run').addEventListener('click', function () {
    var vin = inEl.value.trim().toUpperCase()
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      outEl.textContent = '格式错误:VIN 必须为 17 位,且不含 I、O、Q'
      return
    }
    // 校验码
    var sum = 0
    for (var i = 0; i < 17; i++) sum += VALUES[vin[i]] * WEIGHTS[i]
    var check = sum % 11
    var checkChar = check === 10 ? 'X' : String(check)
    var ok = vin[8] === checkChar
    outEl.innerHTML =
      (ok ? '<b style="color:var(--ok)">✓ 校验码正确</b>' : '<b style="color:var(--err)">✗ 校验码错误(应为 ' + checkChar + ',实际 ' + vin[8] + ')</b>') +
      '<br>制造商区域(WMI):<b>' + wmiRegion(vin.slice(0, 3)) + '</b><br>' +
      '车型年份(第 10 位):<b>' + yearFromChar(vin[9]) + '</b><br>' +
      '顺序号(VIS 后 6 位):<b>' + vin.slice(11) + '</b><br>' +
      '<span class="tip">提示:校验通过只代表编码符合规范,车辆真实信息需以车管所/官方数据库为准。请勿用他人 VIN 查询隐私信息。</span>'
  })

  document.getElementById('vin-demo').addEventListener('click', function () {
    inEl.value = '1HGCM82633A004352'
    document.getElementById('vin-run').click()
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('vin-run').click() })
})()
