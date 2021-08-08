import * as TYPES from '../TYPES'

const targetPostIdReducer = (state = null, action: TAction) => {
  switch (action.type) {
    case TYPES.SET_TARGET_POST_ID:
      return action.payload
    default:
      return state
  }
}

export default targetPostIdReducer
