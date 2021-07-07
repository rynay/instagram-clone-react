import * as TYPES from '../TYPES';

const suggestionsReducer = (
  state = null,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case TYPES.SET_SUGGESTIONS:
      return action.payload;
    default:
      return state;
  }
};

export default suggestionsReducer;
