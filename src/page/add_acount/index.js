import React , { Component } from 'react';
import  style from './index.scss'
import { Icon , Toast} from 'antd-mobile';
import { Link } from 'react-router-dom'
import { getAccountOptionListApi } from '../../api/index'
import Header from '../../components/header/index'
import DocumentTitle from 'react-document-title'

export default class addAcount extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = { 
      phone: '' ,
      password : '',
      disabled: false,
      imglist:[],
      banklist:[],
      // 是否在维护中
      _isMaintain: ''
    }
    // this.handleGetInputValue = handleGetInputValue.bind(this) // mixin
  }
  componentWillUnmount() {
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
  }
  componentDidMount() {
    this.state._isMaintain = this.props.location.state.isMaintain
    if(document.querySelector('div[id^="am-modal-container"]')){
      document.querySelector('div[id^="am-modal-container"]').innerHTML=''
    }
    let _than = this
    // 暂且写死1 （银行）
    getAccountOptionListApi(1).then(res=>{
      if (!res.success) {
        Toast.fail(res.msg || '网络繁忙，请稍后再试', 1)
        return false
      } else {
        let resArr = res.result
        for(let i in resArr){
          resArr[i].isMaintain = this.state._isMaintain
        }
        _than.setState({
          banklist: resArr
        },() =>{
        })
      }
    })
  }
  render () {
    const requireContext = require.context("../../assets/banklist/",true, /^\.\/.*\.png$/)
    const projectImgs = requireContext.keys().map(requireContext)
    return (
      <DocumentTitle title="添加积分账户">
      <div className={style.main}>
        <Header title="添加积分账户"></Header>
        <ul className={style.ulbox}>
          {
            this.state.banklist.map((item,index)=>{
              return(
                <div key={index} className={style.borderbottom}>
                  {item.isMaintain.indexOf(String(item.id)) >= 0  ?
                      <li className={"flex-between "+style.libox} ><div><div className={style.imgCenter}><img src={projectImgs[item.id-1]} alt=""/></div>
                        {item.accountOptionName} 
                        <b>( 维护中 )</b>
                        </div>
                        <Icon type={"right"} color="#DDDDDD"></Icon>
                      </li>
                  : <Link to={ {pathname:`/bankLogin`,state:{code:item.id,name:item.accountOptionName,icon:item.icon} } } key={index}>
                      <li className={"flex-between "+style.libox} ><div><div className={style.imgCenter}><img src={projectImgs[item.id-1]} alt=""/></div>
                        {item.accountOptionName}  
                        </div>
                        <Icon type={"right"} color="#DDDDDD"></Icon>
                      </li>
                    </Link> }
                </div>
              )
            })
          }
        </ul>
      </div>
      </DocumentTitle>
    )
  }
}