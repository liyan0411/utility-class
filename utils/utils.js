/**
 * @name:常用工具库
 */
// 本地缓存 增删改查
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
      ls.setItem(key, JSON.stringify(value))

      try {
        ls.setItem(k, JSON.stringify(v))
      } catch (e) {}
    },
    remove(key) {
      ls.removeItem(key)
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
      ss.setItem(key, JSON.stringify(value))

      try {
        ss.setItem(k, JSON.stringify(v))
      } catch (e) {}
    },
    remove(key) {
      ss.removeItem(key)
    },
    clear() {
      ss.clear()
    },
  },
}

export const checkStr = (str, type) => {
  switch (type) {
    case 'phone': //手机号码
      return /^1[3|4|5|6|7|8][0-9]{9}$/.test(str)
    case 'tel': //座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str)
    case 'card': //身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
    case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
      return /^[a-zA-Z]\w{5,17}$/.test(str)
    case 'postal': //邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str)
    case 'QQ': //QQ号
      return /^[1-9][0-9]{4,9}$/.test(str)
    case 'email': //邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str)
    case 'money': //金额(小数点2位)
      return /^\d*(?:\.\d{0,2})?$/.test(str)
    case 'URL': //网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
        str
      )
    case 'IP': //IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(
        str
      )
    case 'date': //日期时间
      return (
        /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(
          str
        ) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
      )
    case 'number': //数字
      return /^[0-9]$/.test(str)
    case 'english': //英文
      return /^[a-zA-Z]+$/.test(str)
    case 'chinese': //中文
      return /^[\u4E00-\u9FA5]+$/.test(str)
    case 'lower': //小写
      return /^[a-z]+$/.test(str)
    case 'upper': //大写
      return /^[A-Z]+$/.test(str)
    case 'HTML': //HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str)
    default:
      return true
  }
}

// 严格的身份证校验
export const isCardID = (sId) => {
  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
    alert('你输入的身份证长度或格式错误')
    return false
  }
  //身份证城市
  var aCity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
  }
  if (!aCity[parseInt(sId.substr(0, 2))]) {
    alert('你的身份证地区非法')
    return false
  }

  // 出生日期验证
  var sBirthday = (
      sId.substr(6, 4) +
      '-' +
      Number(sId.substr(10, 2)) +
      '-' +
      Number(sId.substr(12, 2))
    ).replace(/-/g, '/'),
    d = new Date(sBirthday)
  if (
    sBirthday !=
    d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  ) {
    alert('身份证上的出生日期非法')
    return false
  }

  // 身份证号码校验
  var sum = 0,
    weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    codes = '10X98765432'
  for (var i = 0; i < sId.length - 1; i++) {
    sum += sId[i] * weights[i]
  }
  var last = codes[sum % 11] //计算出来的最后一位身份证号码
  if (sId[sId.length - 1] != last) {
    alert('你输入的身份证号非法')
    return false
  }

  return true
}

//HEX十六进制颜色值转换为RGB(A)颜色值-如#FFFFFF转RGB(255,255,255)
export const hexToRgba = function (val, aplha = 1) {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 把颜色值变成小写
  var color = val.toLowerCase()
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = '#'
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
      }
      color = colorNew
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = []
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
    }
    return 'rgba(' + colorChange.join(',') + ',' + aplha + ')'
  } else {
    return color
  }
}

/**
 * @param {String} param 根据传入值判断是否为空（无效）
 * @return {String} 判断值状态 空（无效）返回true
 */
export const isEmpty = (text) => {
  if (typeof text === 'object') {
    // 判断是否为空对象
    for (const x in text) {
      return false
    }

    return true
  }
  if (
    text == null ||
    text == undefined ||
    text == 'undefined' ||
    text == '' ||
    text == 'null'
  ) {
    return true
  }

  return false
}
/**
 *  获取 url 后面通过?传参的参数
 * @param {String} name
 */
export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const url = window.location.href
  const search = url.substring(url.lastIndexOf('?') + 1)
  const r = search.match(reg)
  if (r != null) return unescape(r[2])
  return null
}
/**
 * 防抖函数
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
export const debounce = (method, delay) => {
  let timer = null
  return function () {
    let self = this,
      args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function () {
      method.apply(self, args)
    }, delay)
  }
}
// window.onscroll = debounce(function () {
//   let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
//   console.log("滚动条位置：" + scrollTop);
// }, 200);
/**
 * 节流函数
 * @param method 事件触发的操作
 * @param mustRunDelay 间隔多少毫秒需要触发一次事件
 */
export const throttle = (method, mustRunDelay) => {
  let timer,
    args = arguments,
    start
  return function loop() {
    let self = this
    let now = Date.now()
    if (!start) {
      start = now
    }
    if (timer) {
      clearTimeout(timer)
    }
    if (now - start >= mustRunDelay) {
      method.apply(self, args)
      start = now
    } else {
      timer = setTimeout(function () {
        loop.apply(self, args)
      }, 50)
    }
  }
}
// window.onscroll = throttle(function () {
//   let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
//   console.log("滚动条位置：" + scrollTop);
// }, 800);

