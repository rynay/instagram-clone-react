import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = null as TUser[] | null

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setSuggestions: (state, action: PayloadAction<typeof initialState>) => {
      state = action.payload
    },
  },
})

export const { setSuggestions } = suggestionsSlice.actions
export default suggestionsSlice.reducer
