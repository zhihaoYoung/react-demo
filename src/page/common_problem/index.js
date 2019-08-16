import React , { Component } from 'react';
import style from './index.scss'
import DocumentTitle from 'react-document-title'

export default class commonProblem extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = { 
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
  render () {
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
      return (
        <DocumentTitle title="常见问题">
          <div className={style.main}>
            <h1 className={style.problem}>常见问题</h1>
            <h1>为什么要开通网银同步？</h1>
            <p>自动获取积分记录，一键导入积分详单，让积分查询更便捷</p>

            <h1>如何开通网银同步？</h1>
            <p>首页添加积分账号，选择开户银行，填写登录信息，点击【开通同步】， 页面提示同步成功即可。</p>

            <h1>目前支持哪些银行的网银同步？</h1>
            <p>目前主要支持中信、兴业、平安、招商、中国银行、农行、广发、民生、建设等多家银行，后续会支持更多的银行。</p>

            <h1>为什么需要登录后才能开通同步？</h1>
            <p>
              <b>1、登录后您可以添加您的银行卡积分账单，实时查看，方便快捷 </b>
              <b>2、我们将在云端保存您的积分信息，一旦您更换手机，登录账户就可以一键同步。</b>
            </p>

            <h1>为什么不能后台同步？</h1>
            <p>因为您每次点击同步，我们都会把您的请求发送给银行，银行再向我们反馈您的积分账单。如果后台自动同步，在您没有新账单时，
              银行仍然会收到请求，这就增加了银行的负荷，为了减轻银行服务器的负担，我们目前只支持手动同步。</p>

            <h1>为什么网银同步时间较长？</h1>
            <p>第一次同步需要导入的积分账单信息较多，大概需要两分钟左右，建议耐心等待。</p>

            <h1>为什么提示用户名/卡号出错？</h1>
            <p>
              <b>1、请核实您的账户信息。</b>
              <b>2、如果账户信息无误，极有可能是您的网上银行尚未开通（不同于手机银行），建议联系银行客服确认。</b>
            </p>

            <h1>为什么会提示密码出错？</h1>
            <p>
              <b>1、银行卡的密码一般分为三种，交易密码，查询密码和网银登录密码，建议根据输入框提示输入对应的密码。</b>
              <b>2、如果忘记密码，建议电脑登录网上银行确认或联系银行客服。</b>
              <b>3、密码输入次数过多网银会被锁定，建议确认密码后再尝试输入。</b>
            </p>

            <h1>为什么密码输入错误有次数限制？</h1>
            <p>银行当天的密码输入出错次数都有一定的限制，针对不同银行，一般为3-6次不等，建议不要反复尝试，联系银行客服确认密码后再输入。</p>


            <h1>为什么会提示网银登录后异常，需要您手动登录？</h1>
            <p>有可能是您的银行卡尚未开通网银服务，或者网银已经过期，请联系银行客服确认。农行，中信，交行等银行在柜台办理网银时，不要求您设置网银密码，此时网银密码=支付密码；此后， 当您自行登录银行网站， 网站会要求您修改您的网银密码， 建议您先用电脑登录网上银行设置密码。</p>

            <h1>为什么网银同步进度显示有时会停顿？</h1>
            <p>可能是由于网银同步处在高峰期，建议您隔较长一段时间（建议1个小时以上）再试。</p>
            

            <h1>为什么会提示同步服务异常？</h1>
            <p>客户端没有接收到服务器返回的数据，可能是由于网络状况不佳或处于同步高峰期，建议稍后再试。</p>

            <h1>为什么会提示网银服务异常？</h1>
            <p>可能是由于银行网银系统出现故障或正在维护中，建议过较长一段时间再尝试。</p>

            <h1>为什么会提示网银账户中没有银行卡？</h1>
            <p>可能是您的银行卡尚未关联到网银账户下，建议联系银行客服确认。</p>

          </div>
        </DocumentTitle>
      )
    }
}
