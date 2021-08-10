import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  value: null as TUser | null,
}

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<typeof initialState['value']>
    ) => {
      state.value = action.payload
    },
  },
})

export const { setCurrentUser } = currentUserSlice.actions

export default currentUserSlice.reducer
