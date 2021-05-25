import * as TYPES from '../TYPES';

const currentUserReducer = (state = null, action) => {
  switch (action.type) {
    case TYPES.SET_CURRENT_USER:
      return action.payload || null;
    default:
      return state;
  }
};
export default currentUserReducer;
