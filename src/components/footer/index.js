import React , { Component } from 'react';
import { Link , withRouter} from 'react-router-dom'
import style from './index.scss'
import homeicon from '../../assets/home_icon.png'
import bill_icon from '../../assets/bill_icon.png'
import me_icon from '../../assets/me_icon.png'
import me_icon_active from '../../assets/me_icon_active.png'
import home_icon_active from '../../assets/home_icon_active.png'
import bill_icon_active from '../../assets/bill_icon_active.png'


class Footer extends Component {
  constructor (props) {
    super(props)
    // P.S: 仅能在构造函数中设置 state
    // 在其他地方绝不能使用 this.state.XXX = XXX
    // 只能使用 this.setState({ XXX: XXX })
    this.state = { 
      phone: '' ,
      password : '',
      disabled: false,
      _path: this.props.match.path.replace('/','')
    }
  }
  billPage = () =>{
    if(localStorage.getItem('token')){
      this.props.history.push('/bill');
    }else{
      this.props.history.push('/login');
    }
  }
  render () {
    /* 由于 ES6 中 React 不会自动绑定this，直接 onSubmit={this.handleSubmit} 会报错
      详情请参考 https://facebook.github.io/react/docs/reusable-components.html#no-autobinding */
      return (
        <div className={style.main}>
          <div className={"flex-around "+style.footerbox}>
            <Link to="/index">
              <div className={this.state._path === 'index' ||  this.state._path === '' ? style.active: ''}>
                <div className={style.iconbox}><img src={this.state._path === 'index' ||  this.state._path === '' ? home_icon_active: homeicon } alt="index"/></div>
                <div>首页</div>
              </div>
            </Link>
              <div className={this.state._path === 'bill' ? style.active: ''} onClick={this.billPage}>
              <div className={style.iconbox}><img src={this.state._path === 'bill' ? bill_icon_active: bill_icon } alt="Bill"/></div>
                <div>账单</div>
              </div>
            <Link to="/person">
                <div className={this.state._path === 'person' ? style.active: ''}>
                  <div className={style.iconbox}><img  src={this.state._path === 'person' ? me_icon_active: me_icon } alt="me"/></div>
                <div>我的</div>
              </div>
            </Link>
          </div>
        </div>
      )
    }
}
export default withRouter(Footer);