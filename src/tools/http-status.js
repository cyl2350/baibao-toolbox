;(function () {
  'use strict'
  var searchEl = document.getElementById('hs-search')
  var listEl = document.getElementById('hs-list')

  var CODES = [
    [100, 'Continue', '继续', '客户端应继续发送请求体,多用于文件上传前探路'],
    [101, 'Switching Protocols', '切换协议', '服务器同意切换到客户端请求的协议(如 WebSocket)'],
    [200, 'OK', '请求成功', '标准成功响应,GET 返回资源、POST 返回创建结果等'],
    [201, 'Created', '已创建', '资源创建成功,常见于 POST 新建对象'],
    [202, 'Accepted', '已接受', '请求已受理但处理未完成,常用于异步任务'],
    [204, 'No Content', '无内容', '成功但没有响应体,常用于删除操作'],
    [206, 'Partial Content', '部分内容', '范围请求成功,断点续传/视频拖动场景'],
    [301, 'Moved Permanently', '永久重定向', '资源已永久迁移,浏览器/搜索引擎会更新链接'],
    [302, 'Found', '临时重定向', '临时跳转,常见于未登录跳登录页'],
    [303, 'See Other', '查看其他', 'POST 后重定向到 GET 结果页(防表单重复提交)'],
    [304, 'Not Modified', '未修改', '协商缓存命中,浏览器用本地缓存'],
    [307, 'Temporary Redirect', '临时重定向', '与 302 类似但保留请求方法与请求体'],
    [308, 'Permanent Redirect', '永久重定向', '与 301 类似但保留请求方法'],
    [400, 'Bad Request', '请求错误', '请求语法错误或参数不合法'],
    [401, 'Unauthorized', '未认证', '需要登录/认证(未携带有效凭证)'],
    [403, 'Forbidden', '禁止访问', '已认证但无权限,或服务器拒绝'],
    [404, 'Not Found', '未找到', '资源不存在,或路径写错'],
    [405, 'Method Not Allowed', '方法不允许', '接口不支持该请求方法(如 GET 用了 DELETE)'],
    [408, 'Request Timeout', '请求超时', '服务器等待客户端请求超时'],
    [409, 'Conflict', '冲突', '请求与当前资源状态冲突(如重名创建)'],
    [410, 'Gone', '资源已删除', '资源曾存在但已永久删除,不再提供'],
    [413, 'Payload Too Large', '请求体过大', '上传文件超过服务器限制(常见于图片/文件上传)'],
    [415, 'Unsupported Media Type', '不支持的类型', 'Content-Type 不被服务器支持'],
    [422, 'Unprocessable Entity', '无法处理', '请求格式正确但语义错误(如字段校验失败)'],
    [429, 'Too Many Requests', '请求过多', '触发限流,稍后再试'],
    [500, 'Internal Server Error', '服务器内部错误', '服务器异常,后端代码报错'],
    [501, 'Not Implemented', '未实现', '服务器不支持该功能'],
    [502, 'Bad Gateway', '网关错误', '上游服务无响应或响应无效(常见于 Nginx 后服务挂了)'],
    [503, 'Service Unavailable', '服务不可用', '服务器过载或维护中,临时不可用'],
    [504, 'Gateway Timeout', '网关超时', '上游服务响应超时'],
    [505, 'HTTP Version Not Supported', '版本不支持', '服务器不支持请求的 HTTP 版本'],
  ]

  function render(filter) {
    var kw = (filter || '').trim().toLowerCase()
    var items = CODES.filter(function (c) {
      if (!kw) return true
      return String(c[0]).indexOf(kw) > -1 || c[1].toLowerCase().indexOf(kw) > -1 || c[2].indexOf(kw) > -1 || c[3].indexOf(kw) > -1
    })
    if (!items.length) { listEl.textContent = '没有匹配的状态码'; return }
    listEl.innerHTML = items.map(function (c) {
      var cls = c[0] < 200 ? 'var(--muted)' : c[0] < 300 ? 'var(--ok)' : c[0] < 400 ? '#d97706' : c[0] < 500 ? 'var(--err)' : 'var(--primary)'
      return '<div style="padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<b style="color:' + cls + '">' + c[0] + '</b> ' + c[1] + ' · <b>' + c[2] + '</b><br>' +
        '<span style="font-size:13px;color:var(--muted)">' + c[3] + '</span></div>'
    }).join('')
  }

  searchEl.addEventListener('input', function () { render(searchEl.value) })
  render('')
})()
