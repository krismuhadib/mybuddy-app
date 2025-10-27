import { combineReducers } from 'redux';
import animalReducer from './animalReducers';
import tokenReducer from './tokenReducers';
import userReducer from './userReducers';
import postReducer from './postReducers';


const reduxApp = combineReducers({
  token: tokenReducer,
  user: userReducer,
  animal: animalReducer,
  post: postReducer,
  //todos
})

export default reduxApp;