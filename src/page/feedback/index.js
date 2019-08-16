import React , { Component } from 'react';
import style from './index.scss'
import { Button , Toast } from 'antd-mobile';
import DocumentTitle from 'react-document-title'
import { feedbackApi } from '../../api/index'
import { HtmlEncode } from '../../utils/filter'
import Header from '../../components/header/index'

export default class feedback extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = { 
      centerbox: '' ,
      disabled: false
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
  postData = () =>{
    let _detail = HtmlEncode(this.state.centerbox)
    if(!this.state.centerbox){
      Toast.fail('内容不能为空', 2)
      return false
    }else if(this.state.centerbox.length <= 6){
      Toast.fail('您的意见很宝贵，请输入大于6位文字', 2)
      return false
    }
    this.setState({
      disabled: true
    })
    feedbackApi({detail:_detail}).then(res=>{
      if(res.success){
        Toast.success('感谢您的反馈', 1)
        setTimeout(()=>{
          this.props.history.push('/person');
        },1000)
      }else{
        this.setState({ disabled: false })
        Toast.success(res.msg, 1)
        return false
      }
    })
  }

  handleGetInputValue = (event) => {
    switch (event.target.name) {
      case "centerbox":
        this.setState({
          centerbox: event.target.value,
        })
        break;
      default:
        break;
    }
  }

  render () {
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
      return (
        <DocumentTitle title="意见反馈">
          <div className={style.main}>
            <Header title="意见反馈"></Header>
            <div className={style.formbox}>
              <form>
                <cite className="block">
                  <textarea className={style.inputbox + ' ' + style.textareabox} placeholder="请输入您的宝贵意见 ......" name="centerbox" value={this.state.centerbox} onChange={this.handleGetInputValue}>
                  </textarea>
                </cite>
                <Button type="primary" className={style.buttonbox} onClick={this.postData} loading={this.state.disabled} disabled={this.state.disabled} >提交</Button>
              </form>
            </div>
          </div>
        </DocumentTitle>
      )
    }
}
