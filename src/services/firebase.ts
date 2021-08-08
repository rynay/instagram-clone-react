import { firebase } from '../lib/firebase'

export async function addPhoto(data: TPost) {
  return await firebase.firestore().collection('photos').add(data)
}

type SetAvatar = ({
  docId,
  downloadURL,
}: {
  docId: TUser['docId']
  downloadURL: TUser['photo']
}) => Promise<void>
export const setAvatar: SetAvatar = ({ docId, downloadURL }) => {
  return firebase
    .firestore()
    .collection('users')
    .doc(docId)
    .update({ photo: downloadURL })
}

export const toggleLike = async (
  userId: TUser['userId'],
  targetPhoto: TPost['photoId']
): Promise<void> => {
  const query = await firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', targetPhoto)
    .get()

  const target = query.docs[0]
  const currVal: TPost['likes'] = target.data().likes
  const newVal = currVal.includes(userId)
    ? [...currVal.filter((id) => id !== userId)]
    : [...currVal, userId]
  return target.ref.update({
    likes: newVal,
  })
}

type SendComment = (comment: TSendingComment) => Promise<void>
export const sendComment: SendComment = async ({
  displayName,
  targetPhoto,
  comment,
}) => {
  return firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', targetPhoto)
    .get()
    .then((query) => {
      const target = query.docs[0]
      const currVal = target.data().comments
      return target.ref.update({
        comments: [
          ...currVal,
          {
            comment,
            displayName: displayName,
          },
        ],
      })
    })
}

export async function getUserInfo(name: TUser['username']): Promise<TUser> {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', name)
    .get()

  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0] as TUser
}

export async function getUserInfoById(id: TUser['docId']): Promise<TUser> {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', id)
    .get()

  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0] as TUser
}

export async function getUserInfoByUserName(
  username: TUser['username']
): Promise<TUser> {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get()
  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0] as TUser
}

export async function getUserInfoByEmail(
  email: TUser['email']
): Promise<TUser> {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('emailAddress', '==', email)
    .get()
  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0] as TUser
}

export async function getFollowingPosts(
  following: TUser['following'] = []
): Promise<TFormattedPost[] | []> {
  if (!following.length) return []
  const results = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get()
  const formattedResult = results.docs.map(
    async (doc) =>
      ({
        ...doc.data(),
        username: await getUserNameById(doc.data().userId),
        authorAvatar: await getAvatarById(doc.data().userId),
      } as TFormattedPost)
  )

  return Promise.all(formattedResult) || []
}

async function getAvatarById(
  id: TUser['userId']
): Promise<TUser['photo'] | void> {
  if (!id) return

  const results = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', id)
    .get()
  const formattedResult: TUser['photo'] = results.docs.map((doc) => ({
    authorAvatar: doc.data().photo,
  }))[0].authorAvatar

  return formattedResult
}

export async function getPosts(
  id: TUser['userId']
): Promise<TFormattedPost[] | null> {
  if (!id) return null
  const results = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', id)
    .get()

  const formattedResult = results.docs.map(
    async (doc) =>
      ({
        ...doc.data(),
        username: await getUserNameById(doc.data().userId),
        authorAvatar: await getAvatarById(doc.data().userId),
      } as TFormattedPost)
  )

  return Promise.all(formattedResult) || []
}

const getUserNameById = async (
  id: TUser['userId']
): Promise<TUser['username'] | void> => {
  if (!id) return
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', id)
    .get()
  return result.docs.map((doc) => ({
    ...doc.data(),
  }))[0].username as TUser['username']
}

export async function toggleFollowing(target: TUser, current: TUser) {
  const result1 = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', target.userId)
    .limit(1)
    .get()
    .then((query) => {
      const thing = query.docs[0]
      var currVal: TUser['followers'] = thing.data().followers
      let newVal
      if (currVal.includes(current.userId)) {
        newVal = currVal.filter((val) => val !== current.userId)
      } else {
        newVal = [...currVal, current.userId]
      }
      thing.ref.update({ followers: newVal })
    })

  const result2 = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', current.userId)
    .limit(1)
    .get()
    .then((query) => {
      const thing = query.docs[0]
      var currVal: TUser['following'] = thing.data().following
      let newVal
      if (currVal.includes(target.userId)) {
        newVal = currVal.filter((val) => val !== target.userId)
      } else {
        newVal = [...currVal, target.userId]
      }
      thing.ref.update({ following: newVal })
    })

  return [result1, result2]
}

export async function getSuggestions(uid = ''): Promise<TUser[] | null> {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('userId', '!=', uid)
    .limit(10)
    .get()
  const formatted = results.docs
    .map(
      (doc) =>
        ({
          ...doc.data(),
        } as TUser)
    )
    .filter((doc) => !doc.followers.includes(uid))
  if (!formatted.length) return null
  return formatted
}

export async function checkIsUserNameExist(
  username: TUser['username']
): Promise<boolean> {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get()

  return !!results.docs.length
}

export async function checkIsEmailExist(
  email: TUser['email']
): Promise<boolean> {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('emailAddress', '==', email)
    .get()
  return !!results.docs.length
}
