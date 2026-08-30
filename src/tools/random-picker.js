;(function () {
  'use strict'
  var listEl = document.getElementById('rp-list')
  var countEl = document.getElementById('rp-count')
  var repeatEl = document.getElementById('rp-repeat')
  var outEl = document.getElementById('rp-out')

  function randInt(max) {
    var buf = new Uint32Array(1)
    var limit = Math.floor(0x100000000 / max) * max
    var x
    do { crypto.getRandomValues(buf); x = buf[0] } while (x >= limit)
    return x % max
  }

  document.getElementById('rp-run').addEventListener('click', function () {
    var names = listEl.value.split(/\r?\n/).map(function (s) { return s.trim() }).filter(Boolean)
    var count = parseInt(countEl.value, 10) || 1
    if (!names.length) { window.bbToast('请输入名单'); return }
    if (!repeatEl.checked && count > names.length) {
      window.bbToast('不重复抽取时人数不能超过名单数量')
      return
    }
    var picked = []
    var pool = names.slice()
    for (var i = 0; i < count; i++) {
      if (!pool.length) pool = names.slice()
      var idx = randInt(pool.length)
      picked.push(pool[idx])
      if (!repeatEl.checked) pool.splice(idx, 1)
    }
    outEl.innerHTML = picked.map(function (n, i) {
      return '<b style="font-size:24px;color:var(--primary)">' + n + '</b>' + (i < picked.length - 1 ? '　' : '')
    }).join('')
    window.bbToast('抽取完成')
  })

  document.getElementById('rp-reset').addEventListener('click', function () {
    outEl.textContent = '点击「开始抽取」'
  })

  document.getElementById('rp-rand').addEventListener('click', function () {
    var min = parseInt(document.getElementById('rp-min').value, 10) || 1
    var max = parseInt(document.getElementById('rp-max').value, 10) || 100
    if (max <= min) { document.getElementById('rp-rand-out').textContent = '最大值必须大于最小值'; return }
    var span = max - min + 1
    document.getElementById('rp-rand-out').textContent = '结果:' + (min + randInt(span))
  })
})()
