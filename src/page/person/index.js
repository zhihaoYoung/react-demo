import React , { Component } from 'react';
import style from './index.scss'
import DocumentTitle from 'react-document-title'
import { logoutApi } from '../../api/index'
import { PhoneHidden } from '../../utils/filter'
import headpng from '../../assets/my_head.png'
import my_head_active from '../../assets/my_head_active.png'
import feeback from '../../assets/feeback.png'
import quesction from '../../assets/quesction.png'
import { Link } from 'react-router-dom'
import Footer from '../../components/footer/index'
import Header from '../../components/header/index'

export default class Person extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = {
      userToken: localStorage.getItem("token") || '',
      Moible: localStorage.getItem("Moible") || '',
    }
    // this.handleGetInputValue = handleGetInputValue.bind(this) // mixin
  }
  componentWillUnmount() {
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  componentDidMount () {
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  // 前往登录
  loginPage = () =>{
    this.props.history.push('/login')
  }
  // 退出登录
  SignOut = () =>{
    logoutApi().then(res=>{
      if(res.success){
        // localStorage.removeItem("token")
        localStorage.removeItem("Moible")
        this.props.history.push('/login')
      }
    })
  }
  render () {
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
      return (
        <DocumentTitle title="我的">
          <div className={style.main}>
          { this.state.userToken ? 
            <i onClick={this.SignOut} className={style.singoutI}>退出登录</i> : null }
            <div className={style.titlebox_}>
              <Header title="我的"></Header>
            </div>
            <div className={style.marginbox}>
              {
                this.state.userToken ? (
                  <div className={'flex-between flex-middle '+style.padingbox} >
                    <div className={style.overlogin}>
                      <b>尊敬的用户：</b> 
                      <div className={style.phonebox}>{PhoneHidden(this.state.Moible)}</div>
                    </div>
                    <span className={style.headbox}><img src={my_head_active} alt=""/></span>
                  </div>
                ): (
                  <div className={style.padingboxs+' flex-between flex-middle '+style.padingbox}>
                    <span className={style.loginbox} onClick={this.loginPage} >登录</span>
                    <span className={style.headbox}><img src={headpng} alt=""/></span>
                  </div>
                )
              }
              </div>
              <div className={style.borderbox}></div>
              <div className={style.marginbox}>
                <div className={style.titlefont}>服务特权</div>
                  <div className={'flex '+style.borderbottom} >
                    <Link to="/commonProblem"><div className={style.span_title}>
                      <div className={style.imgbox}><img src={quesction} alt=""/></div>
                      常见问题</div></Link>
                      <Link to="/feedback"><div className={style.span_title}>
                    <div className={style.imgbox}><img src={feeback} alt=""/></div>
                    意见反馈</div></Link>
                  </div>
              </div>
              <Footer></Footer>
          </div>
        </DocumentTitle>
      )
    }
}