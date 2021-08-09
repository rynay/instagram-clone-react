import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TFormattedPost[] | null

const dashboardPostsSlice = createSlice({
  name: 'dashboardPosts',
  initialState,
  reducers: {
    // @ts-ignore
    setDashboardPosts: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setDashboardPosts } = dashboardPostsSlice.actions

export default dashboardPostsSlice.reducer
