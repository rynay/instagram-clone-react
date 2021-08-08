import * as TYPES from '../TYPES'

const targetUserReducer = (state = null, action: TAction) => {
  switch (action.type) {
    case TYPES.SET_TARGET_USER:
      return action.payload
    default:
      return state
  }
}

export default targetUserReducer
