import React , { Component } from 'react';
import style from './index.scss'


export default class Header extends Component {
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
          <div>{this.state.title_}</div>
        </div>
      )
    }
}