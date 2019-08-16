import React , { Component } from 'react'
import style from './index.scss'
import { Button ,  Toast, Checkbox, Modal} from 'antd-mobile'
import DocumentTitle from 'react-document-title'
import Modals from '../../components/modal/index'
import loadingImg from '../../assets/loading.gif'
import account_icon from '../../assets/inputIcon/account_icon.png'
import password_icon from '../../assets/inputIcon/password_icon.png'
import { synchronizationIntegralApi, getSynchronizationSmsCodeTypeApi, inputSmsCodeApi } from '../../api/index'
import { Link } from 'react-router-dom'
import Loadingbox from '../../components/loading/index'
import { encryptData }  from '../../utils/cryptoValue'

const AgreeItem = Checkbox.AgreeItem;

export default class bankLogin extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.source_ = ''
    this.source = ''
    this.alertbox = ''
    this.state = { 
      // 是否加载完毕
      isLoaded: false,
      isShowLoading: false,
      // value={this.state.phone}  onChange={this.handleGetInputValue}
      // 二次验证手机验证码
      phoneCode : '',
      iserrorbox: false,
      isaCount: 0,
      // phone: '440981199506043551' ,
      phone: '' ,
      password : '',
      // qq34649723
      modealBox: false,
      disabled: false,
      // 回调弹窗提示
      titlebox: '请输入验证码',
      bankNama: '',
      // parmasCode: this.props.location.state.code || '',
      // bankImg: this.props.location.state.icon || '',
      timeadd: 0,
      // 建设银行最多位数10
      maxInputnumber: 10,
      // 是否同意了服务条款
      isCheckBox: true,
    }
    // this.handleGetInputValue = handleGetInputValue.bind(this) // mixin
  }
  componentWillUnmount() {
    if(this.source_){
      this.source_.cancel()
    }
    if(this.source){
      this.source.cancel()
    }
    // this.source_.cancel()
    // this.source.cancel('组件卸载,取消请求')
    this.setState = (state,callback)=>{
      return;
    }
    clearInterval(this.timerID)
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  componentDidMount() {
    let firstPage_ = sessionStorage.getItem('firstPage')
    if(firstPage_ && firstPage_ === '001'){
      sessionStorage.removeItem('firstPage')
      this.props.history.push({pathname:'/'})
    }else{
      if(this.props.location.state){
        this.setState({ 
          isLoaded: true,
        })
      }else{
        this.props.history.push({pathname:'/'})
      }
    }
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  postData = () =>{
    this.source = window.axios_.CancelToken.source()
    this.source_ = window.axios_.CancelToken.source()
    const _alert = Modal.alert;
    let { password ,phone} = this.state
    if(!phone){
      Toast.fail("用户名不能为空", 1)
      return false
    }else if(phone.length <= 5 ) {
      Toast.fail("用户名格式错误", 1)
      return false
    }
    if(!password){
      Toast.fail("密码不能为空", 1)
      return false
    }else if(password.length <= 5 ) {
      Toast.fail("密码格式错误", 1)
      return false
    }

    if(!this.state.isCheckBox){
      Toast.fail('未同意条款', 2);
      return false
    }
    let postData_ = encryptData({
      accountNumber:this.state.phone,
      password:this.state.password,
      accountOptionId: this.props.location.state.code
    })
    this.setState({ 
      isShowLoading: true,
      disabled: true,
      // modealBox: true
    })
    let firstPost = encryptData({
      accountNumber:this.state.phone,
      accountOptionId: this.props.location.state.code
    })
    this.falseLoading()
    getSynchronizationSmsCodeTypeApi(firstPost , this.source.token).then(res=>{
      if(res.success){
        this.setState({
          isShowLoading: false,
          modealBox: true
        })
      }else{
        clearInterval(this.timerID)
        // if(this.sync){
        // }else{
        //     if(res.code === 601){
        //       this.alertbox = _alert('提示', '同步太频繁，请过段时间（建议1小时以上）再试', [
        //         {
        //           text: '知道了',
        //         }
        //       ])
        //     }else{
        //       this.alertbox = _alert('提示', '同步服务异常建议稍后再试', [
        //         {
        //           text: '知道了',
        //         }
        //       ])
        //     }
        // }
        // this.source_.cancel('取消请求')
        this.setState({
          timeadd: 0,
          // disabled: false,
          // isShowLoading: false,
        })
      }
    })
    synchronizationIntegralApi(postData_ , this.source_.token).then(res=>{
        if(!res.success){
          if(this.alertbox){
            this.alertbox.close()
          }
          clearInterval(this.timerID);
          if(+res.code === 502){
            _alert('提示', '您的密码有误，今天还有'+res.result+'次机会' || '网络繁忙，请稍后再试' , [
              { text: '知道了'}
            ])
            this.setState({ 
              modealBox: false,
              timeadd: 0,
              isShowLoading: false,
              disabled: false,
              iserrorbox: true,
              isaCount: res.msg
            })    
          }else{
            let errormsg = "网络繁忙，请稍后再试"
            this.setState({ 
              timeadd: 0,
              modealBox: false,
              isShowLoading: false,
              disabled: false,
            })  
            if(res.code === 501){
              errormsg = "密码输入次数过多，网银已被锁住，建议明天再试"
            }else if(res.code === 503){
              errormsg = "短信验证码输入错误"
            }else if(res.code === 505 || res.code === 507 ){
              errormsg = "1.请确认您的网银账户已开通并激活，可在电脑上正常登陆2.同一张银行卡可能有多重类型的密码，请按提示输入相应的密码"
            }else if(res.code === 508 || res.code === 506 || res.code === 509  || res.code === 504){
              errormsg = "同步服务异常建议稍后再试"
            }else if(res.code === 600 ){
              errormsg = "银行同步服务正在升级中,预计需5-7个工作日,还请您耐心等待"
            }else if( res.code === 601 ){
              errormsg = "同步太频繁，请过段时间（建议1小时以上）再试"
            }
            this.sync = _alert('提示', errormsg , [
              {
                text: '知道了',
              }
            ])
            return false
          }
        }else {
          this.setState({
            isShowLoading: false,
          })
          let objs  = {
                "success": true,
                "code": 0,
                "msg": "SUCCESS",
                "result": {
                    "id": 1,
                    "accountNumber": "4xxxxxxxxxx",
                    "password": "xxxxxxx",
                    "accountOptionId": 2,
                    "shortNumber": "5907",
                    "currentIntegral": "4398",
                    "userId": 1,
                    "updateTime": "1949",
                    "accountOptionName": "中心银行",
                    "updateCount":10,
                    "passwordWarnRecord":2,
                    "integralDetail": null
                }
            }
          let concantobj = Object.assign(res.result,{name:this.props.location.state.name,router_:this.props.location})
          this.props.history.push({pathname:'/pointsDetails',state:concantobj});
        }
    })
  }
  // 虚假进度条
  falseLoading = (initNumber_) =>{
    let timeAcount = initNumber_ || 1
    this.timerID = setInterval(()=>{
      if(timeAcount === 80){
        clearInterval(this.timerID);
        this.setState({ 
          timeadd: 80,
        })  
      }else{
        this.setState({ 
          timeadd: timeAcount,
        })  
        timeAcount++
      }
    },1000)
  }
 
  handleGetInputValue = (event) => {
    switch(event.target.name) {
      case "phone":
          this.setState({
            phone : event.target.value,
          })
      break;
      case "password":
          this.setState({
            password : event.target.value,
          })
      break;
      case "phoneCode":
          this.setState({
            phoneCode : event.target.value,
          })
      break;
      default:
        break;
    }
  }
  // 关闭弹窗
  handleVal = (isTrue) => {
    this.source_.cancel()
    clearInterval(this.timerID)
    this.setState({ 
      phoneCode: '',
      timeadd: 0,
      disabled: false,
      modealBox: isTrue
    })
    // this.forceUpdate()
  }
  // 二次验证=> 手机验证码
  secondPhoneCode = () =>{
    let code = {
      accountNumber: this.state.phone,
      securityCode: this.state.phoneCode
    }
    inputSmsCodeApi(code).then(res=>{
      if(res.success){
        this.setState({ 
          phoneCode: '',
          isShowLoading: true,
          modealBox: false
        })
        clearInterval(this.timerID)
        this.falseLoading(this.state.timeadd)
      }else{
        clearInterval(this.timerID)
        this.setState({ 
          phoneCode: '',
          modealBox: false
        })
        Toast.fail(res.msg || '网络繁忙，请稍后再试', 2);
      }
    })
  }
  isChecked = (e) =>{
    this.setState({ 
      isCheckBox: e.target.checked
    })
  }
  render () {
      const requireContext = require.context("../../assets/banklogin/",true, /^\.\/.*\.png$/)
      const projectImgs = requireContext.keys().map(requireContext)
      return (
        <DocumentTitle title="银行同步">
          {this.state.isLoaded ? 
          <div className={style.main}>
            {this.state.modealBox ? (
              <Modals handleVal={this.handleVal}>
                {/* 短信验证码 */}
                <div className={style.modealboxlist}>
                  <p className={"tl "+style.titlebox} style={{ fontWeight: 'bold'}}> {this.state.titlebox}</p>
                  <p className={"tl "+style.padtopbox} > 验证码已发送至手机</p>
                  {/* <div className={"tl "+style.phonedetails} >13662248225</div> */}
                  <div><input type="tel" className={style.inputboxs+' rel '+style.onlyInput} maxLength="6" name="phoneCode" value={this.state.phoneCode} onChange={this.handleGetInputValue}></input></div>
                  <Button type="primary" className={style.compostbtn} onClick={this.secondPhoneCode} >登录</Button>
                </div>
                {/* 图形验证码 */}
                {/* <div className="relative">
                  <p className={"tl "+style.titlebox} style={{ fontWeight: 'bold'}}> {this.state.titlebox}</p>
                  <br/>
                  <div className={style.imgcode}>
                    图片验证码
                  </div>
                  <div><input type="tel" className={style.inputbox} maxLength="8"></input></div>
                  <Button type="primary" className={style.compostbtn} onClick={this.secondPhoneCode} >确认</Button>
                </div> */}
              </Modals>
            ):null}
            {/* 登录回调 */}
              {/* <Modal
                visible={this.state.modealBox}
                transparent
                closable = {true}
                maskClosable={false}
                onClose={this.onClose}
                className = "resphoneCode"
              >
                <div className="">
                  <p className="tl" style={{ fontWeight: 'bold'}}> {this.state.titlebox}</p>
                  <p className="tl"  style={{ padding: '35px 0 5px'}}> 验证码已发送至手机：</p>
                  <div className="tl"  style={{ color: '#4389FF'}}>13662248225</div>
                  <div className="tl"><input type="text"></input></div>
                  <Button type="primary" className={style.buttonbox} onClick={this.postData} >确认</Button>
                </div>
              </Modal> */}
            <center>
              <div className={style.logobox}><img src={projectImgs[this.props.location.state.code-1]} alt=""/></div>
              <h1 className={style.h1}>{this.props.location.state.name}</h1>
            </center>
            { this.state.isShowLoading ?
            <div className={style.popoMask}>
              <div className={style.loadingbox}>
                <img src={loadingImg} alt=""/>
                  <span>同步中 {this.state.timeadd}%</span>
              </div>
            </div> : null
            }

            <div className={style.formbox}>
              <form>
                <cite>
                  <img src={account_icon} alt=""  className={style.icon_box}/>
                  <input type="text" className={style.inputbox} placeholder="请输入用户名/证件号码"  name="phone" value={this.state.phone}  onChange={this.handleGetInputValue}></input>
                </cite>
                <cite className={style.lastcite}>
                  <img src={password_icon} alt=""  className={style.icon_box}/>
                  <input type="password" className={style.inputbox} placeholder="请输入登录密码" maxLength={this.state.maxInputnumber}  name="password" value={this.state.password}  onChange={this.handleGetInputValue}></input>
                  {/* terms */}
                </cite>
                
                <AgreeItem className={style.checkboxlist} defaultChecked={true} onChange={this.isChecked}><div className={style.aggrenbox}><i>同意</i><b><Link to="/terms">服务协议</Link></b></div></AgreeItem>
                <Button type="primary" className={style.buttonbox} onClick={this.postData} loading={this.state.disabled} disabled={this.state.disabled} >开通同步</Button>
              </form>
              <div>
             
              </div>
            </div>
          </div> : <Loadingbox></Loadingbox> }
        </DocumentTitle>
      )
    }
}
