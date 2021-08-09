import currentUser from './reducers/currentUserReducer'
import targetUser from './reducers/targetUserReducer'
import suggestions from './reducers/suggestionsReducer'
import dashboardPosts from './reducers/dashboardPostsReducer'
import targetPostId from './reducers/targetPostIdReducer'
import photoUploading from './reducers/photoUploadingReducer'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    currentUser,
    targetUser,
    suggestions,
    dashboardPosts,
    targetPostId,
    photoUploading,
  },
})

export type RootStore = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