// 导出文件函数封装
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
 * 将字母全部转化成小写
 * @param {String} str 字符
 */
export const strToLowercase = (str) => {
  return str.toLowerCase()
}
/**
 * 将字母全部转化成大写
 * @param {String} str 字符
 */
export const strToCapital = (str) => {
  return str.toUpperCase()
}
/**
 * 时间戳转化为年月日
 * @param times 时间戳
 * @param ymd 格式类型(yyyy-mm-dd,yyyy/mm/dd)
 * @param hms 可选,格式类型(hh,hh:mm,hh:mm:ss)
 * @returns {年月日}
 */
export const timesToYyMmDd = (times, ymd = 'yyyy-mm-dd', hms = 'hh:mm:ss') => {
  const oDate = new Date(times)
  const oYear = oDate.getFullYear()
  const oMonth = oDate.getMonth() + 1
  const oDay = oDate.getDate()
  const oHour = oDate.getHours()
  const oMin = oDate.getMinutes()
  const oSec = oDate.getSeconds()
  let oTime // 最后拼接时间
  // 年月日格式
  switch (ymd) {
    case 'yyyy-mm-dd':
      oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay)
      break
    case 'yyyy/mm/dd':
      oTime = oYear + '/' + getzf(oMonth) + '/' + getzf(oDay)
      break
  }
  // 时分秒格式
  switch (hms) {
    case 'hh':
      oTime = ' ' + oTime + getzf(oHour)
      break
    case 'hh:mm':
      oTime = oTime + getzf(oHour) + ':' + getzf(oMin)
      break
    case 'hh:mm:ss':
      oTime = oTime + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSec)
      break
  }
  return oTime
}
/**
 * 返回指定长度的月份集合
 * 
 * @param  {time} 时间
 * @param  {len} 长度
 * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
 * @return {Array} 数组
 * 
 * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
 */
export const getMonths=(time, len, direction) =>{
    var mm = new Date(time).getMonth(),
        yy = new Date(time).getFullYear(),
        direction = isNaN(direction) ? 3 : direction,
        index = mm;
    var cutMonth = function(index) {
        if ( index <= len && index >= -len) {
            return direction === 1 ? formatPre(index).concat(cutMonth(++index)):
                direction === 2 ? formatNext(index).concat(cutMonth(++index)):formatCurr(index).concat(cutMonth(++index))
        }
        return []
    }
    var formatNext = function(i) {
        var y = Math.floor(i/12),
            m = i%12
        return [yy+y + '-' + (m+1)]
    }
    var formatPre = function(i) {
        var y = Math.ceil(i/12),
            m = i%12
        m = m===0 ? 12 : m
        return [yy-y + '-' + (13 - m)]
    }
    var formatCurr = function(i) {
        var y = Math.floor(i/12),
            yNext = Math.ceil(i/12),
            m = i%12,
            mNext = m===0 ? 12 : m
        return [yy-yNext + '-' + (13 - mNext),yy+y + '-' + (m+1)]
    }
    // 数组去重
    var unique = function(arr) {
        if ( Array.hasOwnProperty('from') ) {
            return Array.from(new Set(arr));
        }else{
            var n = {},r=[]; 
            for(var i = 0; i < arr.length; i++){
                if (!n[arr[i]]){
                    n[arr[i]] = true; 
                    r.push(arr[i]);
                }
            }
            return r;
        }
    }
    return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort(function(t1, t2){
        return new Date(t1).getTime() - new Date(t2).getTime()
    }))
}
/**
 * 返回指定长度的天数集合
 * 
 * @param  {time} 时间
 * @param  {len} 长度
 * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
 * @return {Array} 数组
 *
 * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
 */
export const getDays=(time, len, diretion)=> {
    var tt = new Date(time)
    var getDay = function(day) {
        var t = new Date(time)
        t.setDate(t.getDate() + day)
        var m = t.getMonth()+1
        return t.getFullYear()+'-'+m+'-'+t.getDate()
    }
    var arr = []
    if (diretion === 1) {
        for (var i = 1; i <= len; i++) {
            arr.unshift(getDay(-i))
        }
    }else if(diretion === 2) {
        for (var i = 1; i <= len; i++) {
            arr.push(getDay(i))
        }
    }else {
        for (var i = 1; i <= len; i++) {
            arr.unshift(getDay(-i))
        }
        arr.push(tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate())
        for (var i = 1; i <= len; i++) {
            arr.push(getDay(i))
        }
    }
    return diretion === 1 ? arr.concat([tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate()]) : 
        diretion === 2 ? [tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate()].concat(arr) : arr
}
/**
 * 去除空格
 * @param  {str}
 * @param  {type} 
 *       type:  1-所有空格  2-前后空格  3-前空格 4-后空格
 * @return {String}
 */
export const trim = (str, type) =>{
    type = type || 1
    switch (type) {
        case 1:
            return str.replace(/\s+/g, "");
        case 2:
            return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
            return str.replace(/(^\s*)/g, "");
        case 4:
            return str.replace(/(\s*$)/g, "");
        default:
            return str;
    }
}

/*获取网址参数*/
export const getURL=(name)=>{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if(r!=null) return  r[2]; return null;
}
