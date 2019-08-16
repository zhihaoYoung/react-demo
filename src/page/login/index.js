import React, { Component } from 'react';
import style from './index.scss'
import { Button } from 'antd-mobile';
import DocumentTitle from 'react-document-title'
import { loginApi } from '../../api/index'
import phone_icon from '../../assets/inputIcon/phone_icon.png'
import password_icon from '../../assets/inputIcon/password_icon.png'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import Header from '../../components/header/index'
import { encryptData }  from '../../utils/cryptoValue'

export default class Login extends Component {
  constructor(props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = {
      iserrorbox: false,
      // 17817555235
      phone: '',
      // 123456
      password: '',
      isaCount: 0,
      disabled: false,
      phoneReg: /^1[3456789]\d{9}$/,
      passwordReg: /^[0-9a-zA-Z!@#$^]{5,18}$/
    }
    // this.handleGetInputValue = handleGetInputValue.bind(this) // mixin
  }
  componentWillUnmount() {
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  componentDidMount() {
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  postData = () => {
    let than = this
    const { password, phone, phoneReg, passwordReg } = this.state
    if (!phone) {
      Toast.fail("手机号码不能为空", 1.5)
      return false
    }else if (!(phoneReg.test(phone))) {
      Toast.fail("手机号码格式错误", 1.5)
      return false
    }
    if (!password) {
      Toast.fail("密码不能为空", 1.5)
      return false
    } else if (!(passwordReg.test(password))) {
      Toast.fail("密码长度为5到18位数字与英文组合", 1.5)
      return false
    }
    let postData_ = encryptData({
      phone: this.state.phone,
      password: this.state.password
    })
    // let postData_ = {
    //   phone: this.state.phone,
    //   password: this.state.password
    // }
    this.setState({ disabled: true })
    loginApi(postData_).then(_res => {
      let res = _res
      if (!res.success) {
        than.setState({
          disabled: false,
          iserrorbox: true
         })
        Toast.fail(res.msg || '网络繁忙，请稍后再试', 1)
        return false
      } else {
        localStorage.setItem('token',Math.random().toString(36).slice(-8))
        localStorage.setItem('Moible',res.result.phone)
        than.props.history.push('/');
      }
    })
  }

  handleGetInputValue = (event) => {
    switch (event.target.name) {
      case "phone":
        this.setState({
          phone: event.target.value,
        })
        break;
      case "password":
        this.setState({
          password: event.target.value,
        })
        break;
      default:
        break;
    }
  }

  render() {
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
    return (
      <DocumentTitle title="登录">
        <div className={style.main}>
          <div className={style.titlebox_}>
              <Header title="登录"></Header>
            </div>
          <center>
            {/* {this.state.phone}-{this.state.password} */}
            <div className={style.logobox}></div>
            <h1 className={style.h1}>积分工具</h1>
          </center>
          <div className={style.formbox}>
            <form>
              <cite>
                <img src={phone_icon} className={style.icon_box} alt=""/>
                <input type="text" className={style.inputbox} placeholder="请输入手机号码" maxLength="11" name="phone" value={this.state.phone} onChange={this.handleGetInputValue}></input>
              </cite>
              <cite>
              <img src={password_icon} className={style.icon_box}  alt=""/>
              
                <input type="password" className={style.inputbox} placeholder="请输入密码" maxLength="16" name="password" value={this.state.password} onChange={this.handleGetInputValue}></input>
               
              </cite>
              <Button type="primary" className={style.buttonbox} onClick={this.postData} loading={this.state.disabled} disabled={this.state.disabled} >登录</Button>
            </form>
            <div className="flex-around">
              <span className={style.spanflex+' rel '+style.firstspan}><Link to="/register">注册</Link></span>
              <span className={style.spanflex}><Link to="/resetPassword">忘记密码</Link></span>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
