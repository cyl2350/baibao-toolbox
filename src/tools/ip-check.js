;(function () {
  'use strict'
  var inEl = document.getElementById('ip-in')
  var outEl = document.getElementById('ip-out')

  function isIPv4(s) {
    var parts = s.split('.')
    if (parts.length !== 4) return null
    var nums = []
    for (var i = 0; i < 4; i++) {
      if (!/^\d{1,3}$/.test(parts[i])) return null
      var n = +parts[i]
      if (n > 255) return null
      nums.push(n)
    }
    return nums
  }

  function classifyV4(nums) {
    var a = nums[0], b = nums[1]
    if (a === 0) return '本网络保留地址(0.0.0.0/8)'
    if (a === 10) return '私有地址(10.0.0.0/8,内网)'
    if (a === 127) return '回环地址(127.0.0.0/8,本机)'
    if (a === 169 && b === 254) return '链路本地地址(169.254.0.0/16,APIPA)'
    if (a === 172 && b >= 16 && b <= 31) return '私有地址(172.16.0.0/12,内网)'
    if (a === 192 && b === 168) return '私有地址(192.168.0.0/16,内网,路由器常用)'
    if (a === 192 && b === 0) return '文档示例地址(192.0.0.0/24)'
    if (a >= 224 && a <= 239) return '组播地址(224.0.0.0/4)'
    if (a >= 240) return '保留地址(240.0.0.0/4)'
    if (a === 100 && b >= 64 && b <= 127) return '运营商级 NAT 共享地址(100.64.0.0/10)'
    return '公网地址'
  }

  function isIPv6(s) {
    if (s.includes('.')) return null // IPv4-mapped 形式,简化不处理
    if (s.includes('::')) {
      if ((s.match(/::/g) || []).length > 1) return null
      var left = s.split('::')[0], right = s.split('::')[1] || ''
      var groupsL = left ? left.split(':').length : 0
      var groupsR = right ? right.split(':').length : 0
      if (groupsL + groupsR > 7) return null
    }
    var parts = s.split('::').join(':').split(':')
    if (parts.length > 8) return null
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === '') continue
      if (!/^[0-9a-fA-F]{1,4}$/.test(parts[i])) return null
    }
    return true
  }

  function classifyV6(s) {
    if (s === '::1') return '回环地址(::1/128,本机)'
    if (s.toLowerCase() === '::') return '未指定地址(::/128)'
    if (/^fe80:/i.test(s)) return '链路本地地址(fe80::/10)'
    if (/^fc|^fd/i.test(s)) return '唯一本地地址(fc00::/7,内网)'
    if (/^2001:db8:/i.test(s)) return '文档示例地址(2001:db8::/32)'
    if (/^ff00:/i.test(s)) return '组播地址(ff00::/8)'
    return '公网地址'
  }

  document.getElementById('ip-run').addEventListener('click', function () {
    var s = inEl.value.trim()
    if (!s) { window.bbToast('请输入 IP 地址'); return }
    var v4 = isIPv4(s)
    if (v4) {
      var cls = classifyV4(v4)
      var intVal = v4[0] * 16777216 + v4[1] * 65536 + v4[2] * 256 + v4[3]
      outEl.innerHTML =
        '<b style="color:var(--ok)">✓ 合法的 IPv4 地址</b><br>' +
        '分类:<b>' + cls + '</b><br>' +
        '整数形式:<b>' + intVal + '</b> <button class="btn secondary small" id="ip-copy-int" style="margin-left:6px">复制</button><br>' +
        '<span class="tip">IPv4 十进制整数形式常用于网络编程与数据库存储。</span>'
      document.getElementById('ip-copy-int').addEventListener('click', function () { window.bbCopy(String(intVal)) })
      return
    }
    if (isIPv6(s)) {
      outEl.innerHTML = '<b style="color:var(--ok)">✓ 合法的 IPv6 地址</b><br>分类:<b>' + classifyV6(s) + '</b>'
      return
    }
    outEl.textContent = '✗ 不是合法的 IPv4 或 IPv6 地址,请检查格式'
  })

  document.getElementById('ip-demo').addEventListener('click', function () {
    inEl.value = '192.168.1.1'
    document.getElementById('ip-run').click()
  })

  inEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('ip-run').click() })
})()
