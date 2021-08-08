import firebase from 'firebase/app'
import 'firebase/storage'
import * as firebaseService from '../services/firebase'
import * as TYPES from './TYPES'
import { nanoid } from 'nanoid'
import { Dispatch } from 'redux'
import { TAction } from '../actions'
import { ThunkAction } from 'redux-thunk'

export const initApp = () => (dispatch: Dispatch) => {
  const localUser: TUser | null = JSON.parse(localStorage.getItem('user') || '')
  let authListener: Function
  let currentInfoListener: Function
  if (localUser) {
    dispatch(setCurrentUser(localUser))
    currentInfoListener = dispatch(setCurrentUserInformationListener())
  }
  authListener = dispatch(setCurrentUserAuthenticationListener())
  return () => {
    currentInfoListener()
    authListener()
  }
}

export const setCurrentUserAuthenticationListener = () => (
  dispatch: Dispatch
) => {
  let currentInfoListener = () => {}
  const authListener: Function = firebase.auth().onAuthStateChanged((user) => {
    // const localUser = JSON.parse(localStorage.getItem('user'));
    // &&  !localUser
    if (!user) {
      dispatch(setCurrentUser(null))
      dispatch(setDashboardPosts(null))
      dispatch(setSuggestions(null))
      localStorage.removeItem('user')
      return
    }

    firebaseService.getUserInfoByEmail(user.email).then((userInfo) => {
      if (!userInfo) return
      localStorage.setItem('user', JSON.stringify(userInfo))

      dispatch(
        setCurrentUser({
          ...userInfo,
        })
      )
      currentInfoListener = dispatch(setCurrentUserInformationListener())
      dispatch(setDashboardPosts())
      dispatch(setSuggestions())
    })
  })

  return () => {
    authListener()
    currentInfoListener()
  }
}

export const setCurrentUserInformationListener = () => (
  dispatch: Dispatch,
  getState: () => TState
) => {
  const userId: string = getState().currentUser.userId
  if (!userId) return
  const userListener: Function = firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .onSnapshot((snapshot) => {
      if (!snapshot.docs.length) return
      dispatch(
        setCurrentUser({
          ...snapshot.docs[0].data(),
          docId: snapshot.docs[0].id,
        } as TUser)
      )
      dispatch(setDashboardPosts())
      dispatch(setSuggestions())
    })

  return userListener
}

export const setTargetUserListenerByName = (name: TUser['username']) => async (
  dispatch: Dispatch
) => {
  const userInfo: TUser = await firebaseService.getUserInfo(name)
  if (!userInfo) return
  dispatch(setTargetUser(userInfo))
  const listener: Function = firebase
    .firestore()
    .collection('users')
    .doc(userInfo.docId)
    .onSnapshot(async (doc) => {
      const data = {
        ...doc.data(),
        docId: userInfo.docId,
        photos: await firebaseService.getPosts(userInfo.userId),
      } as TUser
      dispatch(setTargetUser({ ...data }))
    })
  return () => {
    listener()
  }
}

export const setTargetUser = (targetUserInfo: TUser): TAction => ({
  type: TYPES.SET_TARGET_USER,
  payload: targetUserInfo,
})

export const logout = () => (dispatch: Dispatch) => {
  localStorage.removeItem('user')
  return firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(setCurrentUser(null))
      dispatch(setDashboardPosts(null))
      dispatch(setSuggestions(null))
    })
}

const setDashboardPosts = (data: TPost[] | null) => (
  dispatch: Dispatch,
  getState: () => TState
) => {
  if (data === null) {
    dispatch({
      type: TYPES.SET_DASHBOARD_POSTS,
      payload: data,
    })
    return
  }
  const { following } = getState().currentUser
  return firebaseService.getFollowingPosts(following).then((posts: TPost[]) => {
    dispatch({
      type: TYPES.SET_DASHBOARD_POSTS,
      payload: posts.sort(function (a, b) {
        if ('dateCreated' in a && 'dateCreated' in b) {
          return b.dateCreated - a.dateCreated
        } else {
          return 0
        }
      }),
    })
  })
}

const setSuggestions = (data: TUser[] | null) => (
  dispatch: Dispatch,
  getState: () => TState
) => {
  if (data === null) {
    dispatch({
      type: TYPES.SET_SUGGESTIONS,
      payload: data,
    })
    return
  }
  const { userId } = getState().currentUser
  return firebaseService.getSuggestions(userId).then((suggestions) => {
    dispatch({
      type: TYPES.SET_SUGGESTIONS,
      payload: suggestions,
    })
  })
}

