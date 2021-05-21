import { combineReducers } from 'redux';
import currentUserReducer from './currentUserReducer';
import targetUserReducer from './targetUserReducer';
import suggestionsReducer from './suggestionsReducer';
import dashboardReducer from './dashboardReducer';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  targetUser: targetUserReducer,
  suggestions: suggestionsReducer,
  dashboardPosts: dashboardPostsReducer,
});

export default rootReducer;
