import React , { Component } from 'react';
import style from './index.scss'


export default class Modals extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = { 
     title_: this.props.title
    }
  }

  render () {
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
      return (
        <div className={style.main}>
          {/* 关闭按钮 */}
          {/* 阴影 */}
          <div className={style.shadow}></div>
          {/* 内容 */}
          <div className={style.centerbox}>
            <div className={style.closeBtn} onClick={this.props.handleVal.bind(this,false)}>
              <b></b>
            </div>
            {this.props.children}
          </div>
        </div>
      )
    }
}