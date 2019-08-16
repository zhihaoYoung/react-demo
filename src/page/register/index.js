import React, { Component } from 'react';
import style from './index.scss'
import { Button } from 'antd-mobile';
import DocumentTitle from 'react-document-title'
import { sandSMSApi , registerApi } from '../../api/index'
import { Toast } from 'antd-mobile'
import password_icon from '../../assets/inputIcon/password_icon.png'
import phoneCode_icon from '../../assets/inputIcon/phoneCode_icon.png'
import phone_icon from '../../assets/inputIcon/phone_icon.png'
import { Link } from 'react-router-dom'
import Header from '../../components/header/index'
import { encryptData }  from '../../utils/cryptoValue'

export default class Register extends Component {
  constructor(props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = {
      phone: '',
      phoneCode: '',
      password: '',
      count: 60,
      // 提交按钮禁用
      disabledSubmit: false,
      // 获取短信验证码禁用
      getCodeDisabled: false, 
      // 文案默认为 '获取验证码'
      getCodeChange: true, 
      phoneReg: /^1[3456789]\d{9}$/,
      phoneCodeReg: /\d{4,6}/,
      passwordReg : /^[0-9a-zA-Z!@#$^]{5,18}$/
    }
    // this.handleGetInputValue = handleGetInputValue.bind(this) // mixin
  }
  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    }
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  componentDidMount() {
    // setTimeout(() => {
    //    localStorage.setItem('Token',Math.random().toString(36).slice(-8))
    //   localStorage.setItem('Moible','13662248225')
    //   this.props.history.push('/');
    // }, 1500)
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  // 短信验证码 - 倒计时
  countDown = () =>{
    const { count   } = this.state
    if (count === 1) {
      this.setState({
        count: 60,
        getCodeDisabled: false,
        getCodeChange: true,
      });
    } else {
      this.setState({
        count: count - 1,
        getCodeChange: false,
      });
    setTimeout(this.countDown.bind(this), 1000);
    }
  }

  // 获取短信验证码
  getPhoneCode = () => {
    let than = this
    const {  phone , phoneReg } = this.state
    if (!(phoneReg.test(phone))) {
      Toast.fail("手机号码格式错误", 1)
      return false
    }
    this.setState({
      getCodeDisabled: true
    })
    sandSMSApi(phone).then((res) => {
      if(res.success){
        than.countDown()
      }else{
        than.setState({
          getCodeDisabled: false
        })
        Toast.fail(res.msg || "网络繁忙，请稍后再试", 1)
        return false
      }
    })
  }
  postData = () => {
    let than = this
    const { password , phone , phoneCode, phoneReg , passwordReg , phoneCodeReg} = this.state
    if(!phone){
      Toast.fail("手机号码不能为空", 1)
      return false
    }else if (!(phoneReg.test(phone))) {
      Toast.fail("手机号码格式错误", 1)
      return false
    }
    if(!phoneCode){
      Toast.fail("验证码不能为空", 1)
      return false
    }else if(!(phoneCodeReg.test(phoneCode))) {
      Toast.fail("验证码格式错误", 1)
      return false
    }
    if(!password){
      Toast.fail("密码不能为空", 1)
      return false
    }else if(!(passwordReg.test(password))) {
      Toast.fail("密码长度为5到18位数字与英文组合", 1)
      return false
    }
    let postData_ = encryptData({
      phone: phone,
      securityCode: phoneCode,
      password: password
    })
    this.setState({ disabledSubmit: true })
    registerApi(postData_).then(res => {
      if(res.success){
        Toast.success("恭喜您，注册成功", 1)
        localStorage.setItem('token',Math.random().toString(36).slice(-8))
        localStorage.setItem('Moible',res.result.phone)
        setTimeout(() => {
          than.props.history.push('/login');
        }, 1500);
      }else{
        Toast.fail(res.msg || '网络错误，请稍后再试', 1)
        than.setState({
          disabledSubmit: false
        })
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
      case "phoneCode":
          this.setState({
            phoneCode: event.target.value,
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
    let getCodetext = '获取验证码'
    if (!this.state.getCodeChange) {
      getCodetext = this.state.count + 's';
    }
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
    return (
      <DocumentTitle title="注册">
        <div className={style.main}>
          <div className={style.titlebox_}>
            <Header title="注册"></Header>
          </div>
          <div className={style.formbox}>
            <form>
              <cite className="block">
                <img src={phone_icon} className={style.icon_box} alt=""/>
                <input type="text" className={style.inputbox} placeholder="请输入手机号码" maxLength="11" name="phone" value={this.state.phone} onChange={this.handleGetInputValue}></input>
              </cite>
              <cite className="flex-between">
                <div className={style.flexbox}>
                  <img src={phoneCode_icon} className={style.icon_box} alt=""/>
                  <input type="tel" className={style.inputbox} placeholder="请输入短信验证码" maxLength="4" name="phoneCode" value={this.state.phoneCode} onChange={this.handleGetInputValue}></input>
                </div>
                <div className={style.flexbox + ' ' + style.flexboxsecond}>
                  <Button type="primary" disabled={this.state.getCodeDisabled} className={style.getcodebtn} onClick={this.getPhoneCode}>{getCodetext}</Button>
                </div>
              </cite>
              <cite className="block">
              <img src={password_icon} className={style.icon_box} alt=""/>
                <input type="password" className={style.inputbox} placeholder="请输入密码" maxLength="16" name="password" value={this.state.password} onChange={this.handleGetInputValue}></input>
              </cite>
              <Button type="primary" className={style.buttonbox} onClick={this.postData} loading={this.state.disabledSubmit} disabled={this.state.disabledSubmit} >注册</Button>
            </form>
            <div className="">
              <div className={style.webrule}>点击“注册”即表示您同意并愿意遵守<b><Link to="/terms">用户协议</Link></b></div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
