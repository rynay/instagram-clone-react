import { combineReducers } from 'redux';
import currentUserReducer from './currentUserReducer';
import targetUserReducer from './targetUserReducer';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  targetUser: targetUserReducer,
});

export default rootReducer;
