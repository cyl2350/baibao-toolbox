;(function () {
  'use strict'
  var displayEl = document.getElementById('sw-display')
  var lapsEl = document.getElementById('sw-laps')
  var lapsCountEl = document.getElementById('sw-laps-count')

  var running = false
  var startTime = 0
  var elapsed = 0 // 已累计毫秒
  var timer = null
  var laps = []

  function fmt(ms) {
    var totalSec = ms / 1000
    var m = Math.floor(totalSec / 60)
    var s = Math.floor(totalSec % 60)
    var t = Math.floor((ms % 1000) / 100)
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + t
  }

  function render() {
    displayEl.textContent = fmt(elapsed + (running ? Date.now() - startTime : 0))
  }

  function tick() {
    render()
    timer = setTimeout(tick, 100)
  }

  document.getElementById('sw-start').addEventListener('click', function () {
    if (running) {
      // 暂停
      elapsed += Date.now() - startTime
      running = false
      clearTimeout(timer)
      timer = null
      document.getElementById('sw-start').textContent = '▶ 继续'
      render()
    } else {
      startTime = Date.now()
      running = true
      document.getElementById('sw-start').textContent = '⏸ 暂停'
      tick()
    }
  })

  document.getElementById('sw-lap').addEventListener('click', function () {
    var cur = elapsed + (running ? Date.now() - startTime : 0)
    laps.push(cur)
    lapsCountEl.textContent = '已计次 ' + laps.length + ' 次'
    lapsEl.textContent = laps.map(function (l, i) {
      var diff = i === 0 ? l : l - laps[i - 1]
      return String(i + 1).padStart(2, '0') + '  ' + fmt(l) + '  (+' + fmt(diff) + ')'
    }).join('\n')
  })

  document.getElementById('sw-reset').addEventListener('click', function () {
    running = false
    clearTimeout(timer)
    timer = null
    elapsed = 0
    laps = []
    document.getElementById('sw-start').textContent = '▶ 开始'
    lapsCountEl.textContent = '已计次 0 次'
    lapsEl.textContent = '计次记录将显示在这里'
    render()
  })

  render()
})()
