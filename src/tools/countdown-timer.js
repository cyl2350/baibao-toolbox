;(function () {
  'use strict'
  var presetEl = document.getElementById('cd-preset')
  var minEl = document.getElementById('cd-min')
  var displayEl = document.getElementById('cd-display')
  var stateEl = document.getElementById('cd-state')
  var barEl = document.getElementById('cd-bar')

  var total = 25 * 60
  var remain = total
  var timer = null
  var running = false

  function fmt(s) {
    var m = Math.floor(s / 60)
    var sec = s % 60
    return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0')
  }
  function render() {
    displayEl.textContent = fmt(remain)
    barEl.style.width = (total ? (1 - remain / total) * 100 : 0) + '%'
  }
  function setTotal(min) {
    total = Math.max(1, Math.min(120, min)) * 60
    remain = total
    render()
    stateEl.textContent = '未开始 · ' + Math.round(total / 60) + ' 分钟'
  }

  presetEl.addEventListener('change', function () {
    if (presetEl.value === 'custom') {
      setTotal(parseInt(minEl.value, 10) || 25)
    } else {
      setTotal(parseInt(presetEl.value, 10))
      minEl.value = presetEl.value
    }
  })

  document.getElementById('cd-start').addEventListener('click', function () {
    if (running) return
    if (remain <= 0) { remain = total; render() }
    running = true
    stateEl.textContent = '⏳ 计时中……'
    timer = setInterval(function () {
      remain--
      render()
      if (remain <= 0) {
        clearInterval(timer)
        timer = null
        running = false
        stateEl.textContent = '✓ 时间到!休息一下吧'
        // 响铃(Web Audio,无需音频文件)
        try {
          var ctx = new (window.AudioContext || window.webkitAudioContext)()
          var o = ctx.createOscillator()
          var g = ctx.createGain()
          o.connect(g); g.connect(ctx.destination)
          o.frequency.value = 880
          g.gain.setValueAtTime(0.4, ctx.currentTime)
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
          o.start(); o.stop(ctx.currentTime + 0.8)
        } catch (e) { /* 无音频环境忽略 */ }
        window.bbToast('时间到!')
      }
    }, 1000)
  })

  document.getElementById('cd-pause').addEventListener('click', function () {
    if (!running) return
    clearInterval(timer)
    timer = null
    running = false
    stateEl.textContent = '⏸ 已暂停'
  })

  document.getElementById('cd-reset').addEventListener('click', function () {
    clearInterval(timer)
    timer = null
    running = false
    setTotal(parseInt(minEl.value, 10) || 25)
  })

  setTotal(25)
})()
