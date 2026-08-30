;(function () {
  'use strict'
  var heightEl = document.getElementById('bmi-height')
  var weightEl = document.getElementById('bmi-weight')
  var outEl = document.getElementById('bmi-out')

  document.getElementById('bmi-run').addEventListener('click', function () {
    var h = parseFloat(heightEl.value)
    var w = parseFloat(weightEl.value)
    if (!h || !w || h <= 0 || w <= 0) { outEl.textContent = '请输入有效的身高与体重'; return }
    var hm = h / 100
    var bmi = w / (hm * hm)
    var level, color
    if (bmi < 18.5) { level = '偏瘦'; color = '#d97706' }
    else if (bmi < 24) { level = '正常'; color = 'var(--ok)' }
    else if (bmi < 28) { level = '超重'; color = '#d97706' }
    else { level = '肥胖'; color = 'var(--err)' }

    var idealLow = 18.5 * hm * hm
    var idealHigh = 23.9 * hm * hm
    var advice = ''
    if (bmi < 18.5) advice = '建议适当增加营养摄入与力量训练。'
    else if (bmi < 24) advice = '保持现有生活方式,注意均衡饮食与规律运动。'
    else if (bmi < 28) advice = '建议控制饮食、增加有氧运动。'
    else advice = '建议咨询医生或营养师,制定减重计划。'

    outEl.innerHTML =
      'BMI 指数:<b style="font-size:26px">' + bmi.toFixed(1) + '</b>　评级:<b style="color:' + color + '">' + level + '</b><br>' +
      '理想体重范围:<b>' + idealLow.toFixed(1) + ' ~ ' + idealHigh.toFixed(1) + '</b> kg<br>' +
      '建议:' + advice
  })

  heightEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('bmi-run').click() })
  weightEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('bmi-run').click() })
})()
