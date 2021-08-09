import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TUser | null

const targetUserSlice = createSlice({
  name: 'targetUser',
  initialState,
  reducers: {
    setTargetUser: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setTargetUser } = targetUserSlice.actions
export default targetUserSlice.reducer
