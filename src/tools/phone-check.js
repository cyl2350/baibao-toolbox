;(function () {
  'use strict'
  var inEl = document.getElementById('ph-in')
  var outEl = document.getElementById('ph-out')

  // 号段规则(前缀区间 → 运营商)
  var SEGMENTS = [
    { re: /^13[4-9]|^147|^15[0-2]|^157|^158|^159|^17[2-8]|^18[2-4]|^18[7-8]|^195|^197|^198/, name: '中国移动' },
    { re: /^13[0-2]|^145|^146|^155|^156|^166|^167|^171|^175|^176|^185|^186|^196/, name: '中国联通' },
    { re: /^133|^149|^153|^17[3-4]|^17[79]|^18[019]|^19[0139]/, name: '中国电信' },
    { re: /^192/, name: '中国广电' },
  ]

  function detect(num) {
    for (var i = 0; i < SEGMENTS.length; i++) {
      if (SEGMENTS[i].re.test(num)) return SEGMENTS[i].name
    }
    return null
  }

  document.getElementById('ph-run').addEventListener('click', function () {
    var num = inEl.value.trim()
    if (!/^1\d{10}$/.test(num)) {
      outEl.innerHTML = '<b style="color:var(--err)">✗ 格式不合法</b>:手机号必须为 11 位数字,以 1 开头'
      return
    }
    var op = detect(num)
    if (!op) {
      outEl.innerHTML = '<b style="color:#d97706">⚠ 格式合规,但号段暂未收录</b>:可能为新放号段,请以运营商为准'
      return
    }
    outEl.innerHTML =
      '<b style="color:var(--ok)">✓ 格式合法</b><br>' +
      '号码:<b>' + num.slice(0, 3) + '****' + num.slice(7) + '</b><br>' +
      '运营商:<b>' + op + '</b><br>' +
      '<span class="tip">提示:格式与号段只能判断「看起来像」,是否在用需以运营商系统为准。请勿将他人号码输入查询。</span>'
  })

  document.getElementById('ph-demo').addEventListener('click', function () {
    inEl.value = '13800138000'
    document.getElementById('ph-run').click()
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('ph-run').click() })
})()
