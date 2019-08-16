const formatDate = (dateStr, formatter = "yyyy-MM-dd") => {
  if (!dateStr || dateStr === "1900-01-01 00:00:00") {
      return "";
  }
  if (typeof dateStr === "string") {
      if (dateStr.indexOf(".") > -1) {
          // 有些日期接口返回带有.0。
          dateStr = dateStr.substring(0, dateStr.indexOf("."));
      }
      // 解决IOS上无法从dateStr parse 到Date类型问题
      dateStr = dateStr.replace(/-/g, '/');
  }
  return new Date(dateStr).Format(formatter);
};


export const PhoneHidden = val => {
  if (Number(val) && String(val).length === 11) {
      let mobile = String(val)
      let reg = /^(\d{3})\d{4}(\d{4})$/
      return mobile.replace(reg, '$1 ****  $2')
  } else {
      return val
  }
}

// 去掉前后空格
export const Valtrim = val => {
  return val.replace(/(^\s*)|(\s*$)/g, '')
}

// html标签转义后提交
export const HtmlEncode = val => {
  return val.replace(/[<>&"/]/g,function(c){return {'<':'&#60;','>':'&#62;','&':'&#38;','"':'&#34;','/':'&#47;'}[c];}); 
}


// 取手机号 后四位
export const TakePhoneFour = val => {
  val = val.toString().substr(val.length - 4)
  return val
}

// 年月日转成 -
export const timeOr = val => {
  let day = val.replace(/[日]/g , '')
  let time_ = day.replace(/[年月]/g , '-')
  return time_
}


// 去掉正负符号
export const addlessdisappear = val => {
  let val_ = val.toString().replace(/[-]/,'')
  return val_
}


//判断时间-是不是今天
export const TimeIsTaday = val => {
  if (new Date(val).getDate() === new Date().getDate()) {
      return '今天' + ' ' + formatDate(val, "hh:mm:ss")
  } else {
      return formatDate(val, "yyyy-MM-dd hh:mm:ss")
  }
}

//银行卡每四位 空格 //前几位都是*
export const TakeBankFour = val => {
  val = '****************' + val.substr(val.length - 4, val.length);
  return val.replace(/(.{4})/g, '$1 ');
}