type SetCurrentUserType = (userInfo: TUser | null) => TAction
export const setCurrentUser: SetCurrentUserType = (userInfo) => ({
  type: TYPES.SET_CURRENT_USER,
  payload: userInfo,
})

export const toggleFollowing = (target: TUser) => (
  _: Dispatch,
  getState: () => TState
) => {
  const { currentUser } = getState()
  return firebaseService.toggleFollowing(target, currentUser)
}

export const toggleLike = (targetPost: TPost['photoId']) => (
  dispatch: Dispatch,
  getState: () => TState
) => {
  const {
    currentUser: { userId, following },
    targetUser,
  } = getState()
  if (!targetUser) {
    // like from dashboard
    firebaseService.toggleLike(userId, targetPost).then(() => {
      dispatch(setDashboardPosts())
    })
  } else {
    // like from profile
    firebaseService.toggleLike(userId, targetPost).then(() => {
      dispatch(updateTargetUserPhotos())
      if (following.includes(targetUser.userId)) {
        dispatch(setDashboardPosts())
      }
    })
  }
}

export const updateTargetUserPhotos = () => async (
  dispatch: Dispatch,
  getState: () => TState
) => {
  const { targetUser } = getState()
  const photos = await firebaseService.getPosts(targetUser.userId)
  return dispatch(setTargetUser({ ...targetUser, photos }))
}

export const sendComment = ({
  displayName,
  targetPhoto,
  comment,
}: TSendingComment) => (dispatch: Dispatch, getState: () => TState) => {
  const {
    targetUser,
    currentUser: { following },
  } = getState()
  return firebaseService
    .sendComment({ displayName, targetPhoto, comment })
    .then(() => {
      if (!targetUser) {
        dispatch(setDashboardPosts())
      } else {
        dispatch(updateTargetUserPhotos())
        if (following.includes(targetUser.userId)) {
          dispatch(setDashboardPosts())
        }
      }
    })
}

export const setTargetPostId = (id: TPost['photoId']): TAction => ({
  type: TYPES.SET_TARGET_POST_ID,
  payload: id,
})

const setIsPhotoUploading = (isLoading: boolean): TAction => ({
  type: TYPES.SET_IS_PHOTO_UPLOADING,
  payload: isLoading,
})

const setUploadError = (error: TError): TAction => ({
  type: TYPES.SET_UPLOAD_ERROR,
  payload: error,
})

export const uploadPhoto = ({
  photo,
  description,
}: {
  photo: PhotoType
  description: TPost['caption']
}) => (dispatch: Function, getState: Function) => {
  const {
    currentUser: { userId },
  } = getState()
  const id = nanoid()
  const filename = `images/${id}.${photo.name.split('.').reverse()[0]}`
  const metadata = {
    contentType: `image/${photo.name.split('.').reverse()[0]}`,
  }
  const storageRef = firebase.storage().ref()
  const uploadTask = storageRef.child(filename).put(photo as any, metadata)

  return uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      if (progress != 100) {
        dispatch(setIsPhotoUploading(true))
      }
    },
    (error) => {
      dispatch(setIsPhotoUploading(false))
      if ('message' in error) {
        dispatch(setUploadError(error.message))
      }
    },
    () => {
      uploadTask.snapshot.ref
        .getDownloadURL()
        .then((downloadURL) => {
          dispatch(setIsPhotoUploading(false))
          firebaseService.addPhoto({
            caption: description,
            comments: [],
            likes: [],
            imageSrc: downloadURL,
            photoId: id,
            userId,
            dateCreated: Date.now(),
          })
        })
        .then(() => {
          dispatch(updateTargetUserPhotos())
        })
    }
  )
}

interface PhotoType {
  name: string
}

export const uploadAvatar = (photo: PhotoType) => (getState: Function) => {
  const {
    currentUser: { docId },
  } = getState()
  const id = nanoid()
  const filename = `images/${id}.${photo.name.split('.').reverse()[0]}`
  const metadata = {
    contentType: `image/${photo.name.split('.').reverse()[0]}`,
  }
  const storageRef = firebase.storage().ref()
  const uploadTask = storageRef.child(filename).put(photo as any, metadata)

  return uploadTask.on('state_changed', null, null, () => {
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      firebaseService.setAvatar({ docId, downloadURL })
    })
  })
}
