;(function () {
  'use strict'
  var outEl = document.getElementById('dc-out')

  document.getElementById('dc-run').addEventListener('click', function () {
    var price = parseFloat(document.getElementById('dc-original').value)
    var disc = parseFloat(document.getElementById('dc-discount').value)
    if (isNaN(price) || price < 0) { outEl.textContent = '请输入有效原价'; return }
    if (isNaN(disc) || disc <= 0 || disc > 10) { outEl.textContent = '折扣需在 0.1~10 之间'; return }

    var rate = disc / 10
    var useFull = document.getElementById('dc-full').checked
    var threshold = parseFloat(document.getElementById('dc-full-threshold').value) || 0
    var cut = parseFloat(document.getElementById('dc-full-cut').value) || 0

    // 方案 A:先打折再满减
    var afterDisc = price * rate
    var planA = afterDisc
    var aCut = 0
    if (useFull && afterDisc >= threshold) { aCut = cut; planA -= cut }
    // 方案 B:先满减再打折
    var planB = price
    var bCut = 0
    if (useFull && price >= threshold) { bCut = cut; planB = (price - cut) * rate }

    var best = planA <= planB ? planA : planB
    var saved = price - best

    outEl.innerHTML =
      '折后价(仅折扣):<b>' + afterDisc.toFixed(2) + '</b> 元,节省 <b style="color:var(--ok)">' + (price - afterDisc).toFixed(2) + '</b> 元<br>' +
      (useFull
        ? '方案 A(先打折再满减):<b>' + planA.toFixed(2) + '</b> 元(满减 ' + aCut.toFixed(0) + ')<br>' +
          '方案 B(先满减再打折):<b>' + planB.toFixed(2) + '</b> 元(满减 ' + bCut.toFixed(0) + ')<br>' +
          '最划算:<b style="color:var(--ok);font-size:20px">' + best.toFixed(2) + '</b> 元(方案' + (planA <= planB ? 'A' : 'B') + ')<br>' +
          '最终节省:<b style="color:var(--ok)">' + saved.toFixed(2) + '</b> 元,折扣率 <b>' + (best / price * 10).toFixed(2) + '</b> 折'
        : '最终实付:<b style="color:var(--ok);font-size:20px">' + best.toFixed(2) + '</b> 元,相当于 <b>' + (best / price * 10).toFixed(2) + '</b> 折')
  })

  document.getElementById('dc-demo').addEventListener('click', function () {
    document.getElementById('dc-original').value = '399'
    document.getElementById('dc-discount').value = '7'
    document.getElementById('dc-full').checked = true
    document.getElementById('dc-full-threshold').value = '300'
    document.getElementById('dc-full-cut').value = '40'
    document.getElementById('dc-run').click()
  })
})()
