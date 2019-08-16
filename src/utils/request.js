import axios from 'axios'
import { Toast } from 'antd-mobile';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();
// CancelToken.source()
window.requestCancel = source // 保存到全局变量，用于路由切换时调用
window.axios_ = axios

// console.log(source.token)
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 240000, // request timeout
  // cancelToken: window.ss
})

// service.interceptors.request.use(config => {
//   config.cancelToken = source.token
//   return config
// }, err => {
//   return Promise.reject(err)
// })


// request interceptor
service.interceptors.request.use(
  config => {
    // CancelToken.source()
    // config.cancelToken = source
    // config.cancelToken = source.token
    return config;
    // do something before request is sent
    // if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
    // }
    // return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)


// service.interceptors.response.use(function (response) {
//   // Do something with response data
//   return response;
// }, err => {
//   if (err && err.response) {
//       switch (err.response.status) {
//           case 400:
//               err.message = '请求错误(400)';
//               break;
//           case 401:
//               err.message = '未授权，请重新登录(401)';
//               // message.error(err.response.headers.msg ? decodeURI(err.response.headers.msg) : "未登录，请重新登录");
//               break;
//           case 403:
//               err.message = '拒绝访问(403)';
//               break;
//           case 404:
//               err.message = '请求出错(404)';
//               break;
//           case 408:
//               err.message = '请求超时(408)';
//               break;
//           case 500:
//               err.message = '服务器错误(500)';
//               break;
//           case 501:
//               err.message = '服务未实现(501)';
//               break;
//           case 502:
//               err.message = '网络错误(502)';
//               break;
//           case 503:
//               err.message = '服务不可用(503)';
//               break;
//           case 504:
//               err.message = '网络超时(504)';
//               break;
//           case 505:
//               err.message = 'HTTP版本不受支持(505)';
//               break;
//           default:
//               err.message = `连接出错(${err.response.data})!`;
//       }
//   } else {
//       err.message = '连接服务器失败!'
//   }
//   return Promise.reject(err);
// });


// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      if (res.code === 1) {
        Toast.fail(res.msg, 1.5);
        window.location.href ="/"
        localStorage.removeItem("token")
      }
      return res
      // return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
          case 400:
            err.message = '错误请求';
            break
  
          case 401:
            err.message = '登录超时，请重新登录'
            break
  
          case 403:
            err.message = '拒绝访问'
            break
  
          case 404:
            err.message = `请求地址出错: `
            break
  
          case 408:
            err.message = '请求超时'
            break
  
          case 500:
            err.message = '服务器内部错误'
            break
  
          case 501:
            err.message = '服务未实现'
            break
  
          case 502:
            err.message = '网关错误'
            break
  
          case 503:
            err.message = '服务不可用'
            break
  
          case 504:
            err.message = '网关超时'
            break
  
          case 505:
            err.message = 'HTTP版本不受支持'
            break
  
          default:
        }
      Toast.fail(err.message, 1)
    } else {
      err.message = "网络繁忙，请重新刷新页面"
    }
    return Promise.reject(err);
    // Toast.fail(err.message, 1)
    // return false;
  }
)

export default service
