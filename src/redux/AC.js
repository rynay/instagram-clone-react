// import 'firebase/firestore';
// import 'firebase/auth';

import { firebase } from '../lib/firebase';
import * as firebaseService from '../services/firebase';
import * as TYPES from './TYPES';

// export const setCurrentUser = (user) => ({
//   type: TYPES.SET_CURRENT_USER,
//   payload: {
//     ...user.data(),
//     docId: user.uid,
//   },
// });

export const setCurrentUserListener = () => (dispatch, getState) => {
  const userListener = firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      dispatch({
        type: TYPES.SET_CURRENT_USER,
        payload: null,
      });
      dispatch({
        type: TYPES.SET_DASHBOARD_POSTS,
        payload: null,
      });
      dispatch({
        type: TYPES.SET_SUGGESTIONS,
        payload: null,
      });
      return;
    }
    firebaseService.getUserInfoByEmail(user.email).then((userInfo) => {
      dispatch({
        type: TYPES.SET_CURRENT_USER,
        payload: {
          ...userInfo,
          docId: user.uid,
        },
      });
      dispatch(setDashboardPosts());
      dispatch(setSuggestions());
    });
  });

  return userListener;
};

export const setTargetUserListenerById = (id) => (dispatch) => {
  let targetUserDocId;
  firebaseService.getUserInfo(id).then((userInfo) => {
    targetUserDocId = userInfo.docId;
  });

  const targetUserListener = firebase
    .firestore()
    .collection('users')
    .doc(targetUserDocId)
    .onSnapshot((snapshot) => {
      dispatch({
        type: TYPES.SET_TARGET_USER,
        payload: snapshot,
      });
    });

  return targetUserListener;
};

const setDashboardPosts = () => (dispatch, getState) => {
  const { following } = getState().currentUser;
  firebaseService.getFollowingPosts(following).then((posts) => {
    dispatch({
      type: TYPES.SET_DASHBOARD_POSTS,
      payload: posts,
    });
  });
};

const setSuggestions = () => (dispatch, getState) => {
  const { userId } = getState().currentUser;
  firebaseService.getSuggestions(userId).then((suggestions) => {
    dispatch({
      type: TYPES.SET_SUGGESTIONS,
      payload: suggestions,
    });
  });
};
