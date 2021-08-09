import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TUser | null

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    // @ts-ignore
    setCurrentUser: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setCurrentUser } = currentUserSlice.actions

export default currentUserSlice.reducer
