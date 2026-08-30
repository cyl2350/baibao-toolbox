;(function () {
  'use strict'
  var outEl = document.getElementById('cal-out')

  document.getElementById('cal-run').addEventListener('click', function () {
    var sex = document.getElementById('cal-sex').value
    var age = parseFloat(document.getElementById('cal-age').value)
    var h = parseFloat(document.getElementById('cal-height').value)
    var w = parseFloat(document.getElementById('cal-weight').value)
    var act = parseFloat(document.getElementById('cal-activity').value)
    if (!age || !h || !w || age < 10 || age > 100 || h < 100 || h > 230 || w < 30 || w > 200) {
      outEl.textContent = '请输入有效参数'
      return
    }
    var bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'm' ? 5 : -161)
    var tdee = bmr * act
    outEl.innerHTML =
      '基础代谢 BMR:<b>' + Math.round(bmr) + '</b> 大卡/天<br>' +
      '每日总消耗 TDEE:<b>' + Math.round(tdee) + '</b> 大卡/天<br>' +
      '—— 目标热量建议 ——<br>' +
      '减脂(缺 500):<b>' + Math.round(tdee - 500) + '</b> 大卡/天<br>' +
      '保持体重:<b>' + Math.round(tdee) + '</b> 大卡/天<br>' +
      '增肌(盈 300):<b>' + Math.round(tdee + 300) + '</b> 大卡/天<br>' +
      'BMI:' + (w / (h / 100) ** 2).toFixed(1) + '(参考<a href="../bmi/">BMI 标准</a>)'
  })
})()
