import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TUser['username'] | null

const targetUsernameSlice = createSlice({
  name: 'targetUsername',
  initialState,
  reducers: {
    setTargetUsername: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setTargetUsername } = targetUsernameSlice.actions
export default targetUsernameSlice.reducer
