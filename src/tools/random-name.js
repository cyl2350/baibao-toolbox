;(function () {
  'use strict'
  var surnameEl = document.getElementById('rn-surname')
  var genderEl = document.getElementById('rn-gender')
  var styleEl = document.getElementById('rn-style')
  var countEl = document.getElementById('rn-count')
  var outEl = document.getElementById('rn-out')

  var SURNAMES = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹'.split('')

  var MALE = '浩然宇轩铭泽睿辰子墨一鸣俊杰鹏飞泽洋凯文建强志远天翔博文思远嘉懿煜城懿轩哲瀚靖琪明轩'.split('')
  var FEMALE = '欣怡诗涵梦琪雅静思彤雨桐语嫣婉婷梓萱雪晴悦心芷若若曦晓月琳琳佳怡慧敏静香'.split('')
  var NEUTRAL = '安之亦然乐山清和沐阳澄怀明理知秋云舒星河晚舟晨露'.split('')

  // 填充姓氏下拉
  surnameEl.innerHTML = '<option value="">(随机百家姓)</option>' + SURNAMES.map(function (s) {
    return '<option value="' + s + '">' + s + '</option>'
  }).join('')

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

  document.getElementById('rn-run').addEventListener('click', function () {
    var surname = surnameEl.value || pick(SURNAMES)
    var gender = genderEl.value
    var style = styleEl.value
    var count = parseInt(countEl.value, 10) || 10
    count = Math.max(1, Math.min(30, count))
    countEl.value = count

    var pool
    if (gender === 'm') pool = MALE.concat(NEUTRAL)
    else if (gender === 'f') pool = FEMALE.concat(NEUTRAL)
    else pool = MALE.concat(FEMALE, NEUTRAL)

    var names = []
    for (var i = 0; i < count; i++) {
      var given
      if (style === 'single') given = pick(pool)
      else if (style === 'double') given = pick(pool) + pick(pool)
      else given = Math.random() < 0.5 ? pick(pool) : pick(pool) + pick(pool)
      names.push(surname + given)
    }
    outEl.innerHTML = names.map(function (n, i) {
      return '<b style="color:var(--primary)">' + n + '</b>' + (i < names.length - 1 ? '　' : '')
    }).join('')
    window.bbToast('已生成 ' + count + ' 个名字')
  })
})()
