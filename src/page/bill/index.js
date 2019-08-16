import React, { Component } from 'react';
import style from './index.scss'
import ReactHighcharts from 'react-highcharts';
import Footer from '../../components/footer/index'
import Header from '../../components/header/index'
import Loadingbox from '../../components/loading/index'
import bill_details from '../../assets/bill_details.png'
import filter_icon from '../../assets/filter_icon.png'
import bill_nodata from '../../assets/bill_nodata.png'
import addicon from '../../assets/add-icon.png'
import DocumentTitle from 'react-document-title'
import { timeOr } from '../../utils/filter'
import {  screenAccountDetailApi, getAccountListApi, getMaintenanceAccountApi } from '../../api/index'

export default class Bill extends Component {
  constructor(props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = {
      // 账单的图片默认值
      initImgicon : 0,
      // 数据是否全部加载完毕
      isAllData: false,
      classFont: '选择分类',
      filterShow: false,
      phone: '',
      password: '',
      disabled: false,
      // 账单暂无数据
      billDetails: false,
      // 数据可视化
      dataView: [],
      // 首个银行数据
      firstBank: JSON.parse(sessionStorage.getItem('firstBank')) || '',
      yearbox: new Date().getFullYear(),
      // yearbox: 2018,
      // 选中的年份
      ischeckTime: 1,
      // 是否加载完数据
      isLoadData: false,
      // 当年的详情
      yearDetails: [],
      // 银行第一个下拉
      firstlist: true,
      secondlist: true,
      noAccount: false,
      resData: '',
      // 筛选银行名称
      bankListName: [],
      // 默认选择第一个银行
      ischcheckAccount: 0,
      // 选择银行的参数
      bankdetils: '',
      // 总数
      acountNumber_: 0,
      // 是否在维护中
      ismainTain: []
    }
    // this.handleGetInputValue = handleGetInputValue.bind(this) // mixin
  }
  // 重置
  restDataF = () => {
    document.body.style.overflow = 'auto'
    this.setState({
      ischeckTime: 1,
      yearbox: new Date().getFullYear(),
      billDetails: false,
      filterShow: false
    },()=>{
      this.initViewData()
    })
  }
  // 初始化数据
  initViewData = (firstInit) => {
    let { accountNumber, shortNumber, accountOptionId } = firstInit || this.state.bankdetils
    document.body.style.overflow = 'auto'
    let postData = {
      accountOptionId: accountOptionId,
      accountNumber: accountNumber,
      shortNumber: shortNumber,
      year: this.state.yearbox
    }
    screenAccountDetailApi(postData).then(res => {
      let resData_ = res.result
      // 重新数组
      let newArr = [], _monthlist = []
      // 当前年份（不满12个月）
      let isyeararr = []
      if (res.success) {
        // 无数据
        if (res.result.integralDetail.length <= 0) {
          this.setState({
            initImgicon: res.result.accountOptionId,
            dataView: [],
            yearDetails: resData_.integralDetail,
            billDetails: true,
            filterShow: false,
          })
          return false
        }
        let _resData = res.result
        let acountNumber = 0
        // 总积分
        for (let i in res.result.integralDetail) {
          // 暂且全部为正
          // if(resData_.integralDetail[i].month)
          acountNumber += Number(res.result.integralDetail[i].pointByMonth)
          _monthlist.push({ month: resData_.integralDetail[i].month, currentIntegral_: resData_.integralDetail[i].pointByMonth })
        }
        console.log(_monthlist)
        this.setState({
          initImgicon: res.result.accountOptionId,
          resData: resData_,
          acountNumber_: acountNumber
        })
        let _monthed = []
        for (let b in _monthlist) {
          _monthed.push(_monthlist[b].month)
        }


        let CalculationArr = []
        // 判断是否是满12个月
        // if(_monthlist[0].month < 12){
        // 判断是否是当前年份 （如果不是 ，且不满12个月 ，则加满12个月）
        if (resData_.integralDetail[0].year < new Date().getFullYear()) {
          // 之前的年份满12个月的(加满它)
          for (let n = 13; n--; n <= 1) {
            if (n > 0) {
              if (_monthed.indexOf(String(n)) >= 0) {
                for (let bs in _monthlist) {
                  if (+_monthlist[bs].month === n) {
                    newArr.push([resData_.integralDetail[0].year + "/" + n + '/01 00:00:00', _monthlist[bs].currentIntegral_])
                  }
                }
              }
              else {
                newArr.push([resData_.integralDetail[0].year + "/" + n + '/01 00:00:00', 0])
              }
            }
          }
          // console.log(newArr)
          // 未满12个月 = (这里考虑调整)
          if (_monthlist[0].month < 12) {
            let initAccount = acountNumber;
            for (let i in newArr) {
              if (newArr[(+i + 1)] !== undefined) {
                let acountNumber_ = initAccount - (+newArr[i][1])
                CalculationArr.push([new Date(newArr[+i+1][0]).getTime(),acountNumber_])
                // CalculationArr.push([newArr[+i + 1][0], acountNumber_])
                initAccount = acountNumber_
              }
            }
            CalculationArr.unshift([new Date(resData_.integralDetail[0].year + "/" + _resData.integralDetail[0].month + '/01 00:00:00').getTime(), +acountNumber])
          } else {
            // for (let i = (+_monthlist[0].month + 2); i <= 12; i++) {
            //   CalculationArr.push([new Date(resData_.integralDetail[0].year + "/" + i + '/01 00:00:00').getTime(), acountNumber])
            // }
            // 满了12个月
            CalculationArr.push([new Date(resData_.integralDetail[0].year + "/" + 12 + '/01 00:00:00').getTime(), acountNumber])
            // CalculationArr.push([resData_.integralDetail[0].year+"/"+12+'/01 00:00:00',acountNumber])
            for (let i in newArr) {
              if (newArr[(+i + 1)] !== undefined) {
                let acountNumber_ = acountNumber - (+newArr[i][1])
                CalculationArr.push([new Date(newArr[+i + 1][0]).getTime(), acountNumber_])
                // CalculationArr.push([newArr[+i+1][0],acountNumber_])
                acountNumber = acountNumber_
              }
            }
          }
        } else {
          // 是当前年份（但不加满12个月，只显示最大值）
          let _currentIntegral = _resData.currentIntegral
          // 当前的年份未满12个月的
          isyeararr.push([resData_.integralDetail[0].year + "/" + _monthlist[0].month + '/01 00:00:00', _monthlist[0].currentIntegral_])
          for (let i = (+_monthlist[0].month); i--; i <= 1) {
            if (i > 0) {
              if (_monthed.indexOf(String(i)) >= 0) {
                for (let _i in _monthlist) {
                  if (i === (+_monthlist[_i].month)) {
                    isyeararr.push([resData_.integralDetail[0].year + "/" + i + '/01 00:00:00', _monthlist[_i].currentIntegral_])
                  }
                }
              } else {
                isyeararr.push([resData_.integralDetail[0].year + "/" + i + '/01 00:00:00', 0])
              }
            }
          }
          // 因为是当前年 ， 所以取 直接 currentIntegral 字段
          let currentIntegral_ = _resData.currentIntegral
          for (let i in isyeararr) {
            // if (isyeararr[(+i + 1)] !== undefined) {
            //   let acountNumber_ = acountNumber - (+isyeararr[i][1])
            //   CalculationArr.push([new Date(isyeararr[+i + 1][0]).getTime(), acountNumber_])
            //   acountNumber = acountNumber_
            // }
            if (isyeararr[(+i + 1)] !== undefined) {
              let acountNumber_ = currentIntegral_ - (+isyeararr[i][1])
              CalculationArr.push([new Date(isyeararr[+i+1][0]).getTime(), acountNumber_])
              currentIntegral_ = acountNumber_
            }
          }
          CalculationArr.unshift([new Date(resData_.integralDetail[0].year + "/" + _resData.integralDetail[0].month + '/01 00:00:00').getTime(), +_currentIntegral])
        }
       
        if (CalculationArr.length > 0) {
          this.setState({
            billDetails: false,
            dataView: CalculationArr,
            yearDetails: resData_.integralDetail,
            filterShow: false,
          })
        }
      }
    })
  }
  // 筛选确认
  filterBtn = () => {
    this.initViewData()
  }
  // 选中分类
  SelectClass = (details) => {
    this.setState({
      classFont: details
    })
  }
  // 显示筛选框
  showFilterbox = () => {
    document.body.style.overflow = 'hidden'
    this.setState({
      filterShow: true,
    })
  }
  timeSelect = (e, timeyear, index) => {
    this.setState({
      yearbox: timeyear,
      ischeckTime: index
      // filterShow: false
    })
  }
  // 收缩下拉
  hideClassF = (_argmes) => {
    if (_argmes === 'first') {
      this.setState({
        firstlist: !this.state.firstlist
      })
    } else if (_argmes === 'second') {
      this.setState({
        secondlist: !this.state.secondlist
      })
    }
  }
  // 账户筛选
  AccountSelect = (item, index) => {
    this.setState({
      bankdetils: item,
      ischcheckAccount: index
    })
  }
  componentWillUnmount() {
    if (document.querySelector('div[id^="am-modal-container"]')) {
      document.querySelector('div[id^="am-modal-container"]').innerHTML = ''
    }
  }
  componentDidMount() {
    if (document.querySelector('div[id^="am-modal-container"]')) {
      document.querySelector('div[id^="am-modal-container"]').innerHTML = ''
    }
    // 初始化数据列表
    this.loadDatalist()
    // 筛选名称获取
    this.getAccountListApiF()
  }
  getMaintenanceAccountF = () => {
    // 暂且写死1~ 因为为银行
    getMaintenanceAccountApi(1).then(res => {
      if (res.success) {
        this.setState({
          ismainTain: res.result === null ? [] : res.result
        })

      }
    })
  }
  getAccountListApiF = () => {
    getAccountListApi().then(res => {
      let resData = res.result
      if (res.success) {
        this.setState({
          bankdetils: resData[0],
          bankListName: resData
        })
      }
    })
    this.getMaintenanceAccountF()
  }
  replacenumber = (val) => {
    let str_ = val.replace(/[3-]/g, ' ')
    return str_
  }

