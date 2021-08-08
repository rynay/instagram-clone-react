import { SET_TARGET_POST_ID } from './types.d'
import {
  SET_CURRENT_USER,
  SET_DASHBOARD_POSTS,
  SET_IS_PHOTO_UPLOADING,
  SET_SUGGESTIONS,
  SET_TARGET_USER,
  SET_TARGET_USERNAME,
  SET_UPLOAD_ERROR,
} from './redux/TYPES'

type TAction =
  | TSET_CURRENT_USER
  | TSET_DASHBOARD_POSTS
  | TSET_TARGET_USER
  | TSET_TARGET_USERNAME
  | TSET_UPLOAD_ERROR
  | TSET_IS_PHOTO_UPLOADING
  | TSET_TARGET_POST_ID
  | TSET_SUGGESTIONS

type TSET_CURRENT_USER = {
  type: typeof SET_CURRENT_USER
  payload: TUser
}
type TSET_DASHBOARD_POSTS = {
  type: typeof SET_DASHBOARD_POSTS
  payload: TPost[]
}
type TSET_TARGET_USER = {
  type: typeof SET_TARGET_USER
  payload: TUser
}
type TSET_TARGET_USERNAME = {
  type: typeof SET_TARGET_USERNAME
  payload: TUser['username']
}
type TSET_UPLOAD_ERROR = {
  type: typeof SET_UPLOAD_ERROR
  payload: TError
}
type TSET_IS_PHOTO_UPLOADING = {
  type: typeof SET_IS_PHOTO_UPLOADING
  payload: boolean
}
type TSET_TARGET_POST_ID = {
  type: typeof SET_TARGET_POST_ID
  payload: TPost['photoId']
}

type TSET_SUGGESTIONS = {
  type: typeof SET_SUGGESTIONS
  payload: TUser[]
}
