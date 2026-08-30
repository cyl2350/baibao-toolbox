;(function () {
  'use strict'
  var inEl = document.getElementById('tts-in')
  var voiceEl = document.getElementById('tts-voice')
  var rateEl = document.getElementById('tts-rate')
  var rateLabel = document.getElementById('tts-rate-label')
  var pitchEl = document.getElementById('tts-pitch')
  var pitchLabel = document.getElementById('tts-pitch-label')
  var statusEl = document.getElementById('tts-status')

  var voices = []

  function loadVoices() {
    voices = (window.speechSynthesis || {}).getVoices ? window.speechSynthesis.getVoices() : []
    var zh = voices.filter(function (v) { return /zh|cmn|Chinese/i.test(v.lang) })
    var list = zh.length ? zh : voices
    voiceEl.innerHTML = list.map(function (v, i) {
      return '<option value="' + i + '">' + v.name + ' (' + v.lang + ')</option>'
    }).join('')
  }

  rateEl.addEventListener('input', function () { rateLabel.textContent = parseFloat(rateEl.value).toFixed(1) })
  pitchEl.addEventListener('input', function () { pitchLabel.textContent = parseFloat(pitchEl.value).toFixed(1) })

  if (!('speechSynthesis' in window)) {
    statusEl.textContent = '您的浏览器不支持语音合成,请使用 Chrome 或 Edge。'
  } else {
    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    // 部分浏览器需要延迟加载音色列表
    setTimeout(loadVoices, 300)
  }

  document.getElementById('tts-speak').addEventListener('click', function () {
    if (!('speechSynthesis' in window)) return
    var text = inEl.value.trim()
    if (!text) { window.bbToast('请输入文字'); return }
    window.speechSynthesis.cancel()
    var u = new SpeechSynthesisUtterance(text)
    if (voices[+voiceEl.value]) u.voice = voices[+voiceEl.value]
    u.rate = parseFloat(rateEl.value)
    u.pitch = parseFloat(pitchEl.value)
    u.lang = (voices[+voiceEl.value] || {}).lang || 'zh-CN'
    u.onstart = function () { statusEl.textContent = '🔊 正在朗读……' }
    u.onend = function () { statusEl.textContent = '✓ 朗读完成' }
    u.onerror = function () { statusEl.textContent = '朗读中断(可能被浏览器打断)' }
    window.speechSynthesis.speak(u)
  })

  document.getElementById('tts-stop').addEventListener('click', function () {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    statusEl.textContent = '已停止'
  })
})()
