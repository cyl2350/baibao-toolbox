;(function () {
  'use strict'
  var modeEl = document.getElementById('jc-mode')
  var inEl = document.getElementById('jc-in')
  var outEl = document.getElementById('jc-out')

  function csvEscape(v) {
    var s = v === null || v === undefined ? '' : String(v)
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }

  function flatten(obj, prefix, out) {
    for (var k in obj) {
      var key = prefix ? prefix + '.' + k : k
      var v = obj[k]
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out)
      else if (Array.isArray(v)) out[key] = JSON.stringify(v)
      else out[key] = v
    }
    return out
  }

  function jsonToCsv(arr) {
    if (!Array.isArray(arr) || !arr.length) throw new Error('JSON 必须是对象数组')
    var rows = arr.map(function (item) { return flatten(item, '', {}) })
    var headers = []
    rows.forEach(function (r) {
      Object.keys(r).forEach(function (k) { if (headers.indexOf(k) === -1) headers.push(k) })
    })
    var lines = [headers.map(csvEscape).join(',')]
    rows.forEach(function (r) {
      lines.push(headers.map(function (h) { return csvEscape(r[h]) }).join(','))
    })
    return lines.join('\n')
  }

  function csvToJson(csv) {
    var lines = csv.replace(/\r/g, '').split('\n').filter(function (l) { return l.trim() !== '' })
    if (!lines.length) throw new Error('CSV 内容为空')
    var headers = parseLine(lines[0])
    var out = []
    for (var i = 1; i < lines.length; i++) {
      var vals = parseLine(lines[i])
      var obj = {}
      headers.forEach(function (h, idx) { obj[h] = vals[idx] !== undefined ? vals[idx] : '' })
      out.push(obj)
    }
    return JSON.stringify(out, null, 2)
  }

  function parseLine(line) {
    var fields = []
    var cur = ''
    var inQuotes = false
    for (var i = 0; i < line.length; i++) {
      var ch = line[i]
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') { cur += '"'; i++ }
          else inQuotes = false
        } else cur += ch
      } else {
        if (ch === '"') inQuotes = true
        else if (ch === ',') { fields.push(cur); cur = '' }
        else cur += ch
      }
    }
    fields.push(cur)
    return fields
  }

  document.getElementById('jc-run').addEventListener('click', function () {
    var raw = inEl.value.trim()
    if (!raw) { window.bbToast('请输入内容'); return }
    try {
      if (modeEl.value === 'j2c') {
        var arr = JSON.parse(raw)
        outEl.value = jsonToCsv(arr)
      } else {
        outEl.value = csvToJson(raw)
      }
      window.bbToast('转换完成')
    } catch (e) {
      outEl.value = ''
      window.bbToast('转换失败:' + e.message)
    }
  })

  document.getElementById('jc-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })

  document.getElementById('jc-download').addEventListener('click', function () {
    if (!outEl.value) return
    var isCsv = modeEl.value === 'j2c'
    window.bbDownload(isCsv ? 'output.csv' : 'output.json', outEl.value, isCsv ? 'text/csv' : 'application/json')
  })
})()
