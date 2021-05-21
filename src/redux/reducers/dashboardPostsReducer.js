import * as TYPES from '../TYPES';

const dashboardPostsReducer = (state = null, action) => {
  switch (action.type) {
    case TYPES.SET_DASHBOARD_POSTS:
      return action.payload;
    default:
      return state;
  }
};

export default dashboardPostsReducer;
