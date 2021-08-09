type TUser = {
  photos: TFormattedPost[] | null
  username: string
  userId: string
  displayName: string
  docId: string
  email: string
  following: TUser['userId'][]
  followers: TUser['userId'][]
  fullName: string
  avatar: string
  photos?: TFormattedPost[] | null
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
  dateCreated: number
  imageSrc: string
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

type TPhoto = {
  photo: TPhotoType
  description: string
}

type TPhotoType = {
  name: string
}
