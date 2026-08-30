;(function () {
  'use strict'
  var inEl = document.getElementById('md-in')
  var outEl = document.getElementById('md-out')

  // 简易 HTML 净化:移除 script/style/iframe 与事件属性、危险协议
  function sanitize(html) {
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '')
    html = html.replace(/<style[\s\S]*?<\/style>/gi, '')
    html = html.replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    html = html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    html = html.replace(/(href|src)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, '$1="#"')
    return html
  }

  function render() {
    try {
      var html = marked.parse(inEl.value)
      outEl.innerHTML = sanitize(html)
    } catch (e) {
      outEl.textContent = '解析出错:' + e.message
    }
  }

  var t = null
  inEl.addEventListener('input', function () {
    clearTimeout(t)
    t = setTimeout(render, 200)
  })
  render()

  document.getElementById('md-copy-html').addEventListener('click', function () {
    window.bbCopy(outEl.innerHTML)
  })
  document.getElementById('md-clear').addEventListener('click', function () { inEl.value = ''; render() })
  document.getElementById('md-download').addEventListener('click', function () {
    window.bbDownload('markdown.md', inEl.value, 'text/markdown')
  })
})()
