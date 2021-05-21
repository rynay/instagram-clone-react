import { combineReducers } from 'redux';
import currentUserReducer from './currentUserReducer';
import targetUserReducer from './targetUserReducer';
import suggestionsReducer from './suggestionsReducer';
import dashboardPostsReducer from './dashboardPostsReducer';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  targetUser: targetUserReducer,
  suggestions: suggestionsReducer,
  dashboardPosts: dashboardPostsReducer,
});

export default rootReducer;
