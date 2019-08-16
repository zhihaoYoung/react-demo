import request from '../utils/request'

const mode = process.env.REACT_APP_ENV ;
let proxyBase 
if (mode === 'production') {
  // proxyBase = 'http://192.168.18.52:8888/service'
  // proxyBase = 'http://192.168.4.64:8888/service'
  proxyBase = 'http://jftool.hongzhao.com/service'
}else if(mode === 'test'){
  proxyBase = 'http://192.168.18.52:8888/service'
}else{
  proxyBase = 'http://192.168.4.64:8888/service'
  // proxyBase = 'http://jftool.hongzhao.com/service'
  // proxyBase = 'http://192.168.18.52:8888/service'
  // proxyBase = 'http://jftool.hongzhao.com/service'
}

// 获取正在维护的银行接口
export function test(_cancelToken) {
  // console.log(_cancelToken)
  return request({
    url: `${proxyBase}/common/test`,
    method: 'get',
    // cancelToken: _cancelToken
  })
}



// 获取正在维护的银行接口
export function getMaintenanceAccountApi(id) {
  return request({
    url: `${proxyBase}/account/${id}/getMaintenanceAccount`,
    method: 'get',
  })
}



// 获取已同步的账户接口
export function getAccountListApi() {
  return request({
    url: `${proxyBase}/account/getAccountList`,
    method: 'get',
  })
}

// 删除银行接口
export function removeAccountApi(id) {
  return request({
    url: `${proxyBase}/account/${id}/removeAccount`,
    method: 'get',
  })
}



// 前端获取同步验证码类型接口
export function getSynchronizationSmsCodeTypeApi(data, _cancelToken) {
  return request({
    url: `${proxyBase}/account/getSynchronizationSmsCodeType`,
    method: 'post',
    cancelToken: _cancelToken,
    data
  })
}

// 获取账单接口
export function getAccountByNumberWithShortWithIdWithOptionIdApi(data) {
  return request({
    url: `${proxyBase}/account/getAccountByNumberWithShortWithIdWithOptionId`,
    method: 'post',
    data
  })
}

// 筛选账单接口
export function screenAccountDetailApi(data) {
  return request({
    url: `${proxyBase}/account/screenAccountDetail`,
    method: 'post',
    data
  })
}

// 退出登录
export function logoutApi(data) {
  return request({
    url: `${proxyBase}/user/logout`,
    method: 'get',
  })
}



// 同步积分输入验证码接口
export function inputSmsCodeApi(data) {
  return request({
    url: `${proxyBase}/account/inputSmsCode`,
    method: 'post',
    data
  })
}



// 注册短信验证码获取
export function sandSMSApi(phone) {
  return request({
    url: `${proxyBase}/common/${phone}/sendSMS`,
    method: 'get',
  })
}

// 忘记密码验证码获取
export function forgetApi(phone) {
  return request({
    url: `${proxyBase}/common/${phone}/forget`,
    method: 'get',
  })
}

// 获取可选账户类型接口
export function getAccountOptionListApi(id) {
  return request({
    url: `${proxyBase}/account/${id}/getAccountOptionList`,
    method: 'get',
  })
}


// 注册
export function registerApi(data) {
  return request({
    url: `${proxyBase}/user/register`,
    method: 'post',
    data
  })
}

// 重置密码
export function updateUserApi(data) {
  return request({
    url: `${proxyBase}/user/updateUser`,
    method: 'post',
    data
  })
}

// 登录
export function loginApi(data) {
  return request({
    url: `${proxyBase}/user/login`,
    method: 'post',
    data
  })
}



// 同步积分接口
export function synchronizationIntegralApi(data,_cancelToken) {
  return request({
    url: `${proxyBase}/account/synchronizationIntegral`,
    method: 'post',
    cancelToken: _cancelToken,
    data
  })
}



// 意见反馈
export function feedbackApi(data) {
  return request({
    url: `${proxyBase}/common/feedback`,
    method: 'post',
    data
  })
}

