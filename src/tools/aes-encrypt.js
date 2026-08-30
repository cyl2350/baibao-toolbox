;(function () {
  'use strict'
  var inEl = document.getElementById('aes-in')
  var passEl = document.getElementById('aes-pass')
  var outEl = document.getElementById('aes-out')

  // PBKDF2 派生密钥
  function deriveKey(password, salt) {
    var enc = new TextEncoder().encode(password)
    return crypto.subtle.importKey('raw', enc, 'PBKDF2', false, ['deriveKey']).then(function (key) {
      return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
        key,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      )
    })
  }

  function toB64(buf) {
    var bytes = new Uint8Array(buf)
    var bin = ''
    var CHUNK = 0x8000
    for (var i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK))
    return btoa(bin)
  }

  function fromB64(str) {
    var bin = atob(str)
    var bytes = new Uint8Array(bin.length)
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes
  }

  document.getElementById('aes-enc').addEventListener('click', function () {
    var text = inEl.value
    var pass = passEl.value
    if (!text) { window.bbToast('请输入文本'); return }
    if (pass.length < 6) { window.bbToast('密码至少 6 位'); return }
    var salt = crypto.getRandomValues(new Uint8Array(16))
    var iv = crypto.getRandomValues(new Uint8Array(12))
    var plain = new TextEncoder().encode(text)
    deriveKey(pass, salt).then(function (key) {
      return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, plain)
    }).then(function (cipher) {
      // 格式: salt(iv) base64
      var combined = new Uint8Array(1 + salt.length + iv.length + cipher.byteLength)
      combined[0] = 1
      combined.set(salt, 1)
      combined.set(iv, 1 + salt.length)
      combined.set(new Uint8Array(cipher), 1 + salt.length + iv.length)
      outEl.value = toB64(combined)
      window.bbToast('加密完成')
    }).catch(function (e) { window.bbToast('加密失败:' + e.message) })
  })

  document.getElementById('aes-dec').addEventListener('click', function () {
    var data = inEl.value.trim()
    var pass = passEl.value
    if (!data) { window.bbToast('请输入密文'); return }
    var raw
    try { raw = fromB64(data) } catch (e) { window.bbToast('密文格式不正确'); return }
    if (raw[0] !== 1 || raw.length < 30) { window.bbToast('无法识别的密文格式'); return }
    var salt = raw.slice(1, 17)
    var iv = raw.slice(17, 29)
    var cipher = raw.slice(29)
    deriveKey(pass, salt).then(function (key) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, cipher)
    }).then(function (plain) {
      outEl.value = new TextDecoder().decode(plain)
      window.bbToast('解密完成')
    }).catch(function () {
      window.bbToast('解密失败:密码错误或密文被修改')
    })
  })

  document.getElementById('aes-copy').addEventListener('click', function () {
    if (outEl.value) window.bbCopy(outEl.value)
  })
})()
