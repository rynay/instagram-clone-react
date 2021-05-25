import { firebase } from '../lib/firebase';
import * as firebaseService from '../services/firebase';
import * as TYPES from './TYPES';

export const setCurrentUserAuthenticationListener = () => (dispatch) => {
  const authListener = firebase.auth().onAuthStateChanged((user) => {
    const localStorageUser = JSON.parse(localStorage.getItem('user'));
    if (!user && !localStorageUser) {
      dispatch(setCurrentUser(null));
      dispatch(setDashboardPosts(null));
      dispatch(setSuggestions(null));
      return;
    }

    firebaseService
      .getUserInfoByEmail(user?.email || localStorageUser.emailAddress)
      .then((userInfo) => {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...userInfo,
            docId: user?.uid,
          })
        );
        dispatch(
          setCurrentUser({
            ...userInfo,
            docId: user?.uid || localStorageUser.docId,
          })
        );
        dispatch(setDashboardPosts());
        dispatch(setSuggestions());
      });
  });

  return authListener;
};

export const setCurrentUserInformationListener = () => (dispatch, getState) => {
  const { docId } = getState().currentUser;
  if (!docId) return;
  const userListener = firebase
    .firestore()
    .collection('users')
    .doc(docId)
    .onSnapshot((snapshot) => {
      console.log(snapshot.data());
    });

  return userListener;
};

export const setTargetUserListenerByName = (name) => async (dispatch) => {
  const userInfo = await firebaseService.getUserInfo(name);
  dispatch(setTargetUser(userInfo));
  const listener = firebase
    .firestore()
    .collection('users')
    .doc(userInfo.docId)
    .onSnapshot((doc) => {
      dispatch(setTargetUser({ ...doc.data(), docId: userInfo.docId }));
    });
  return () => {
    listener();
  };
};

export const setTargetUser = (targetUserInfo) => ({
  type: TYPES.SET_TARGET_USER,
  payload: targetUserInfo,
});

export const logout = () => (dispatch) => {
  localStorage.removeItem('user');
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

export const setCurrentUser = (userInfo) => ({
  type: TYPES.SET_CURRENT_USER,
  payload: userInfo,
});

export const toggleFollowing = (target, current) => (dispatch) => {
  firebaseService.toggleFollowing(target, current).then(() => {
    dispatch(setSuggestions());
    dispatch(setDashboardPosts());
  });
};

export const toggleLike = (targetPost) => (dispatch, getState) => {
  const {
    currentUser: { userId },
    targetUser,
  } = getState();
  if (!targetUser) {
    // like from dashboard
    firebaseService.toggleLike(userId, targetPost).then(() => {
      dispatch(setDashboardPosts());
    });
  } else {
    // like from profile
  }
};

export const sendComment = ({ username, targetPhoto, comment }) => (
  dispatch
) => {
  firebaseService.sendComment({ username, targetPhoto, comment }).then(() => {
    dispatch(setDashboardPosts());
  });
};
