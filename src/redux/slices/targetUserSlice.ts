import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  value: null as TUser | null,
}

const targetUserSlice = createSlice({
  name: 'targetUser',
  initialState,
  reducers: {
    setTargetUser: (
      state,
      action: PayloadAction<typeof initialState['value']>
    ) => {
      state.value = action.payload
    },
  },
})

export const { setTargetUser } = targetUserSlice.actions
export default targetUserSlice.reducer
