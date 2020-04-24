/**
 * @name 数据格式化
 */

/**
 * @name 字符串大小写转化处理
 * @param  {String} str
 * @param  {Number} type(可选)
 *       type:  1:首字母大写  2：首页母小写  3：大小写转换  4：全部大写(默认)  5：全部小写
 * @return {String}
 */
export const changeCase = (str, type = 4) => {
  type = type || 4
  switch (type) {
    case 1:
      return str.replace(/\b\w+\b/g, function (word) {
        return (
          word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
        )
      })
    case 2:
      return str.replace(/\b\w+\b/g, function (word) {
        return (
          word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase()
        )
      })
    case 3:
      return str
        .split('')
        .map(function (word) {
          if (/[a-z]/.test(word)) {
            return word.toUpperCase()
          } else {
            return word.toLowerCase()
          }
        })
        .join('')
    case 4:
      return str.toUpperCase()
    case 5:
      return str.toLowerCase()
    default:
      return str
  }
}
/**
 * @name 时间戳转化为年月日
 * @param {String} times 时间戳
 * @param {String} ymd 可选-格式类型(yyyy-mm-dd,yyyy/mm/dd)
 * @param {String} hms 可选-格式类型(hh,hh:mm,hh:mm:ss)
 * @returns {String} 年月日||时分秒
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
 * @name HEX十六进制颜色值转换为RGBA颜色值-如#FFFFFF转RGB(255,255,255)
 * @param {String} val 十六进制颜色值
 * @param {Number} aplha 透明度（默认为1）
 * @return  {String} RGBA颜色值
 */

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
 * @name 将阿拉伯数字翻译成中文的大写数字
 * @param {Number} num
 * @return {String}
 */
export const numberToChinese = (num) => {
  var AA = new Array(
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十'
  )
  var BB = new Array('', '十', '百', '仟', '萬', '億', '点', '')
  var a = ('' + num).replace(/(^0*)/g, '').split('.'),
    k = 0,
    re = ''
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re
        break
      case 4:
        if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$').test(a[0]))
          re = BB[4] + re
        break
      case 8:
        re = BB[5] + re
        BB[7] = BB[5]
        k = 0
        break
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
      re = AA[0] + re
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
    k++
  }

  if (a.length > 1) {
    // 加上小数部分(如果有小数部分)
    re += BB[6]
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]
  }
  if (re == '一十') re = '十'
  if (re.match(/^一/) && re.length == 3) re = re.replace('一', '')
  return re
}
/**
 * @name 将数字转换为大写金额
 * @param {Number} Num
 * @return {String}
 */
export const changeToChinese = (Num) => {
  //判断如果传递进来的不是字符的话转换为字符
  if (typeof Num == 'number') {
    Num = new String(Num)
  }
  Num = Num.replace(/,/g, '') //替换tomoney()中的“,”
  Num = Num.replace(/ /g, '') //替换tomoney()中的空格
  Num = Num.replace(/￥/g, '') //替换掉可能出现的￥字符
  if (isNaN(Num)) {
    //验证输入的字符是否为数字
    //alert("请检查小写金额是否正确");
    return ''
  }
  //字符处理完毕后开始转换，采用前后两部分分别转换
  var part = String(Num).split('.')
  var newchar = ''
  //小数点前进行转化
  for (var i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      return ''
      //若数量超过拾亿单位，提示
    }
    var tmpnewchar = ''
    var perchar = part[0].charAt(i)
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar
        break
      case '1':
        tmpnewchar = '壹' + tmpnewchar
        break
      case '2':
        tmpnewchar = '贰' + tmpnewchar
        break
      case '3':
        tmpnewchar = '叁' + tmpnewchar
        break
      case '4':
        tmpnewchar = '肆' + tmpnewchar
        break
      case '5':
        tmpnewchar = '伍' + tmpnewchar
        break
      case '6':
        tmpnewchar = '陆' + tmpnewchar
        break
      case '7':
        tmpnewchar = '柒' + tmpnewchar
        break
      case '8':
        tmpnewchar = '捌' + tmpnewchar
        break
      case '9':
        tmpnewchar = '玖' + tmpnewchar
        break
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + '元'
        break
      case 1:
        if (perchar != 0) tmpnewchar = tmpnewchar + '拾'
        break
      case 2:
        if (perchar != 0) tmpnewchar = tmpnewchar + '佰'
        break
      case 3:
        if (perchar != 0) tmpnewchar = tmpnewchar + '仟'
        break
      case 4:
        tmpnewchar = tmpnewchar + '万'
        break
      case 5:
        if (perchar != 0) tmpnewchar = tmpnewchar + '拾'
        break
      case 6:
        if (perchar != 0) tmpnewchar = tmpnewchar + '佰'
        break
      case 7:
        if (perchar != 0) tmpnewchar = tmpnewchar + '仟'
        break
      case 8:
        tmpnewchar = tmpnewchar + '亿'
        break
      case 9:
        tmpnewchar = tmpnewchar + '拾'
        break
    }
    var newchar = tmpnewchar + newchar
  }
  //小数点之后进行转化
  if (Num.indexOf('.') != -1) {
    if (part[1].length > 2) {
      // alert("小数点之后只能保留两位,系统将自动截断");
      part[1] = part[1].substr(0, 2)
    }
    for (i = 0; i < part[1].length; i++) {
      tmpnewchar = ''
      perchar = part[1].charAt(i)
      switch (perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar
          break
        case '1':
          tmpnewchar = '壹' + tmpnewchar
          break
        case '2':
          tmpnewchar = '贰' + tmpnewchar
          break
        case '3':
          tmpnewchar = '叁' + tmpnewchar
          break
        case '4':
          tmpnewchar = '肆' + tmpnewchar
          break
        case '5':
          tmpnewchar = '伍' + tmpnewchar
          break
        case '6':
          tmpnewchar = '陆' + tmpnewchar
          break
        case '7':
          tmpnewchar = '柒' + tmpnewchar
          break
        case '8':
          tmpnewchar = '捌' + tmpnewchar
          break
        case '9':
          tmpnewchar = '玖' + tmpnewchar
          break
      }
      if (i == 0) tmpnewchar = tmpnewchar + '角'
      if (i == 1) tmpnewchar = tmpnewchar + '分'
      newchar = newchar + tmpnewchar
    }
  }
  //替换所有无用汉字
  while (newchar.search('零零') != -1) newchar = newchar.replace('零零', '零')
  newchar = newchar.replace('零亿', '亿')
  newchar = newchar.replace('亿万', '亿')
  newchar = newchar.replace('零万', '万')
  newchar = newchar.replace('零元', '元')
  newchar = newchar.replace('零角', '')
  newchar = newchar.replace('零分', '')
  if (newchar.charAt(newchar.length - 1) == '元') {
    newchar = newchar + '整'
  }
  return newchar
}
