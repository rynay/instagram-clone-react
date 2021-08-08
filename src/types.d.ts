type TUser = {
  username: string
  userId: string
  displayName: string
  docId: string
  photo: string
  email: string
  following: TUser['userId'][]
  followers: TUser['userId'][]
}

type TPost = {
  photoId: string
  likes: TUser['userId'][]
  comments: {
    displayName: TUser['displayName']
    comment: string
  }[]
  caption: string
  userId: TUser['userId']
}

type TFormattedPost = TPost & {
  username: TUser['username']
  authorAvatar: TUser['photo']
}

type TSendingComment = {
  comment: string
  displayName: TUser['displayName']
  targetPhoto: TPost['photoId']
}
