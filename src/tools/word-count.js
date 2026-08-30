;(function () {
  'use strict'
  var inEl = document.getElementById('wc-in')
  var outEl = document.getElementById('wc-out')

  function count(text) {
    var chars = text.length
    var charsNoSpace = text.replace(/\s/g, '').length
    var chinese = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length
    var words = (text.match(/[A-Za-z0-9_]+(?:['-][A-Za-z0-9_]+)*/g) || []).length
    var digits = (text.match(/[0-9]/g) || []).length
    var lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length
    var paras = text.split(/\n\s*\n/).filter(function (p) { return p.trim() }).length
    return { chars: chars, charsNoSpace: charsNoSpace, chinese: chinese, words: words, digits: digits, lines: lines, paras: paras }
  }

  function render() {
    var c = count(inEl.value)
    outEl.innerHTML =
      '字符数(含空格):<b>' + c.chars + '</b>　字符数(不含空格):<b>' + c.charsNoSpace + '</b>　中文字数:<b>' + c.chinese +
      '</b><br>英文单词数:<b>' + c.words + '</b>　数字个数:<b>' + c.digits + '</b>　行数:<b>' + c.lines + '</b>　段落数:<b>' + c.paras + '</b>'
  }

  inEl.addEventListener('input', render)
  render()
})()
