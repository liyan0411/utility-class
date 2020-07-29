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
 * @param {Function} fn 要被执行的方法, 相隔多长时间要被执行的方法
 * @param {Number} Intervals   间隔时间, 相隔多长时间调用一次对应方法
 * @params {any} args   剩余参数,剩余参数将会在调用fn时作为参数传给fn
 * @params {any} params   以下方使用例子看，resize事件被触发的时候，会在传个event对象过去，所以同样需要接收
 * @return {Function}
 */
export const throttle = (fn, Intervals, ...args) => {
  let timeNo
  return (...params) => {
    if (timeNo) return
    timeNo = setTimeout(() => {
      fn(...args, ...params)
      clearTimeout(timeNo)
      timeNo = null
    }, Intervals)
  }
}
/**
 * @name 通用版防抖函数
 * @param {Function} fn  要被执行的方法, 相隔多长时间要被执行的方法
 * @param {number} Intervals  间隔时间, 相隔多长时间调用一次对应方法
 * @params {any} args  剩余参数,剩余参数将会在调用fn时作为参数传给fn
 * @params {any} params  以下方使用例子看，input事件被触发的时候，会在传个event对象过去，所以同样需要接收
 * @return {Function}
 */
export const debounce = (fn, Intervals, ...args) => {
  let timeNo
  return (...params) => {
    clearTimeout(timeNo)
    timeNo = setTimeout(() => {
      fn(...args, ...params)
      clearTimeout(timeNo)
    }, Intervals)
  }
}

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
/*获取全部url参数,并转换成json对象*/
export const getUrlAllParams = (url) => {
    var url = url ? url : window.location.href;
    var _pa = url.substring(url.indexOf('?') + 1),
        _arrS = _pa.split('&'),
        _rs = {};
    for (var i = 0, _len = _arrS.length; i < _len; i++) {
        var pos = _arrS[i].indexOf('=');
        if (pos == -1) {
            continue;
        }
        var name = _arrS[i].substring(0, pos),
            value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
        _rs[name] = value;
    }
    return _rs;
}
/*删除url指定参数，返回url*/
export const delParamsUrl=(url, name)=>{
    var baseUrl = url.split('?')[0] + '?';
    var query = url.split('?')[1];
    if (query.indexOf(name)>-1) {
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        return url
    }else{
        return url;
    }
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
 * @param {Number} min 最小值
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
/**
 * @name 深拷贝
 * @param {Object} origin 原对象
 * @param {Object} target 目标对象（默认为{}）
 * @return {Object}
 */
export const deep = (origin, target) => {
  var target = target || {}
  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      if (typeof origin[prop] == 'object' && typeof origin[prop] !== null) {
        if (origin[prop] instanceof Array) {
          target[prop] = []
          deep(origin[prop], target[prop]) //递归调用deep
        }
        if (origin[prop] instanceof Object) {
          target[prop] = {}
          deep(origin[prop], target[prop]) //递归调用deep
        }
      } else if (
        typeof origin[prop] == 'number' ||
        typeof origin[prop] == 'string' ||
        typeof origin[prop] == 'boolean'
      ) {
        target[prop] = origin[prop]
      }
    }
  }
  return target
}
// 是否为 ios
export const isIos = () => {
  var u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    //安卓手机
    // return "Android";
    return false
  } else if (u.indexOf('iPhone') > -1) {
    //苹果手机
    // return "iPhone";
    return true
  } else if (u.indexOf('iPad') > -1) {
    //iPad
    // return "iPad";
    return false
  } else if (u.indexOf('Windows Phone') > -1) {
    //winphone手机
    // return "Windows Phone";
    return false
  } else {
    return false
  }
}

// 是否为PC端
export const isPC = () => {
  var userAgentInfo = navigator.userAgent
  var Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod',
  ]
  var flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}
// 获取浏览器名称
export const browserType = () =>{
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) return "IE7"
        else if(fIEVersion == 8) return "IE8";
        else if(fIEVersion == 9) return "IE9";
        else if(fIEVersion == 10) return "IE10";
        else return "IE7以下"//IE版本过低
    }
    if (isIE11) return 'IE11';
    if (isEdge) return "Edge";
    if (isFF) return "FF";
    if (isOpera) return "Opera";
    if (isSafari) return "Safari";
    if (isChrome) return "Chrome";
}
