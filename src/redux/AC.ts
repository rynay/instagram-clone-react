import firebase from 'firebase/app'
import 'firebase/storage'
import * as firebaseService from '../services/firebase'
import { nanoid } from 'nanoid'
import { AppDispatch, RootStore } from './store'
import { setTargetUser } from './slices/targetUserSlice'
import { setSuggestions } from './slices/suggestionsSlice'
import { setDashboardPosts } from './slices/dashboardPostsSlice'
import {
  setIsPhotoUploading,
  setUploadError,
} from './slices/photoUploadingSlice'
import { setCurrentUser } from './slices/currentUserSlice'

export const initApp = () => (dispatch: AppDispatch) => {
  const localUser: TUser | null = JSON.parse(localStorage.getItem('user') || '')
  let authListener: () => void
  let currentInfoListener: () => void
  if (localUser) {
    dispatch(setCurrentUser(localUser))
    currentInfoListener =
      dispatch(setCurrentUserInformationListener()) || (() => {})
  }
  authListener = dispatch(setCurrentUserAuthenticationListener())
  return () => {
    currentInfoListener()
    authListener()
  }
}

export const setCurrentUserAuthenticationListener = () => (
  dispatch: AppDispatch
) => {
  let currentInfoListener = () => {}
  const authListener = firebase.auth().onAuthStateChanged((user) => {
    // const localUser = JSON.parse(localStorage.getItem('user'));
    // &&  !localUser
    if (!user) {
      dispatch(setCurrentUser(null))
      dispatch(setDashboardPosts(null))
      dispatch(setSuggestions(null))
      localStorage.removeItem('user')
      return
    }

    if (!user.email) return

    firebaseService.getUserInfoByEmail(user.email).then((userInfo) => {
      if (!userInfo) return
      localStorage.setItem('user', JSON.stringify(userInfo))

      dispatch(setCurrentUser(userInfo))
      currentInfoListener =
        dispatch(setCurrentUserInformationListener()) || (() => {})
      dispatch(handleDashboardPosts())
      dispatch(handleSuggestions())
    })
  })

  return () => {
    authListener()
    currentInfoListener()
  }
}

export const setCurrentUserInformationListener = () => (
  dispatch: AppDispatch,
  getState: () => RootStore
) => {
  const userId = getState().currentUser?.value?.userId
  if (!userId) return
  const userListener = firebase
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
      dispatch(handleDashboardPosts())
      dispatch(handleSuggestions())
    })

  return userListener
}

export const setTargetUserListenerByName = (name: TUser['username']) => async (
  dispatch: AppDispatch
) => {
  const userInfo = await firebaseService.getUserInfo(name)
  if (!userInfo) return
  dispatch(setTargetUser(userInfo))
  const listener = firebase
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

export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem('user')
  return firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(setCurrentUser(null))
      dispatch(setDashboardPosts(null))
      dispatch(handleSuggestions(null))
    })
}

const handleDashboardPosts = (data?: null) => (
  dispatch: AppDispatch,
  getState: () => RootStore
) => {
  if (data === null) {
    dispatch(setDashboardPosts(data))
    return
  }
  const { following } = getState().currentUser.value || {}
  return firebaseService
    .getFollowingPosts(following)
    .then((posts: TFormattedPost[]) => {
      const sortedPosts = posts.sort(function (a, b) {
        if ('dateCreated' in a && 'dateCreated' in b) {
          return b.dateCreated - a.dateCreated
        } else {
          return 0
        }
      })
      dispatch(setDashboardPosts(sortedPosts))
    })
}

const handleSuggestions = (data?: null) => (
  dispatch: AppDispatch,
  getState: () => RootStore
) => {
  if (data === null) {
    dispatch(setSuggestions(data))
    return
  }
  const { userId } = getState().currentUser.value || {}
  return firebaseService.getSuggestions(userId).then((suggestions) => {
    dispatch(setSuggestions(suggestions))
  })
}

export const toggleFollowing = (target: TUser) => (
  _: AppDispatch,
  getState: () => RootStore
) => {
  const {
    currentUser: { value },
  } = getState()
  if (value) {
    return firebaseService.toggleFollowing(target, value)
  }
}

export const toggleLike = (targetPost: TPost['photoId'] | null) => (
  dispatch: AppDispatch,
  getState: () => RootStore
) => {
  if (!targetPost) return
  const { currentUser, targetUser } = getState()
  const currentUserValue = currentUser.value
  const targetUserValue = targetUser.value
  const { userId, following } = currentUserValue || {}
  if (userId) {
    if (!targetUserValue) {
      firebaseService.toggleLike(userId, targetPost).then(() => {
        dispatch(handleDashboardPosts())
      })
    } else {
      firebaseService.toggleLike(userId, targetPost).then(() => {
        dispatch(updateTargetUserPhotos())
        if (following && following.includes(targetUserValue.userId)) {
          dispatch(handleDashboardPosts())
        }
      })
    }
  }
}

export const updateTargetUserPhotos = () => async (
  dispatch: AppDispatch,
  getState: () => RootStore
) => {
  const {
    targetUser: { value: targetUserValue },
  } = getState()
  if (targetUserValue) {
    const photos = await firebaseService.getPosts(targetUserValue.userId)
    return dispatch(setTargetUser({ ...targetUserValue, photos }))
  }
}

export const sendComment = ({
  displayName,
  targetPhoto,
  comment,
}: TSendingComment) => (dispatch: AppDispatch, getState: () => RootStore) => {
  const {
    targetUser: { value: targetUserValue },
    currentUser,
  } = getState()
  const { following } = currentUser.value || {}
  return firebaseService
    .sendComment({ displayName, targetPhoto, comment })
    .then(() => {
      if (!targetUserValue) {
        dispatch(handleDashboardPosts())
      } else {
        dispatch(updateTargetUserPhotos())
        if (following && following.includes(targetUserValue.userId)) {
          dispatch(handleDashboardPosts())
        }
      }
    })
}

export const uploadPhoto = ({
  photo,
  description,
}: {
  photo: TPhotoType
  description: TPost['caption']
}) => (dispatch: AppDispatch, getState: () => RootStore) => {
  const { currentUser } = getState()
  const { userId } = currentUser.value || {}
  if (!userId) return
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

export const uploadAvatar = (photo: File) => (
  _: AppDispatch,
  getState: () => RootStore
) => {
  const { currentUser } = getState()
  const { docId } = currentUser.value || {}
  if (!docId) return
  const id = nanoid()
  const filename = `images/${id}.${photo.name.split('.').reverse()[0]}`
  const metadata = {
    contentType: `image/${photo.name.split('.').reverse()[0]}`,
  }
  const storageRef = firebase.storage().ref()
  const uploadTask = storageRef.child(filename).put(photo, metadata)

  return uploadTask.on('state_changed', null, null, () => {
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      firebaseService.setAvatar({ docId, downloadURL })
    })
  })
}
