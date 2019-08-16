import {
  createStore,
  applyMiddleware,
} from 'redux'

import {persistStore, persistReducer} from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk'
import reducerF from './reducer/index';
import { createLogger } from 'redux-logger'
// const loggerMiddleware = createLogger()

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2 // 查看 'Merge Process' 部分的具体情况
};
const myPersistReducer = persistReducer(persistConfig, reducerF)

// , loggerMiddleware
let store = createStore(myPersistReducer,applyMiddleware(thunk));//传入reducer
// let store = createStore(reducerF,applyMiddleware(thunk , loggerMiddleware));//传入reducer

// 初始化
export const persistor = persistStore(store)
export default store;