import messageReducer from './recieveMessage';
import userNameReducer from './setUserName'
// import setMessageReducer from './setMessage'
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    groupMessage: messageReducer,
    userName: userNameReducer,
    // messageText: setMessageReducer
})
export default rootReducer;