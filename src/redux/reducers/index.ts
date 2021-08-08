import { combineReducers } from 'redux'
import currentUserReducer from './currentUserReducer'
import targetUserReducer from './targetUserReducer'
import suggestionsReducer from './suggestionsReducer'
import dashboardPostsReducer from './dashboardPostsReducer'
import targetPostIdReducer from './targetPostIdReducer'
import photoUploadingReducer from './photoUploadingReducer'

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  targetUser: targetUserReducer,
  suggestions: suggestionsReducer,
  dashboardPosts: dashboardPostsReducer,
  targetPostId: targetPostIdReducer,
  photoUploading: photoUploadingReducer,
})

export default rootReducer
