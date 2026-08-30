;(function () {
  'use strict'
  var modeEl = document.getElementById('tt-mode')
  var sampleEl = document.getElementById('tt-sample')
  var inputEl = document.getElementById('tt-input')
  var resultEl = document.getElementById('tt-result')

  var TEXTS = {
    cn: '机会总是留给有准备的人,成功往往来自日复一日的坚持。遇到困难时不要轻易放弃,把大目标拆成小步骤,一步一步向前走,你会发现距离梦想其实并不遥远。',
    en: 'The quick brown fox jumps over the lazy dog. Practice makes perfect, and every expert was once a beginner. Keep going and never give up on your goals.',
  }

  var startTime = null
  var finished = false

  function loadSample() {
    sampleEl.textContent = TEXTS[modeEl.value]
    inputEl.value = ''
    startTime = null
    finished = false
    resultEl.textContent = '打字结束后显示成绩'
  }

  inputEl.addEventListener('input', function () {
    if (finished) return
    if (!startTime && inputEl.value.length > 0) startTime = Date.now()
    var target = TEXTS[modeEl.value]
    // 实时正确性提示
    var typed = inputEl.value
    if (typed.length <= target.length) {
      var ok = true
      for (var i = 0; i < typed.length; i++) {
        if (typed[i] !== target[i]) { ok = false; break }
      }
      inputEl.style.borderColor = ok ? '' : 'var(--err)'
    }
    // 完成判定:中文按字符,英文按目标长度(忽略末尾差异放宽)
    if (typed.length >= target.length) {
      finish()
    }
  })

  function finish() {
    finished = true
    var elapsed = (Date.now() - startTime) / 1000
    var target = TEXTS[modeEl.value]
    var typed = inputEl.value
    var correct = 0
    var min = Math.min(typed.length, target.length)
    for (var i = 0; i < min; i++) if (typed[i] === target[i]) correct++
    var accuracy = Math.round(correct / target.length * 100)
    var minutes = Math.max(elapsed / 60, 0.01)
    if (modeEl.value === 'cn') {
      var cpm = Math.round(correct / minutes)
      resultEl.innerHTML = '用时:<b>' + elapsed.toFixed(1) + '</b> 秒　速度:<b>' + cpm + '</b> 字/分钟　正确率:<b>' + accuracy + '%</b><br>' +
        '<span class="tip">提示:中文打字 60 字/分钟以上算熟练,100+ 算高手。</span>'
    } else {
      var words = correct / 5
      var wpm = Math.round(words / minutes)
      resultEl.innerHTML = '用时:<b>' + elapsed.toFixed(1) + '</b> 秒　速度:<b>' + wpm + '</b> WPM　正确率:<b>' + accuracy + '%</b><br>' +
        '<span class="tip">提示:40 WPM 为入门,60+ 为良好,80+ 为优秀。</span>'
    }
  }

  modeEl.addEventListener('change', loadSample)
  document.getElementById('tt-restart').addEventListener('click', loadSample)
  loadSample()
})()
