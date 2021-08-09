import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TPost[] | null

const dashboardPostsSlice = createSlice({
  name: 'dashboardPosts',
  initialState,
  reducers: {
    setDashboardPosts: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setDashboardPosts } = dashboardPostsSlice.actions

export default dashboardPostsSlice.reducer
