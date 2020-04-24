/**
 * @name 常用工具库
 */
/**
 * @name 本地缓存 增删改查
 * @param {String} k 键
 * @param {String||Object} v 值
 */
const ls = localStorage
const ss = sessionStorage
export const db = {
  ls: {
    get(k) {
      try {
        var v = ls.getItem(k)
        return v == null ? null : JSON.parse(v)
      } catch (e) {}
    },
    set(k, v) {
      try {
        ls.setItem(k, JSON.stringify(v))
      } catch (e) {}
    },
    remove(k) {
      ls.removeItem(k)
    },
    clear() {
      ls.clear()
    },
  },
  ss: {
    get(k) {
      try {
        var v = ss.getItem(k)
        return v == null ? null : JSON.parse(v)
      } catch (e) {}
    },
    set(k, v) {
      try {
        ss.setItem(k, JSON.stringify(v))
      } catch (e) {}
    },
    remove(k) {
      ss.removeItem(k)
    },
    clear() {
      ss.clear()
    },
  },
}

/**
 * @name 获取 url 后面通过?传参的参数
 * @param {String} name
 * @return {String}
 */
export const getUrlParams = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
/**
 * @name 通用版节流函数
 * @return {Function}
 */
export const throttle = () => {}
/**
 * @name 通用版防抖函数
 * @return {Function}
 */
export const debounce = () => {}

/**
 * @name 导出文件函数封装
 * @param {Blob} data 后台返回的流
 * @param {String} names 导出的文件名
 * @return {Void}
 */
export const downloadFile = function (data, names) {
  if (!data) {
    return
  }
  if (window.navigator.msSaveOrOpenBlob) {
    // 兼容ie11
    try {
      var blobObject = new Blob([data])
      window.navigator.msSaveOrOpenBlob(blobObject, names + '.xlsx')
    } catch (e) {
      console.log(e)
    }
  } else {
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', names + '.xlsx')
    document.body.appendChild(link)
    link.click()
  }
}

/**
 * @name 返回指定长度的月份集合
 * @param  {String} time 时间
 * @param  {Number} len 长度
 * @param  {Numver} direction 方向(1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3)
 * @return {Array}
 *
 * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
 */
export const getMonths = (time, len, direction) => {
  var mm = new Date(time).getMonth(),
    yy = new Date(time).getFullYear(),
    direction = isNaN(direction) ? 3 : direction,
    index = mm
  var cutMonth = function (index) {
    if (index <= len && index >= -len) {
      return direction === 1
        ? formatPre(index).concat(cutMonth(++index))
        : direction === 2
        ? formatNext(index).concat(cutMonth(++index))
        : formatCurr(index).concat(cutMonth(++index))
    }
    return []
  }
  var formatNext = function (i) {
    var y = Math.floor(i / 12),
      m = i % 12
    return [yy + y + '-' + (m + 1)]
  }
  var formatPre = function (i) {
    var y = Math.ceil(i / 12),
      m = i % 12
    m = m === 0 ? 12 : m
    return [yy - y + '-' + (13 - m)]
  }
  var formatCurr = function (i) {
    var y = Math.floor(i / 12),
      yNext = Math.ceil(i / 12),
      m = i % 12,
      mNext = m === 0 ? 12 : m
    return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)]
  }
  // 数组去重
  var unique = function (arr) {
    if (Array.hasOwnProperty('from')) {
      return Array.from(new Set(arr))
    } else {
      var n = {},
        r = []
      for (var i = 0; i < arr.length; i++) {
        if (!n[arr[i]]) {
          n[arr[i]] = true
          r.push(arr[i])
        }
      }
      return r
    }
  }
  return direction !== 3
    ? cutMonth(index)
    : unique(
        cutMonth(index).sort(function (t1, t2) {
          return new Date(t1).getTime() - new Date(t2).getTime()
        })
      )
}
/**
 * @name 返回指定长度的天数集合
 * @param  {String} time 时间
 * @param  {Number} len 长度
 * @param  {Numver} direction 方向(1: 前几天;  2: 后几天;  3:前后几天  默认 3)
 * @return {Array}
 *
 * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
 */
export const getDays = (time, len, diretion) => {
  var tt = new Date(time)
  var getDay = function (day) {
    var t = new Date(time)
    t.setDate(t.getDate() + day)
    var m = t.getMonth() + 1
    return t.getFullYear() + '-' + m + '-' + t.getDate()
  }
  var arr = []
  if (diretion === 1) {
    for (var i = 1; i <= len; i++) {
      arr.unshift(getDay(-i))
    }
  } else if (diretion === 2) {
    for (var i = 1; i <= len; i++) {
      arr.push(getDay(i))
    }
  } else {
    for (var i = 1; i <= len; i++) {
      arr.unshift(getDay(-i))
    }
    arr.push(tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate())
    for (var i = 1; i <= len; i++) {
      arr.push(getDay(i))
    }
  }
  return diretion === 1
    ? arr.concat([
        tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate(),
      ])
    : diretion === 2
    ? [
        tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate(),
      ].concat(arr)
    : arr
}
/**
 * @name 去除空格
 * @param  {String} str
 * @param  {Numver} type  1-所有空格  2-前后空格  3-前空格 4-后空格
 * @return {String}
 */
export const trim = (str, type = 1) => {
  switch (type) {
    case 1:
      return str.replace(/\s+/g, '')
    case 2:
      return str.replace(/(^\s*)|(\s*$)/g, '')
    case 3:
      return str.replace(/(^\s*)/g, '')
    case 4:
      return str.replace(/(\s*$)/g, '')
    default:
      return str
  }
}

/**
 * @name 获取网址参数
 * @param {String} name 或者字段的key
 * @return {String}
 */
export const getURL = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = decodeURI(window.location.search).substr(1).match(reg)
  if (r != null) return r[2]
  return null
}
/**
 * @name 对象转URL
 * @param {Object} data
 * @return {String}
 */
export const urlEncode = (data) => {
  var _result = []
  for (var key in data) {
    var value = data[key]
    if (value.constructor == Array) {
      value.forEach((_value) => {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}

/**
 * @name 遍历对象
 * @param {Object} obj
 * @param {Function} callback
 * @return {Void}
 */
export const objForEach = (obj, callback) => {
  Object.keys(obj).forEach((key) => {
    callback(obj[key], key)
  })
}
/**
 * @name 判断一个元素是否在数组中
 * @param {Array} arr
 * @param {any} val 要判断的值
 * @return {Boolean}
 */
export const contains = (arr, val) => {
  return arr.indexOf(val) != -1 ? true : false
}
/**
 * @name 求和
 * @param {Array} arr
 * @return {Number}
 */
export const sum = (arr) => {
  return arr.reduce((pre, cur) => {
    return pre + cur
  })
}
/**
 * @name 随机数范围
 * @param {Number} min最小值
 * @param {Number} max 最大值
 * @return {Number}
 */
export const random = (min, max) => {
  if (arguments.length === 2) {
    return Math.floor(min + Math.random() * (max + 1 - min))
  } else {
    return null
  }
}
