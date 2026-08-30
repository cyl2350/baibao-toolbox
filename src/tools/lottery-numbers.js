;(function () {
  'use strict'
  var typeEl = document.getElementById('ln-type')
  var countEl = document.getElementById('ln-count')
  var outEl = document.getElementById('ln-out')

  function randInt(max) {
    var buf = new Uint32Array(1)
    var limit = Math.floor(0x100000000 / max) * max
    var x
    do { crypto.getRandomValues(buf); x = buf[0] } while (x >= limit)
    return x % max
  }

  function pickDistinct(count, max) {
    var pool = []
    for (var i = 1; i <= max; i++) pool.push(i)
    // Fisher-Yates 部分洗牌
    for (var j = pool.length - 1; j > 0; j--) {
      var k = randInt(j + 1)
      var t = pool[j]; pool[j] = pool[k]; pool[k] = t
    }
    return pool.slice(0, count).sort(function (a, b) { return a - b })
  }

  function oneTicket() {
    if (typeEl.value === 'ssq') {
      var reds = pickDistinct(6, 33)
      var blue = pickDistinct(1, 16)[0]
      return { balls: reds.concat([blue]), blueIndex: 6, label: '双色球' }
    }
    var front = pickDistinct(5, 35)
    var back = pickDistinct(2, 12)
    return { balls: front.concat(back), blueIndex: 5, label: '大乐透' }
  }

  document.getElementById('ln-run').addEventListener('click', function () {
    var count = parseInt(countEl.value, 10) || 5
    count = Math.max(1, Math.min(20, count))
    countEl.value = count
    var lines = []
    for (var i = 0; i < count; i++) {
      var t = oneTicket()
      var reds = t.balls.slice(0, t.blueIndex).map(function (n) { return String(n).padStart(2, '0') }).join(' ')
      var blues = t.balls.slice(t.blueIndex).map(function (n) { return String(n).padStart(2, '0') }).join(' ')
      lines.push({ reds: reds, blues: blues })
    }
    outEl.innerHTML = lines.map(function (l) {
      return '<div style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
        '<span style="color:var(--err);font-weight:700">' + l.reds + '</span>' +
        '<span style="color:var(--primary);font-weight:700">' + l.blues + '</span></div>'
    }).join('')
    window.bbToast('已生成 ' + count + ' 注')
  })

  document.getElementById('ln-copy').addEventListener('click', function () {
    var text = (outEl.textContent || '').trim()
    if (text) window.bbCopy(text)
  })

  typeEl.addEventListener('change', function () { document.getElementById('ln-run').click() })
  document.getElementById('ln-run').click()
})()
