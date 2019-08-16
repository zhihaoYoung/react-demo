import React , { Component } from 'react';
import style from './index.scss'

import DocumentTitle from 'react-document-title'
import error404 from '../../assets/404.png'
// import classnames from 'classnames'

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
        <DocumentTitle title="页面丢失啦">
          <div className={style.main}>
            <div className={style.postioncenter}>
              <div className={style.imgerror}>
                <img src={error404} alt="error404"  />
              </div>
              <p>抱歉，页面丢失了</p>
              <a href="/">返回首页</a>
            </div>
          </div>
        </DocumentTitle>
      )
    }
}
