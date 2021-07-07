import * as TYPES from '../TYPES';

const targetPostIdReducer = (
  state = null,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case TYPES.SET_TARGET_POST_ID:
      return action.payload;
    default:
      return state;
  }
};

export default targetPostIdReducer;
