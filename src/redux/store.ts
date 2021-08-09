import currentUser from './slices/currentUserSlice'
import targetUser from './slices/targetUserSlice'
import suggestions from './slices/suggestionsSlice'
import dashboardPosts from './slices/dashboardPostsSlice'
import targetPostId from './slices/targetPostIdSlice'
import photoUploading from './slices/photoUploadingSlice'
import targetUsername from './slices/targetUsernameSlice'

import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    currentUser,
    targetUser,
    suggestions,
    dashboardPosts,
    targetPostId,
    photoUploading,
    targetUsername,
  },
})

export type RootStore = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
