import React, { Component } from 'react';
import { Button, Modal, Toast, SwipeAction } from 'antd-mobile';
import addicon from '../../assets/add-icon.png'
import style from './index.scss'
import ReactHighcharts from 'react-highcharts';
import Footer from '../../components/footer/index'
import down_icon from '../../assets/down_icon.png'
import noDataimg from '../../assets/no_data.png'
import Header from '../../components/header/index'
import Modals from '../../components/modal/index'
import { Link } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import Loadingbox from '../../components/loading/index'
import { getAccountListApi , getMaintenanceAccountApi, synchronizationIntegralApi, getSynchronizationSmsCodeTypeApi, inputSmsCodeApi, removeAccountApi } from '../../api/index'
import { encryptData }  from '../../utils/cryptoValue'

const _alert = Modal.alert;

export default class Home extends Component {
  constructor(props, context) {
    super(props, context)
    // this.source = window.axios.CancelToken.source()
    // console.log(this.source)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.objIndex = ''
    this.alertbox = ''
    this.source = ''
    this.source_ = ''
    this.state = {
      loadingData: true,
      isAllData: false,
      Viewconfig: {},
      // 是否加载了数据
      isLoadData: false,
      // 加载更多三角形反方向
      downAdd: false,
      // 银行账号
      accountNumber: '',
      banklist: [],
      // 用户的银行
      banklists: [{
        id: 56,
        accountNumber: "440981199506043551",
        accountOptionId: 1,
        accountOptionName: "建设银行",
        accountTypeId: 1,
        currentIntegral: "10016",
        id: 56,
        integralDetail: null,
        password: null,
        shortNumber: "9314/672295",
        state: null,
        updateCount: null,
        updateTime: "2019-08-06 08:50:07",
        userId: 4
      }],
      titlebox: '请输入验证码',
      // 弹窗
      modealBox: false,
      // 首页银行数据可视化
      dataView: [],
      // 进度条
      timeadd: 0,
      // 是否同步了积分
      isClick: false,
      phoneCode: '',
      // 维护中对应的银行id
      isMaintain: [],
      // 进度条数字
      rangNumber: 0,
      // 点击的按钮值
      isButton: ''
    }
  }
  // componentWillMount (组件刚经历constructor,初始完数据 = 组件还未进入render，组件还未渲染完成，dom还未渲染) = 一般用的比较少，更多的是用在服务端渲染
  // componentDidMount  (组件第一次渲染完成，此时dom节点已经生成，可以在这里调用ajax请求，返回数据setState后组件会重新渲染)
  // componentWillReceiveProps 参数（nextProps）= (在接受父组件改变后的props需要重新渲染组件时用到的比较多)
  // shouldComponentUpdate （唯一用于控制组件重新渲染的生命周期）
  // componentWillUpdate (nextProps,nextState) = 返回true以后，组件进入重新渲染的流程
  // componentDidUpdate (prevProps,prevState) react只会在第一次初始化成功会进入componentDidmount,
  // 之后每次重新渲染后都会进入这个生命周期，这里可以拿到prevProps和prevState，即更新前的props和state。
  // componentWillUnmount 销毁组件时调用
  componentDidMount() {
    if (document.querySelector('div[id^="am-modal-container"]')) {
      document.querySelector('div[id^="am-modal-container"]').innerHTML = ''
    }
    
    if (localStorage.getItem('token')) {
      this.getAccountlist()
    } else {
      this.setState({
        loadingData: false,
      })
    }
  }
  componentWillUnmount() {
   
    clearInterval(this.timerID)
    if (this.source_) {
      this.source_.cancel()
    }
    if (this.source) {
      this.source.cancel()
    }
    // this.source.cancel('组件卸载,取消请求')
    // this.source_.cancel()
    this.setState = (state, callback) => {
      return;
    }
    if (document.querySelector('div[id^="am-modal-container"]')) {
      document.querySelector('div[id^="am-modal-container"]').innerHTML = ''
    }
  }
  // 获取是否在维护中
  maintain = (id, beforeres, beforeview) => {
    getMaintenanceAccountApi(id).then(res => {
      if (res.success) {
        for (let i in beforeres) {
          beforeres[i].isMaintain = res.result
        }
        this.setState({
          loadingData: false,
          isLoadData: true,
          isMaintain: res.result,
          dataView: beforeview,
          banklist: beforeres
        }, () => {
        })
        this.viewDatabox()
      }
    })
  }
  getAccountlist = () => {
    getAccountListApi().then(_res => {
      let res = _res
      let dataViewarr = []
      if (res.success) {
        if (res.result.length >= 1) {
          sessionStorage.setItem('firstBank', JSON.stringify(res.result))
          for (let i in res.result) {
            dataViewarr.push({ name: res.result[i].accountOptionName, y: Number(res.result[i].currentIntegral) })
          }
          this.maintain(res.result[0].accountTypeId, res.result, dataViewarr)
        } else {
          sessionStorage.removeItem('firstBank')
          this.setState({
            loadingData: false,
            isLoadData: false
          })
        }
      }
    })
  }
  Hrefpage = () => {
    if (localStorage.getItem('token')) {
      this.props.history.push({ pathname: '/addacount' }, { isMaintain: this.state.isMaintain });
    } else {
      this.props.history.push('/login');
    }
  }
  // 二次验证=> 手机验证码
  secondPhoneCode = () => {
    if (this.state.phoneCode === '') {
      alert('验证码不能为空')
      return false
    } else if (this.state.phoneCode.length < 3) {
      alert('验证码格式错误')
      return false
    }
    let code = {
      accountNumber: this.state.accountNumber,
      securityCode: this.state.phoneCode
    }
    inputSmsCodeApi(code).then(res => {
      if (res.success) {
        this.falseLoading(this.objIndex, this.state.timeadd)
        this.setState({
          phoneCode: '',
          modealBox: false
        },()=>{
          document.body.style.overflow = '';
        })
      } else {
        Toast.fail(res.msg || '网络繁忙，请稍后再试', 2);
        this.setState({
          phoneCode: '',
          modealBox: false
        },()=>{
          document.body.style.overflow = '';
        })
      }

    })
  }
  // 维护提示
  maintainF = () => {
    _alert('提示', '银行同步服务正在升级中,预计需5-7个工作日,还请您耐心等待')
  }

