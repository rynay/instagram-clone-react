import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TPost['photoId'] | null

const targetPostIdSlice = createSlice({
  name: 'targetPostId',
  initialState,
  reducers: {
    // @ts-ignore
    setTargetPostId: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setTargetPostId } = targetPostIdSlice.actions
export default targetPostIdSlice.reducer
