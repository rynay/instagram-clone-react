import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  value: null as TFormattedPost[] | null,
}

const dashboardPostsSlice = createSlice({
  name: 'dashboardPosts',
  initialState,
  reducers: {
    setDashboardPosts: (
      state,
      action: PayloadAction<typeof initialState['value']>
    ) => {
      state.value = action.payload
    },
  },
})

export const { setDashboardPosts } = dashboardPostsSlice.actions

export default dashboardPostsSlice.reducer
