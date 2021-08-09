import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  error: null as string | null,
  isPhotoUploading: null as boolean | null,
}

const photoUploadingSlice = createSlice({
  name: 'photoUploading',
  initialState,
  reducers: {
    setIsPhotoUploading: (
      state,
      action: PayloadAction<typeof initialState['isPhotoUploading']>
    ) => {
      state.isPhotoUploading = action.payload
    },
    setUploadError: (
      state,
      action: PayloadAction<typeof initialState['error']>
    ) => {
      state.error = action.payload
    },
  },
})

export const {
  setIsPhotoUploading,
  setUploadError,
} = photoUploadingSlice.actions

export default photoUploadingSlice.reducer