  // 固定底部 
  fixedBootom = () => {
    let anchorElement = document.getElementById("downImg");
    if (anchorElement) { anchorElement.scrollIntoView() }
  }

  // 银行加载更多
  addmore = () => {
    if (this.state.downAdd) {
      return false
    }
    this.setState({ downAdd: true }, this.fixedBootom)
  }
  // 关闭验证码弹窗
  handleVal = (isTrue) => {
    this.objIndex.setAttribute("style", " ");
    this.objIndex.innerHTML = '同步积分'
    clearInterval(this.timerID);
    this.source_.cancel()
    this.setState({
      phoneCode: '',
      isClick: false,
      modealBox: isTrue
    },()=>{
      document.body.style.overflow = '';
    })
  }
  // 虚假进度条
  falseLoading = ($indeId, initNumber_) => {
    let timeAcount = initNumber_ || 1
    $indeId.style.background = 'transparent'
    $indeId.style.color = '#000000'
    $indeId.style.width = 'auto'
    $indeId.style.paddingRight = '0'
    this.timerID = setInterval(() => {
      if (timeAcount === 80) {
        $indeId.innerHTML = '正在同步' + timeAcount + '%'
        clearInterval(this.timerID);
        this.setState({
          timeadd: 80,
        })
      } else {
        $indeId.innerHTML = '正在同步' + timeAcount + '%'
        this.setState({
          timeadd: timeAcount,
        })
        timeAcount++
      }
    }, 1000)
  }
  handleGetInputValue = (event) => {
    switch (event.target.name) {
      case "phoneCode":
        this.setState({
          phoneCode: event.target.value,
        })
        break;
      default:
        break;
    }
  }
  // 同步积分
  Synchronize = (event, index, item) => {
    this.source = window.axios_.CancelToken.source()
    this.source_ = window.axios_.CancelToken.source()
    let than = this
    if (this.state.isClick) {
      return false
    }

    let $indeId = document.querySelector("#Btn_" + index)

    this.setState({
      isClick: true,
      timeadd: 0,
      accountNumber: item.accountNumber
    })
    let firstPost = encryptData({
      shortNumber: item.shortNumber,
      accountNumber: item.accountNumber,
      accountOptionId: item.accountOptionId
    })
    // 将点击的按钮绑定到 constructor里面
    this.objIndex = $indeId
    clearInterval(this.timerID)
    this.falseLoading($indeId)
    // 获取验证码类型
    getSynchronizationSmsCodeTypeApi(firstPost, this.source.token).then(res => {
      if (res.success) {
        clearInterval(this.timerID);
        document.body.style.overflow = 'hidden';
        this.setState({
          modealBox: true
        }, () => {
          document.querySelector("#codeInputbox").focus()
        })
      } else {
        // this.setState({
        //   isClick: false
        // })
        // clearInterval(this.timerID)
        // $indeId.setAttribute("style"," ")
        // $indeId.innerHTML = '同步积分'

        // if(res.code === 601){
        //   _alert('提示', '同步太频繁，请过段时间（建议1小时以上）再试', [
        //     {
        //       text: '知道了',
        //     }
        //   ])
        // }else{
        //   this.alertbox  = _alert('提示', '同步服务异常建议稍后再试', [
        //     {
        //       text: '知道了',
        //     }
        //   ])
        // }
        // this.source_.cancel('取消请求')
      }
    })

    // 同步银行
    let { shortNumber, accountOptionId, accountNumber } = item
    let postData = encryptData({
      accountNumber: accountNumber,
      accountOptionId: accountOptionId,
      shortNumber: shortNumber
    })
    synchronizationIntegralApi(postData, this.source_.token).then(res => {
      if (res.success) {
        let updateCount_ = res.result.updateCount == null ? 0 : res.result.updateCount
        const upDate_currentIntegral = this.state.banklist.map((v, i) => {
          if (i === index) {
            v.currentIntegral = res.result.currentIntegral
          }
          return v
        })
        than.setState({
          phoneCode: '',
          timeadd: 0,
          isClick: false,
          banklist: upDate_currentIntegral
        })
        clearInterval(this.timerID)
        $indeId.style.color = '#66D853'
        $indeId.innerHTML = '已同步' + updateCount_ + '笔积分账单'
        Toast.success('同步成功', 1)
      } else {
        if (this.alertbox) {
          this.alertbox.close()
        }
        let errormsg = '网络繁忙，请稍后再试'
        clearInterval(this.timerID)
        $indeId.setAttribute("style", " ")
        $indeId.innerHTML = '同步积分'
        than.setState({
          phoneCode: '',
          timeadd: 0,
          modealBox: false,
          isClick: false
        },()=>{
          document.body.style.overflow = ''
        })
        if (res.code === 502) {
          _alert('提示', '用户名密码错误', [
            {
              text: '前往重新登录', onPress: () => {
                than.props.history.push({ pathname: '/bankLogin', state: { code: item.accountOptionId, name: item.accountOptionName } });
              }
            }
          ])
        } else if (res.code === 501) {
          errormsg = "密码输入次数过多，网银已被锁住，建议明天再试"
        } else if (res.code === 503) {
          errormsg = "短信验证码输入错误"
        } else if (res.code === 505 || res.code === 507) {
          errormsg = "1.请确认您的网银账户已开通并激活，可在电脑上正常登陆2.同一张银行卡可能有多重类型的密码，请按提示输入相应的密码"
        } else if (res.code === 509 || res.code === 506 || res.code === 508 || res.code === 504) {
          errormsg = "同步服务异常建议稍后再试"
        } else if (res.code === 600) {
          errormsg = "银行同步服务正在升级中,预计需5-7个工作日,还请您耐心等待"
        } else if (res.code === 601) {
          errormsg = "同步太频繁，请过段时间（建议1小时以上）再试"
        }
        _alert('提示', errormsg, [
          {
            text: '知道了',
          }
        ])
        return false
      }
    })
  }
  // 首页的饼状图
  viewDatabox = () => {
    let than = this
    this.setState({
      Viewconfig: {
        chart: {
          height: '250px',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
        },
        // logo去掉
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        // logo去掉
        title: {
          text: '',
        },
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
        },
        colors: ['#4389FF', '#66D853', '#F56E5C'],
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              distance: 20,
              enabled: true,
              format: '<b>{point.name}</b>: {point.y} 分',
              style: {
                fontSize: '14px',
                color: 'black',
              },
            },
            connectorWidth: 12,
            // showInLegend: true,
          },
        },
        series: [{
          type: 'pie',
          innerSize: '83%',
          name: '市场份额',
          data: than.state.dataView
        }],
      }
    })
  }
  
  
  render() {
    const requireContext = require.context("../../assets/bankhome/", true, /^\.\/.*\.png$/)
    const projectImgs = requireContext.keys().map(requireContext)
    return (
      <DocumentTitle title="首页">
      <div className={style.mainbox}>
        {!this.state.loadingData ?
          <main>
            <div className={style.main}>
              <Header title="积分总览"></Header>
            </div>
            {this.state.isLoadData ?
              <div className={style.reactbox}>
                <ReactHighcharts config={this.state.Viewconfig} />
              </div> :
              // 暂无数据
              <center className={style.boxshow}>
                <div className={style.imgCenter}>
                  <img src={noDataimg} alt="" />
                </div>
                <p className={style.noAccount}>暂无积分账户</p>
                <p className={style.addAccount}>点击下方进行添加</p>
              </center>
            }
            <div className={style.main}>
              {this.state.modealBox ? (
                <Modals handleVal={this.handleVal}>
                  {/* 手机验证码 */}
                  <div>
                    <p className={"tl " + style.titlebox} style={{ fontWeight: 'bold' }}> {this.state.titlebox}</p>
                    <p className="tl" style={{ padding: '0 0 10px' }}> 验证码已发送至手机</p>
                    <div><input type="tel" id="codeInputbox"   className={style.inputbox + ' rel ' + style.onlyInput} maxLength="6" name="phoneCode" value={this.state.phoneCode} onChange={this.handleGetInputValue}></input></div>
                    <Button type="primary" className={style.compostbtn} onClick={this.secondPhoneCode} >登录</Button>
                  </div>
                  {/* 已经修改了密码 */}
                  {/* <div className={style.bankCodebox}>
                    <p className={"tl "+style.titlebox} style={{ fontWeight: 'bold'}}> {this.state.titlebox}</p>
                    <div><input type="tel" className="inputbox" maxLength="25" placeholder="卡号（请确认已开通网上银行）"></input></div>
                    <div><input type="password" className="inputbox" maxLength="30" placeholder="密码（6-30位数字字母组合）"></input></div>
                    <Button type="primary" className={style.compostbtn} onClick={this.secondPhoneCode}>登录</Button>
                  </div> */}
                  {/* 图形验证码 */}
                  {/* <div>
                    <p className={"tl "+style.titlebox} style={{ fontWeight: 'bold'}}> {this.state.titlebox}</p>
                    <br/>
                    
                    <div className="relative"><input type="tel" className="inputbox" maxLength="8"></input> 
                      <div className={style.imgcode}>
                        图片验证码
                        <img src={}/> 
                      </div>
                    </div>
                    <Button type="primary" className={style.compostbtn} onClick={this.secondPhoneCode} >确认</Button>
                  </div> */}
                </Modals>
              ) : null}
              <div onClick={this.Hrefpage} className={style.btnadd} >
                <div>添加积分账户 <img src={addicon} alt="" className={style.iconbox} /></div>
              </div>
              {/* <Button onClick={this.Hrefpage} className={style.btnadd} type="primary" icon={<img src={addicon} alt="" />}>添加积分账户</Button> */}
              {this.state.isLoadData ?
                <div className={style.boxshow_}>
                  <div className={style.titlebox}><b className={style.radiusbox}></b>银行</div>
                  <ul className={this.state.downAdd ? style.heightauto + " list " + style.ulbox : style.ulbox}>
                    {
                      this.state.banklist.map((item, index) => {
                        return (
                          <SwipeAction
                            key={index}
                            autoClose
                            right={[
                              {
                                text: '删除',
                                onPress: () => {
                                  const alert = Modal.alert;
                                  alert('提示', '是否确认删除', [
                                    { text: '取消' },
                                    {
                                      text: '确认', onPress: () => {
                                        removeAccountApi(item.id).then(res => {
                                          if (res.success) {
                                            this.getAccountlist()
                                            Toast.success('删除成功', 1.2)
                                          } else {
                                            Toast.fail(res.msg || '删除失败，请稍后再试', 1.5)
                                          }
                                        })
                                      }
                                    },
                                  ])

                                },
                                style: { backgroundColor: '#f56e5c', color: 'white' },
                              },
                            ]}
                          >
                            <li className='flex-between'>
                              <div>
                                <Link to={'/pointsDetails?userId=' + item.userId + "&shortNumber=" + item.shortNumber + "&accountOptionId=" + item.accountOptionId + "&accountNumber=" + item.accountNumber} className='flex' >
                                  <div className={style.iconbank}>
                                    <img src={projectImgs[Number(item.accountOptionId - 1)]} alt="" />
                                  </div>
                                  <cite>
                                    <div className={'block  ' + style.marb}>{item.accountOptionName}</div>
                                    <div className='block'>信用卡{item.shortNumber ? '(' + item.shortNumber + ')' : ''}</div>
                                  </cite>
                                </Link>
                              </div>
                              <div className={style.rightboxdetails}>
                                <div className={'block tr ' + style.marb}>{parseInt(item.currentIntegral)}分</div>
                                {
                                  item.isMaintain.indexOf(String(item.accountOptionId)) >= 0 ?
                                    <div className={"tr " + style.grayfont} onClick={this.maintainF}>维护中</div> :
                                    <div className={'block fr  clears ' + style.btnStyle} onClick={(e) => this.Synchronize(e, index, item)} id={'Btn_' + index}>同步积分</div>
                                }
                                {/* {+this.state.isMaintain[0] === item.accountOptionId ? 
                        // 现在版本
                        <div className={"tr "+style.grayfont} onClick={this.maintainF}>维护中</div> : 
                          <div className={'block fr  clears '+style.btnStyle} onClick={(e) => this.Synchronize(e,index,item)} id={'Btn_'+index}>同步积分</div>
                        } */}

                              </div>
                            </li>
                          </SwipeAction>
                        )
                      })
                    }
                  </ul>
                  <center>
                    {/* 数据多于三条才显示 */}
                    {this.state.banklist.length > 3 ?
                      <div className={style.downmore} onClick={this.addmore}>
                        {
                          this.state.downAdd ? (<img src={down_icon} alt="downbox" id="downImg" />) : (<img src={down_icon} alt="downbox" className={style.downmore_img} id="downImg" />)
                        }
                      </div>
                      : ''}
                  </center>
                </div> : null
              }
              <Footer></Footer>
            </div>
          </main>
          : <Loadingbox></Loadingbox>}
      </div>
      </DocumentTitle>
    )
  }
}