let initState = {
  initStatebox: 'state初始化',
  todos: []
};

let ADD_TODO = 'ADD_TODO'
let UPDATA_TODO = 'UPDATA_TODO'

let newState = {}
function reducerF(state = initState, action) {
  switch (action.type) {
    case ADD_TODO:
      newState = {
        initStatebox: action.payload,
        todos: state.todos.map(item => {
            if (item.title === '学习node') {
              item.isComplete = !item.isComplete;
            }
            return item;
          })
      };
      break;
    case UPDATA_TODO:
      
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}

export default reducerF;