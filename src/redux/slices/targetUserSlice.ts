import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TUser | null

const targetUserSlice = createSlice({
  name: 'targetUser',
  initialState,
  reducers: {
    // @ts-ignore
    setTargetUser: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setTargetUser } = targetUserSlice.actions
export default targetUserSlice.reducer
