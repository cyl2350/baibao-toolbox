/* ============ 百宝工具箱 公共脚本 ============ */
;(function () {
  'use strict'

  // ---------- 主题切换 ----------
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t)
    try { localStorage.setItem('bb-theme', t) } catch (e) { /* ignore */ }
  }
  var saved = null
  try { saved = localStorage.getItem('bb-theme') } catch (e) { /* ignore */ }
  applyTheme(saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  var themeBtn = document.getElementById('theme-toggle')
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme')
      applyTheme(cur === 'dark' ? 'light' : 'dark')
    })
  }

  // ---------- Toast ----------
  var toastEl = document.getElementById('toast')
  var toastTimer = null
  window.bbToast = function (msg) {
    if (!toastEl) return
    toastEl.textContent = msg
    toastEl.classList.add('show')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(function () { toastEl.classList.remove('show') }, 1800)
  }

  // ---------- 复制 ----------
  window.bbCopy = function (text) {
    if (!text) return
    function legacy() {
      var ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy'); window.bbToast('已复制') }
      catch (e) { window.bbToast('复制失败,请手动复制') }
      document.body.removeChild(ta)
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { window.bbToast('已复制') }, legacy)
    } else legacy()
  }

  // ---------- 下载 ----------
  window.bbDownload = function (filename, content, mime) {
    var blob = content instanceof Blob
      ? content
      : new Blob([content], { type: mime || 'text/plain;charset=utf-8' })
    var url = URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url) }, 300)
  }

  // ---------- Cookie 同意横幅(GDPR / CCPA 合规,AdSense 要求) ----------
  function getConsent() {
    try { return localStorage.getItem('bb-consent') } catch (e) { return null }
  }
  function showConsentBanner() {
    if (getConsent() !== null) return
    var banner = document.createElement('div')
    banner.id = 'cookie-banner'
    banner.style.cssText =
      'position:fixed;left:16px;right:16px;bottom:16px;z-index:100;background:var(--card);border:1px solid var(--border);' +
      'border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.15);padding:14px 16px;font-size:13px;display:flex;' +
      'align-items:center;gap:12px;flex-wrap:wrap;max-width:720px;margin:0 auto;'
    banner.innerHTML =
      '<span style="flex:1;min-width:200px">本站使用 Cookie 与第三方广告服务来维持免费运营,点击「同意」表示您了解并接受 <a href="' +
      (window.SITE_CONFIG && window.SITE_CONFIG.domain ? '../privacy/' : 'privacy/') + '" target="_blank">隐私政策</a> 中的说明。</span>' +
      '<button id="cookie-yes" class="btn small">同意</button>' +
      '<button id="cookie-no" class="btn secondary small">拒绝</button>'
    document.body.appendChild(banner)
    document.getElementById('cookie-yes').addEventListener('click', function () {
      try { localStorage.setItem('bb-consent', 'yes') } catch (e) { /* ignore */ }
      banner.remove()
      renderAds()
    })
    document.getElementById('cookie-no').addEventListener('click', function () {
      try { localStorage.setItem('bb-consent', 'no') } catch (e) { /* ignore */ }
      banner.remove()
      renderAds()
    })
  }

  // ---------- 广告位渲染 ----------
  // SITE_CONFIG 由 build 时注入(config/site.mjs 中的 monetization)
  function renderAds() {
    var cfg = window.SITE_CONFIG || {}
    var slots = document.querySelectorAll('.ad-slot')
    if (!slots.length) return
    var adsense = (cfg.monetization || {}).adsenseClient || ''
    var consent = getConsent()
    var consentDenied = consent === 'no'
    var consentUnknown = consent === null
    slots.forEach(function (slot) {
      // 已由构建阶段预渲染 <ins> 或已有占位,跳过
      if (slot.querySelector('ins, .ad-placeholder, .ad-consent-note')) return
      if (adsense) {
        if (consentUnknown) {
          // 未表态前先不加载广告,显示提示
          var note = document.createElement('div')
          note.className = 'ad-placeholder ad-consent-note'
          note.textContent = '广告已按隐私设置延迟加载'
          slot.appendChild(note)
          return
        }
        if (consentDenied) {
          var note2 = document.createElement('div')
          note2.className = 'ad-placeholder ad-consent-note'
          note2.textContent = '您已拒绝 Cookie,广告不显示(本站仍免费)'
          slot.appendChild(note2)
          return
        }
        var ins = document.createElement('ins')
        ins.className = 'adsbygoogle'
        ins.style.display = 'block'
        ins.setAttribute('data-ad-client', adsense)
        ins.setAttribute('data-ad-slot', slot.getAttribute('data-slot') || '0000000000')
        ins.setAttribute('data-ad-format', 'auto')
        ins.setAttribute('data-full-width-responsive', 'true')
        slot.appendChild(ins)
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch (e) { /* ignore */ }
      } else {
        var ph = document.createElement('div')
        ph.className = 'ad-placeholder'
        ph.textContent = '广告位(已预留) · 接入 AdSense / 百度联盟 后自动显示'
        slot.appendChild(ph)
      }
    })
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      renderAds()
      showConsentBanner()
    })
  } else {
    renderAds()
    showConsentBanner()
  }

  // ---------- 页面底部"回到顶部" ----------
  var toTop = document.createElement('button')
  toTop.textContent = '↑'
  toTop.setAttribute('aria-label', '回到顶部')
  toTop.style.cssText =
    'position:fixed;right:18px;bottom:18px;width:40px;height:40px;border-radius:10px;border:1px solid var(--border);' +
    'background:var(--card);color:var(--text);font-size:18px;cursor:pointer;box-shadow:var(--shadow);display:none;z-index:60;'
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }) })
  document.body.appendChild(toTop)
  window.addEventListener('scroll', function () {
    toTop.style.display = window.scrollY > 400 ? 'block' : 'none'
  })
})()
