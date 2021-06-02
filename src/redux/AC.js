import firebase from 'firebase/app';
import 'firebase/storage';
import * as firebaseService from '../services/firebase';
import * as TYPES from './TYPES';
import { nanoid } from 'nanoid';

export const initApp = () => (dispatch) => {
  const localUser = JSON.parse(localStorage.getItem('user'));
  let authListener;
  let currentInfoListener;
  if (localUser) {
    dispatch(setCurrentUser(localUser));
    currentInfoListener = dispatch(setCurrentUserInformationListener());
  }
  authListener = dispatch(setCurrentUserAuthenticationListener());
  return () => {
    currentInfoListener();
    authListener();
  };
};

export const setCurrentUserAuthenticationListener = () => (dispatch) => {
  const authListener = firebase.auth().onAuthStateChanged((user) => {
    // const localUser = JSON.parse(localStorage.getItem('user'));
    // &&  !localUser
    if (!user) {
      dispatch(setCurrentUser(null));
      dispatch(setDashboardPosts(null));
      dispatch(setSuggestions(null));
      localStorage.removeItem('user');
      return;
    }

    firebaseService.getUserInfoByEmail(user.email).then((userInfo) => {
      localStorage.setItem('user', JSON.stringify(userInfo));

      dispatch(
        setCurrentUser({
          ...userInfo,
        })
      );
      dispatch(setDashboardPosts());
      dispatch(setSuggestions());
    });
  });

  return authListener;
};

export const setCurrentUserInformationListener = () => (dispatch, getState) => {
  const { userId } = getState().currentUser;
  const userListener = firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .onSnapshot((snapshot) => {
      dispatch(setCurrentUser(snapshot.docs[0].data()));
      dispatch(setDashboardPosts());
      dispatch(setSuggestions());
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
    .onSnapshot(async (doc) => {
      const data = {
        ...doc.data(),
        docId: userInfo.docId,
        photos: await firebaseService.getPosts(userInfo.userId),
      };
      dispatch(setTargetUser({ ...data }));
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
  firebaseService.toggleFollowing(target, current);
};

export const toggleLike = (targetPost) => (dispatch, getState) => {
  const {
    currentUser: { userId, following },
    targetUser,
  } = getState();
  if (!targetUser) {
    // like from dashboard
    firebaseService.toggleLike(userId, targetPost).then(() => {
      dispatch(setDashboardPosts());
    });
  } else {
    // like from profile
    firebaseService.toggleLike(userId, targetPost).then(() => {
      dispatch(updateTargetUserPhotos());
      if (following.includes(targetUser.userId)) {
        dispatch(setDashboardPosts());
      }
    });
  }
};

export const updateTargetUserPhotos = () => async (dispatch, getState) => {
  const { targetUser } = getState();
  const photos = await firebaseService.getPosts(targetUser.userId);
  dispatch(setTargetUser({ ...targetUser, photos }));
};

export const sendComment = ({ username, targetPhoto, comment }) => (
  dispatch,
  getState
) => {
  const {
    targetUser,
    currentUser: { following },
  } = getState();
  firebaseService.sendComment({ username, targetPhoto, comment }).then(() => {
    if (!targetUser) {
      dispatch(setDashboardPosts());
    } else {
      dispatch(updateTargetUserPhotos());
      if (following.includes(targetUser.userId)) {
        dispatch(setDashboardPosts());
      }
    }
  });
};

export const setTargetPostId = (id) => ({
  type: TYPES.SET_TARGET_POST_ID,
  payload: id,
});

const setIsPhotoUploading = (state) => ({
  type: TYPES.SET_IS_PHOTO_UPLOADING,
  payload: state,
});
const setUploadError = (error) => ({
  type: TYPES.SET_UPLOAD_ERROR,
  payload: error,
});

export const uploadPhoto = ({ photo, description }) => (dispatch, getState) => {
  const {
    currentUser: { userId },
  } = getState();
  const id = nanoid();
  const filename = `images/${id}.${photo.name.split('.').reverse()[0]}`;
  const metadata = {
    contentType: `image/${photo.name.split('.').reverse()[0]}`,
  };
  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child(filename).put(photo, metadata);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (progress != 100) {
        dispatch(setIsPhotoUploading(true));
      }
    },
    (error) => {
      dispatch(setIsPhotoUploading(false));
      dispatch(setUploadError(error.message));
    },
    () => {
      uploadTask.snapshot.ref
        .getDownloadURL()
        .then((downloadURL) => {
          dispatch(setIsPhotoUploading(false));
          firebaseService.addPhoto({
            caption: description,
            comments: [],
            likes: [],
            imageSrc: downloadURL,
            photoId: id,
            userId,
            dateCreated: Date.now(),
          });
        })
        .then(() => {
          dispatch(updateTargetUserPhotos());
        });
    }
  );
};