  // 添加积分账户
  Hrefpage = () => {
    if (localStorage.getItem('token')) {
      this.props.history.push({ pathname: '/addacount' }, { isMaintain: this.state.ismainTain });
    } else {
      this.props.history.push('/login');
    }
  }

  loadDatalist = () => {
    let firstBank = this.state.firstBank
    if (!firstBank) {
      this.setState({
        isAllData: true,
        noAccount: true
      })
      return false
    }
    let postData = {
      accountNumber: firstBank[0].accountNumber,
      accountOptionId: firstBank[0].accountOptionId,
      shortNumber: firstBank[0].shortNumber,
      userId: firstBank[0].userId,
      year: this.state.yearbox
    }
    this.initViewData(postData)
    this.setState({
      isLoadData: true,
      isAllData: true,
    })
  }
  render() {
    let than = this
    var config = {
      // logo去掉
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      chart: {
        zoomType: 'x',
        height: '250px',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: ''
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          '' : ''
      },

      xAxis: {
        // crosshair: true,
        tickInterval: 24 * 3600 * 30 * 1000,
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%m-%d',
          week: '%m-%d',
          month: '%m月',
          year: '%Y'
        },
        labels: {
          style: {
            fontSize: '8px' //字体
          }
        },
      },
      tooltip: {
        backgroundColor: '#4389FF',
        borderRadius: '5',
        borderColor: '#4389FF',
        style: { "color": "#fff", "fontSize": "12px" },
        formatter: function () {
          // let month_ = new Date(this.x).getMonth()+1
          // return new Date(this.x).getFullYear() +'年' + (month_ <=9? '0'+month_: month_ ) + '月</b> 积分:<b>' + this.y ;
          // return new Date(this.x).getFullYear() +'年' + (month_ <=9? '0'+month_: month_ ) + '月 总额:' + this.y+'分' ;
          return '总额:' + this.y + '分';
        }
      },
      yAxis: {
        min: 0,
        gridLineWidth: '0px',
        labels: {
          //去掉刻度数字
          enabled: false
        },
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, '#8AB6FF'],
              [1, '#fff']
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [{
        type: 'area',
        name: '积分',
        // data: than.state.dataView
        data: than.state.dataView.sort(function(val,index){
            if(val[0] < index[0]){
              return -1
            }
        })
      }]
    };
    const requireContext = require.context("../../assets/bankbill/", true, /^\.\/.*\.png$/)
    const projectImgs = requireContext.keys().map(requireContext)
    return (
      <DocumentTitle title="账单">
      <main>
        {!this.state.isAllData ?
          <Loadingbox></Loadingbox> :
          <div className={style.main}>
            {this.state.filterShow ? <div className={style.filterback}></div> : null}
            {/* 筛选 */}
            <div className={this.state.filterShow ? style.activeshowfilter + ' rel ' + style.flilerBox : style.flilerBox}>
              <div className={style.centerbox}>
                <div className={style.topTitle + " flex-around " + style.bggray}>
                  <div onClick={this.restDataF}>重置</div>
                  <div className={style.filterboxTitle}>筛选</div>
                  <div onClick={this.filterBtn}>确定</div>
                </div>
                {/* {this.state.classFont} */}
                {/* <div className={style.bggray+" relative "+style.banklist}>
                <b onClick={(e) => this.SelectClass('银行')}>银行</b>
              </div> */}
                <div className={style.classFont + " flex-between"} onClick={(e) => this.hideClassF('first')}><div>账户</div>
                  <div className={this.state.firstlist ? style.down_arrow : style.down_arrow + ' rel ' + style.resdown_arrow}></div>
                </div>
                {this.state.firstlist ?
                  <div className={style.marginboxlist + " rel " + style.bggray + " relative " + style.banklist}>
                    {this.state.bankListName.map((el, i) => {
                      return (
                        <b key={i} className={+this.state.ischcheckAccount === i ? style.Bactive : ''} onClick={(e) => this.AccountSelect(el, i)}>{el.accountOptionName}({el.shortNumber})</b>
                      )
                    })}
                    {/* <b className={style.Bactive}>{this.state.resData.accountOptionName}</b> */}
                  </div> : null
                }
                <div className={style.classFont + " flex-between"} onClick={(e) => this.hideClassF('second')}><div>选择时间</div><div className={this.state.secondlist ? style.down_arrow : style.down_arrow + ' rel ' + style.resdown_arrow}></div></div>
                {this.state.secondlist ?
                  <div className={style.bggray + " relative " + style.banklist}>
                    <b className={+this.state.ischeckTime === 1 ? style.Bactive : ''} onClick={(e) => this.timeSelect(e, 2019, 1)}>2019年</b>
                    <b className={+this.state.ischeckTime === 2 ? style.Bactive : ''} onClick={(e) => this.timeSelect(e, 2018, 2)}>2018年</b>
                    <b className={+this.state.ischeckTime === 3 ? style.Bactive : ''} onClick={(e) => this.timeSelect(e, 2017, 3)}>2017年</b>
                  </div> : null
                }
              </div>
            </div>
            <div className={style.marginbox}>
              <Header title="账单"></Header>
              {this.state.isLoadData ?
                <div>
                  <div className={style.reactbox}>
                    <div className={"flex-between " + style.searchbox}>
                      <div>
                        <div className="flex">
                          <div className={style.imgbox}>
                            <img src={projectImgs[+this.state.initImgicon-1]} alt="" />
                          </div>
                          <div className={style.bankboxlist}>
                            <p>{this.state.resData.accountOptionName}</p>
                            <p>{this.state.yearbox}年</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className={style.filter_box} onClick={this.showFilterbox}>筛选 <img src={filter_icon} alt="" /></p>
                      </div>
                    </div>

                    <ReactHighcharts config={config} />
                  </div>
                  <div className={style.memberbox + " rel " + style.fb}><img src={bill_details} className={style.icon_bill} alt="" /> 积分账单明细</div>
                </div>
                : null
              }
            </div>
            {this.state.billDetails ?
              <center className={style.noDatabox_}>
                <div className={style.datalist}>本年度暂无数据</div>
                <div className={style.divimg}>
                  <img src={bill_nodata} alt="" />
                </div>
                <p>暂无积分明细</p>
              </center> : null}
            {!this.state.isLoadData ?
              <div className="relative">
                <center className={style.noDatabox}>
                  <div className={style.divimg}>
                    <img src={bill_nodata} alt="" />
                  </div>
                  <p>暂无积分明细</p>
                  {this.state.noAccount ?
                    <div className={style.btnadd_} onClick={this.Hrefpage}>
                      <div>添加积分账户 <img src={addicon} alt="" className={style.iconbox} /></div>
                    </div>
                    : null}
                </center>
              </div>
              :
              <ul className={style.logul}>
                {
                  this.state.yearDetails.map((val, index) => {
                    return (
                      <li key={index} className={style.listli}>
                        <div className={"flex-between " + style.lifirstdiv}>
                          <span className={style.fb}>{val.month}月</span>
                          <span className={style.fb}>{val.pointByMonth}</span>
                        </div>
                        <div className={"flex-between " + style.liseconddiv}>
                          <span>{val.year}</span>
                          <span>当月积分详情</span>
                        </div>
                        {
                          val['detail'].map((val, index) => {
                            return (
                              <div key={index} className={"flex-between " + style.lithreediv}>
                                <span className={style.normalbox}>{timeOr(val.date)} <b> {this.replacenumber(val.type)}</b></span>
                                <span className={val.point >= 1 ? style.bluefont : style.redFont}>{val.point >= 1 ? '+' + val.point : val.point}</span>
                              </div>
                            )
                          })
                        }
                      </li>
                    )
                  })
                }
              </ul>
            }
            <Footer></Footer>
          </div>
        }
      </main>
      </DocumentTitle>
    )
  }
}