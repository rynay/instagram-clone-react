import * as TYPES from '../TYPES';

const currentUserReducer = (
  state = null,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case TYPES.SET_CURRENT_USER:
      return action.payload || null;
    default:
      return state;
  }
};
export default currentUserReducer;
