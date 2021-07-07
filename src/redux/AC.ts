import firebase from 'firebase/app';
import 'firebase/storage';
import * as firebaseService from '../services/firebase';
import * as TYPES from './TYPES';
import { nanoid } from 'nanoid';

export const initApp = () => (dispatch: Function) => {
  const localUser: object | null = JSON.parse(localStorage.getItem('user'));
  let authListener: Function;
  let currentInfoListener: Function;
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

export const setCurrentUserAuthenticationListener = () => (
  dispatch: Function
) => {
  let currentInfoListener = () => {};
  const authListener: Function = firebase.auth().onAuthStateChanged((user) => {
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
      if (!userInfo) return;
      localStorage.setItem('user', JSON.stringify(userInfo));

      dispatch(
        setCurrentUser({
          ...userInfo,
        })
      );
      currentInfoListener = dispatch(setCurrentUserInformationListener());
      dispatch(setDashboardPosts());
      dispatch(setSuggestions());
    });
  });

  return () => {
    authListener();
    currentInfoListener();
  };
};

export const setCurrentUserInformationListener = () => (
  dispatch: Function,
  getState: Function
) => {
  const userId: string = getState().currentUser.userId;
  if (!userId) return;
  const userListener: Function = firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .onSnapshot((snapshot) => {
      if (!snapshot.docs.length) return;
      dispatch(
        setCurrentUser({
          ...snapshot.docs[0].data(),
          docId: snapshot.docs[0].id,
        })
      );
      dispatch(setDashboardPosts());
      dispatch(setSuggestions());
    });

  return userListener;
};

interface IUserInfo {
  docId?: string;
  userId?: string;
}

export const setTargetUserListenerByName = (name: string) => async (
  dispatch: Function
) => {
  const userInfo: IUserInfo = await firebaseService.getUserInfo(name);
  if (!userInfo) return;
  dispatch(setTargetUser(userInfo));
  const listener: Function = firebase
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

export const setTargetUser = (targetUserInfo: object) => ({
  type: TYPES.SET_TARGET_USER,
  payload: targetUserInfo,
});

export const logout = () => (dispatch: Function) => {
  localStorage.removeItem('user');
  return firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(setCurrentUser(null));
      dispatch(setDashboardPosts(null));
      dispatch(setSuggestions(null));
    });
};

const setDashboardPosts = (data?: object | null) => (
  dispatch: Function,
  getState: Function
) => {
  if (data === null) {
    dispatch({
      type: TYPES.SET_DASHBOARD_POSTS,
      payload: data,
    });
    return;
  }
  const { following } = getState().currentUser;
  return firebaseService.getFollowingPosts(following).then((posts) => {
    dispatch({
      type: TYPES.SET_DASHBOARD_POSTS,
      payload: posts.sort(function (a, b) {
        if ('dateCreated' in a && 'dateCreated' in b) {
          return b.dateCreated - a.dateCreated;
        } else {
          return 0;
        }
      }),
    });
  });
};

const setSuggestions = (data?: object | null) => (
  dispatch: Function,
  getState: Function
) => {
  if (data === null) {
    dispatch({
      type: TYPES.SET_SUGGESTIONS,
      payload: data,
    });
    return;
  }
  const { userId } = getState().currentUser;
  return firebaseService.getSuggestions(userId).then((suggestions) => {
    dispatch({
      type: TYPES.SET_SUGGESTIONS,
      payload: suggestions,
    });
  });
};

type SetCurrentUserType = (
  userInfo: object | null
) => {
  type: string;
  payload: object | null;
};
export const setCurrentUser: SetCurrentUserType = (userInfo) => ({
  type: TYPES.SET_CURRENT_USER,
  payload: userInfo,
});

export const toggleFollowing = (target: object) => (
  dispatch: Function,
  getState: Function
) => {
  const { currentUser } = getState();
  return firebaseService.toggleFollowing(target, currentUser);
};

export const toggleLike = (targetPost: object) => (
  dispatch: Function,
  getState: Function
) => {
  const {
    currentUser: { userId, following },
    targetUser,
  } = getState();
  let listener;
  if (!targetUser) {
    // like from dashboard
    listener = firebaseService.toggleLike(userId, targetPost).then(() => {
      dispatch(setDashboardPosts());
    });
  } else {
    // like from profile
    listener = firebaseService.toggleLike(userId, targetPost).then(() => {
      dispatch(updateTargetUserPhotos());
      if (following.includes(targetUser.userId)) {
        dispatch(setDashboardPosts());
      }
    });
  }
  return () => listener();
};

export const updateTargetUserPhotos = () => async (
  dispatch: Function,
  getState: Function
) => {
  const { targetUser } = getState();
  const photos: Array<object> = await firebaseService.getPosts(
    targetUser.userId
  );
  return dispatch(setTargetUser({ ...targetUser, photos }));
};

export const sendComment = ({ username, targetPhoto, comment }) => (
  dispatch: Function,
  getState: Function
) => {
  const {
    targetUser,
    currentUser: { following },
  } = getState();
  return firebaseService
    .sendComment({ username, targetPhoto, comment })
    .then(() => {
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

type SetTargetPostId = (
  id: string
) => {
  type: string;
  payload: string;
};

export const setTargetPostId: SetTargetPostId = (id) => ({
  type: TYPES.SET_TARGET_POST_ID,
  payload: id,
});

type SetIsPhotoUploading = (
  state: boolean
) => {
  type: string;
  payload: boolean;
};

const setIsPhotoUploading: SetIsPhotoUploading = (state) => ({
  type: TYPES.SET_IS_PHOTO_UPLOADING,
  payload: state,
});

type SetUploadError = (
  error: object
) => {
  type: string;
  payload: object;
};
const setUploadError: SetUploadError = (error) => ({
  type: TYPES.SET_UPLOAD_ERROR,
  payload: error,
});

export const uploadPhoto = ({ photo, description }) => (
  dispatch: Function,
  getState: Function
) => {
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

  return uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (progress != 100) {
        dispatch(setIsPhotoUploading(true));
      }
    },
    (error) => {
      dispatch(setIsPhotoUploading(false));
      if ('message' in error) {
        dispatch(setUploadError(error.message));
      }
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

interface PhotoType {
  name: string;
}

export const uploadAvatar = (photo: PhotoType) => (getState: Function) => {
  const {
    currentUser: { docId },
  } = getState();
  const id = nanoid();
  const filename = `images/${id}.${photo.name.split('.').reverse()[0]}`;
  const metadata = {
    contentType: `image/${photo.name.split('.').reverse()[0]}`,
  };
  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child(filename).put(photo, metadata);

  return uploadTask.on('state_changed', null, null, () => {
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      firebaseService.setAvatar({ docId, downloadURL });
    });
  });
};
