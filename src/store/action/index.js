// import axios from 'axios'

const ADD_TODO = 'ADD_TODO'
const UPDATA_TODO = 'UPDATA_TODO'

// axios.post('https://api.apiopen.top/musicRankings',function(res){
//       console.log(123)
//     },'json')

let actions = {
  addTodo: function(payload) {
    return {
      type: ADD_TODO,
      payload,
      receivedAt: Date.now()
    }
  },
  updataTodo: function(payload) {
    return {
      type: UPDATA_TODO,
      payload,
      receivedAt: '哈哈'
    }
  }
};



export const  fetchPosts = (subreddit)=> {
  return dispatch => {
    // setTimeout(()=>{
    //   dispatch({type: ADD_TODO, subreddit, payload: '接下来准备发起请求'})
    // },2000)
    console.log("请求中。。。")
  }
}
