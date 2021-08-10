import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  value: null as TPost['photoId'] | null,
}

const targetPostIdSlice = createSlice({
  name: 'targetPostId',
  initialState,
  reducers: {
    setTargetPostId: (
      state,
      action: PayloadAction<typeof initialState['value']>
    ) => {
      state.value = action.payload
    },
  },
})

export const { setTargetPostId } = targetPostIdSlice.actions
export default targetPostIdSlice.reducer
