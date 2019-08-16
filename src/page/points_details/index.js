import React , { Component } from 'react';
import style from './index.scss'
import DocumentTitle from 'react-document-title'
import Header from '../../components/header/index'
import noDataimg from '../../assets/no_data.png'
import { timeOr } from '../../utils/filter'
import { getAccountByNumberWithShortWithIdWithOptionIdApi } from '../../api/index'

export default class pointsDetails extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = { 
      phone: '' ,
      password : '',
      // 是否加载完数据
      isLoadData: false,
      disabled: false,
      // 登录后同步的数据
      resData: {},
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
    if(this.props.location.search){
      let  theRequest = {}
      let str = this.props.location.search.substr(1)
      let strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
      getAccountByNumberWithShortWithIdWithOptionIdApi(theRequest).then(res=>{
        if(res.success){
          this.setState({
            resData: res.result,
            isLoadData: true
          })
        }
      })
    }else if(this.props.location.state != undefined){
      let formUrl = this.props.location.state.router_.pathname
      if(formUrl && formUrl === '/bankLogin'){
        sessionStorage.setItem('firstPage','001')
      }
      if(!this.props.location.state.integralDetail){
        this.setState({
          resData: this.props.location.state,
          isLoadData: true
        },()=>{
        })
      }else{
        this.setState({
          resData: this.props.location.state,
          isLoadData: true
        })
      }
      
    }else{
      window.location.href = "/"
    }
  }
  replacenumber = (val) =>{
    let str_ =  val.replace(/[3-]/g,' ')
    return str_
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
      default:
        break;
    }
  }

  render () {
    const requireContext = require.context("../../assets/bankBg/",true, /^\.\/.*\.png$/)
    const projectImgs = requireContext.keys().map(requireContext)
    const bankMin = require.context("../../assets/bank/",true, /^\.\/.*\.png$/)
    const bankMinList = bankMin.keys().map(bankMin)
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
      return (
        <DocumentTitle title="积分明细">
          <div className={style.main}>
            <div className={style.titlebox_}>
              <Header title="积分明细"></Header>
            {/* 卡片详情 */}
            { this.state.isLoadData ? 
            <div className={style.cradbox}>
              <img src={projectImgs[+this.state.resData.accountOptionId-1]} className={style.bankBg} alt=""/>
              <div className={style.topzindex}>
                <div className={"tc "+style.titlebox}>可用积分</div>
                <div className={"tc "+style.pointerbox}>{this.state.resData.currentIntegral}<b>分</b></div>
                <div className={"flex-between "+style.carddetilas}>
                  <div className={style.flexBox}>
                    <div className="flex">
                      <div className={style.iconbox}><img src={bankMinList[+this.state.resData.accountOptionId-1]} className={style.minBankIcon}  alt=""/></div>
                      <div>
                        <div>{this.state.resData.accountOptionName}</div>
                        <div>信用卡{this.state.resData.shortNumber? '('+this.state.resData.shortNumber+')' : ''}</div>
                      </div>
                    </div>
                    
                   
                  </div>
                  <div className={"tr "+style.flexBox}>
                    <div>最近同步时间</div>
                    <div>{this.state.resData.updateTime}</div>
                  </div>
                </div>
              </div>
            </div> : null 
          }
            {/* 描述 */}
            {/* <div className={style.detailsbox}><img src={warring_icon} className={style.warringbox} alt=""/>961积分将于2020.08.31过期</div> */}
          </div>
          {/* 记录 */}
          { this.state.isLoadData ? 
          <div className={style.logbox}>
          {
            !this.state.resData.integralDetail || this.state.resData.integralDetail.length <= 0 ? 
            <div>
              <center className={style.noDatabox}>
                <div className={style.noData}><img src={noDataimg} alt=""/></div>
                <p>暂无积分明细</p>
              </center>
            </div>
             : 
              this.state.resData.integralDetail.map((val,index)=>{
                return (
                  <div key={index}>
                  <ul className="flex-between">
                    <li className={style.leftli}>
                      <div>{val.month}月</div>
                      <div>{val.year}年</div>
                    </li>
                    <li className="flex-between">
                      <div className={style.logbuy}>
                      {
                        val['detail'].map((val,index)=>{
                          return (
                            <div key={index}>
                            <p className={style.timerbox}>{timeOr(val.date)} </p>
                              <section className={style.sectionbox+" flex"}>
                                <cite>{this.replacenumber(val.type)}</cite>
                                <cite className={val.point >=1 ? style.bluefont: style.redFont}>{val.point >= 0 ? '+'+val.point : val.point}</cite>
                              </section>
                            </div>
                          )
                        })
                      }
                      </div>
                      <div className={style.blueboxpointer + ' tc'}>
                        <div>{val.pointByMonth}</div>
                        <div>当月积分详情</div>
                      </div>
                    </li>
                  </ul>
                </div>
                )
              })
          }
          </div> : null
        }
        </div>
        </DocumentTitle>
      )
    }
}