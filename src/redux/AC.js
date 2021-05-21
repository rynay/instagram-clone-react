import { firebase } from '../lib/firebase';
import * as firebaseService from '../services/firebase';
import * as TYPES from './TYPES';

export const setCurrentUserListener = () => (dispatch, getState) => {
  const userListener = firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      dispatch(setCurrentUser(null));
      dispatch(setDashboardPosts(null));
      dispatch(setSuggestions(null));
      return;
    }
    firebaseService.getUserInfoByEmail(user.email).then((userInfo) => {
      dispatch(
        setCurrentUser({
          ...userInfo,
          docId: user.uid,
        })
      );
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

export const logout = () => (dispatch) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(setCurrentUser(null));
      dispatch(setDashboardPosts(null));
      dispatch(setSuggestions(null));
    });
};

const setDashboardPosts = (data) => (dispatch, getState) => {
  if (data === null) {
    dispatch({
      type: TYPES.SET_DASHBOARD_POSTS,
      payload: data,
    });
    return;
  }
  const { following } = getState().currentUser;
  firebaseService.getFollowingPosts(following).then((posts) => {
    dispatch({
      type: TYPES.SET_DASHBOARD_POSTS,
      payload: posts,
    });
  });
};

const setSuggestions = (data) => (dispatch, getState) => {
  if (data === null) {
    dispatch({
      type: TYPES.SET_SUGGESTIONS,
      payload: data,
    });
    return;
  }
  const { userId } = getState().currentUser;
  firebaseService.getSuggestions(userId).then((suggestions) => {
    dispatch({
      type: TYPES.SET_SUGGESTIONS,
      payload: suggestions,
    });
  });
};

const setCurrentUser = (userInfo) => ({
  type: TYPES.SET_CURRENT_USER,
  payload: userInfo,
});
