;(function () {
  'use strict'
  var display = document.getElementById('calc-display')
  var expr = ''
  var lastResult = null

  function show(v) { display.value = v === '' ? '0' : String(v) }
  function render() { display.value = expr === '' ? (lastResult !== null ? lastResult : '0') : expr }

  // 简易四则运算解析器(支持 + - * / % 与括号)
  function evaluate(str) {
    var s = str.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/%/g, '/100')
    if (!/^[0-9+\-*/().\s]+$/.test(s)) throw new Error('bad')
    var tokens = []
    var i = 0
    while (i < s.length) {
      var ch = s[i]
      if (ch === ' ') { i++; continue }
      if ('+-*/()'.indexOf(ch) > -1) { tokens.push(ch); i++; continue }
      var num = ''
      while (i < s.length && /[0-9.]/.test(s[i])) { num += s[i]; i++ }
      if (!num) throw new Error('bad')
      tokens.push(num)
    }
    // 中缀转后缀(调度场算法)
    var out = [], stack = []
    var prec = { '+': 1, '-': 1, '*': 2, '/': 2 }
    var isOp = function (t) { return prec[t] !== undefined }
    for (var j = 0; j < tokens.length; j++) {
      var t = tokens[j]
      if (!isOp(t) && t !== '(' && t !== ')') { out.push(t); continue }
      if (t === '(') { stack.push(t); continue }
      if (t === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') out.push(stack.pop())
        if (!stack.length) throw new Error('bad')
        stack.pop()
        continue
      }
      while (stack.length && isOp(stack[stack.length - 1]) && prec[stack[stack.length - 1]] >= prec[t]) out.push(stack.pop())
      stack.push(t)
    }
    while (stack.length) {
      if (stack[stack.length - 1] === '(') throw new Error('bad')
      out.push(stack.pop())
    }
    // 计算后缀
    var vals = []
    for (var k = 0; k < out.length; k++) {
      var tk = out[k]
      if (isOp(tk)) {
        var b = vals.pop(), a = vals.pop()
        if (a === undefined || b === undefined) throw new Error('bad')
        if (tk === '+') vals.push(a + b)
        else if (tk === '-') vals.push(a - b)
        else if (tk === '*') vals.push(a * b)
        else if (tk === '/') { if (b === 0) throw new Error('div0'); vals.push(a / b) }
      } else vals.push(parseFloat(tk))
    }
    if (vals.length !== 1) throw new Error('bad')
    var r = vals[0]
    return Math.abs(r) < 1e-12 ? 0 : Math.round(r * 1e10) / 1e10
  }

  function press(k) {
    if (k === 'C') { expr = ''; lastResult = null; render(); return }
    if (k === '⌫') { expr = expr.slice(0, -1); render(); return }
    if (k === '=') {
      if (!expr) return
      try {
        var r = evaluate(expr)
        lastResult = r
        expr = ''
        show(r)
      } catch (e) {
        display.value = e.message === 'div0' ? '错误:除数不能为 0' : '错误:表达式不完整'
        expr = ''
        setTimeout(function () { render() }, 1500)
      }
      return
    }
    // 连续按数字时从结果继续
    if (lastResult !== null && /[0-9]/.test(k)) { expr = String(lastResult); lastResult = null }
    else if (lastResult !== null && '+-×÷%'.indexOf(k) > -1) { expr = String(lastResult); lastResult = null }
    expr += k
    render()
  }

  document.getElementById('calc-grid').addEventListener('click', function (e) {
    var btn = e.target.closest('button')
    if (btn && btn.getAttribute('data-k')) press(btn.getAttribute('data-k'))
  })

  document.addEventListener('keydown', function (e) {
    var k = e.key
    if (/[0-9+\-*/().%]/.test(k)) { press(k === '*' ? '×' : k === '/' ? '÷' : k === '-' ? '−' : k); e.preventDefault() }
    else if (k === 'Enter') { press('='); e.preventDefault() }
    else if (k === 'Backspace') { press('⌫'); e.preventDefault() }
    else if (k === 'Escape') { press('C'); e.preventDefault() }
  })
})()
