import * as TYPES from '../TYPES';

const initialState = {
  error: null,
  isPhotoUploading: null,
};

const photoUploadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.SET_IS_PHOTO_UPLOADING:
      return {
        ...state,
        isPhotoUploading: action.payload,
      };

    case TYPES.SET_UPLOAD_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default photoUploadingReducer;
