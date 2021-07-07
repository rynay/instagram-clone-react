import * as TYPES from '../TYPES';

const targetUserNameReducer = (
  state = null,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case TYPES.SET_TARGET_USERNAME:
      return action.payload;
    default:
      return state;
  }
};

export default targetUserNameReducer;
