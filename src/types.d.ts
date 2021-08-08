type TSuggestion = {
  username: string
  photo: string
}
type TUser = {
  username: string
  userId: string
  displayName: string
  docId: string
  photo: string
}

type TPost = {
  photoId: string
  likes: TUser['userId'][]
  comments: {
    displayName: TUser['displayName']
    comment: string
  }[]
  caption: string
}

type TSendingComment = {
  comment: string
  displayName: TUser['displayName']
  targetPhoto: TPost['photoId']
}
