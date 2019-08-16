import React from 'react';
import './App.css'
// import Home from './page/home/index'


import {BrowserRouter, Route,Switch} from 'react-router-dom'
import {Provider} from 'react-redux';
import store from './store/index';
import asyncComponent from "./components/asyncComponent"

const Home = asyncComponent(() => import("./page/home/index"))
const Login = asyncComponent(() => import( './page/login/index'))
const Register = asyncComponent(() => import( './page/register/index'))
const resetPassword = asyncComponent(() => import( './page/reset_password/index'))
const feedback = asyncComponent(() => import( './page/feedback/index'))
const bankLogin = asyncComponent(() => import( './page/bank_login/index'))
const commonProblem = asyncComponent(() => import( './page/common_problem/index'))
const Bill = asyncComponent(() => import( './page/bill/index'))
const addAcount = asyncComponent(() => import( './page/add_acount/index'))
const pointsDetails = asyncComponent(() => import( './page/points_details/index'))
const Person = asyncComponent(() => import( './page/person/index'))
const Terms = asyncComponent(() => import( './page/terms/index'))
const ErrorPage = asyncComponent(() => import( './page/error_page/index'))


function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/bankLogin' component={bankLogin} />
            <Route path='/resetPassword' component={resetPassword} />
            <Route path='/bill' component={Bill} />
            <Route path='/addacount' component={addAcount} />
            <Route path='/commonProblem' component={commonProblem} />
            <Route path='/feedback' component={feedback} />
            <Route path='/pointsDetails' component={pointsDetails} />
            <Route path='/person' component={Person} />
            <Route path='/register' component={Register} />
            <Route path='/index' component={Home}/>
            <Route path='/terms' component={Terms}/>
            <Route path='/' exact  component={Home}/>
            <Route component={ErrorPage}></Route>
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
