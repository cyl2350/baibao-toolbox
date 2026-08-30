;(function () {
  'use strict'
  var sexEl = document.getElementById('bf-sex')
  var hipRow = document.getElementById('bf-hip-row')
  var outEl = document.getElementById('bf-out')

  sexEl.addEventListener('change', function () {
    hipRow.style.display = sexEl.value === 'f' ? 'block' : 'none'
  })

  document.getElementById('bf-run').addEventListener('click', function () {
    var sex = sexEl.value
    var h = parseFloat(document.getElementById('bf-height').value)
    var waist = parseFloat(document.getElementById('bf-waist').value)
    var neck = parseFloat(document.getElementById('bf-neck').value)
    var hip = sex === 'f' ? (parseFloat(document.getElementById('bf-hip').value) || 0) : 0
    if (!h || !waist || !neck || h < 120 || waist < 40 || neck < 20) {
      outEl.textContent = '请输入有效的身高与围度'
      return
    }
    if (sex === 'f' && !hip) { outEl.textContent = '女性需要填写臀围'; return }

    var bf
    if (sex === 'm') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450
    }
    bf = Math.max(3, Math.min(60, bf))

    var level, color
    if (sex === 'm') {
      if (bf < 14) { level = '运动员/精瘦'; color = 'var(--ok)' }
      else if (bf < 18) { level = '健康'; color = 'var(--ok)' }
      else if (bf < 25) { level = '可接受'; color = '#d97706' }
      else { level = '肥胖'; color = 'var(--err)' }
    } else {
      if (bf < 21) { level = '运动员/精瘦'; color = 'var(--ok)' }
      else if (bf < 25) { level = '健康'; color = 'var(--ok)' }
      else if (bf < 32) { level = '可接受'; color = '#d97706' }
      else { level = '肥胖'; color = 'var(--err)' }
    }
    outEl.innerHTML =
      '体脂率:<b style="font-size:26px">' + bf.toFixed(1) + '%</b>　评级:<b style="color:' + color + '">' + level + '</b><br>' +
      '<span class="tip">男性参考:14% 以下精瘦,14~17% 健康,18~24% 可接受,25%+ 肥胖;女性相应 +7% 左右。</span>'
  })

  document.getElementById('bf-demo').addEventListener('click', function () {
    sexEl.value = 'm'
    document.getElementById('bf-height').value = '175'
    document.getElementById('bf-waist').value = '80'
    document.getElementById('bf-neck').value = '38'
    document.getElementById('bf-run').click()
  })
})()
