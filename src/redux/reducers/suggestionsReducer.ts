import * as TYPES from '../TYPES'

const suggestionsReducer = (state = null, action: TAction) => {
  switch (action.type) {
    case TYPES.SET_SUGGESTIONS:
      return action.payload
    default:
      return state
  }
}

export default suggestionsReducer
