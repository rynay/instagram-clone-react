import { firebase } from '../lib/firebase';

export async function toggleLike(userId, targetPhoto) {
  const query = await firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', targetPhoto)
    .get();

  const target = query.docs[0];
  const currVal = target.data().likes;
  const newVal = currVal.includes(userId)
    ? [...currVal.filter((id) => id !== userId)]
    : [...currVal, userId];
  return target.ref.update({
    likes: newVal,
  });
}

export async function sendComment({ username, targetPhoto, comment }) {
  return firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', targetPhoto)
    .get()
    .then((query) => {
      const target = query.docs[0];
      const currVal = target.data().comments;
      return target.ref.update({
        comments: [
          ...currVal,
          {
            comment,
            displayName: username,
          },
        ],
      });
    });
}

export async function getUserInfo(name) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', name)
    .get();

  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0];
}

export async function getUserInfoById(id) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', id)
    .get();

  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0];
}

export async function getUserInfoByUserName(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();
  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0];
}

export async function getUserInfoByEmail(email) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('emailAddress', '==', email)
    .get();
  return result.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }))[0];
}

export async function getFollowingPosts(following = []) {
  if (!following.length) return [];
  const results = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get();
  const formattedResult = results.docs.map(async (doc) => ({
    ...doc.data(),
    username: await getUserNameById(doc.data().userId),
    authorAvatar: await getAvatarById(doc.data().userId),
  }));

  return Promise.all(formattedResult) || [];
}

async function getAvatarById(id) {
  if (!id) return;

  const results = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', id)
    .get();
  const formattedResult = results.docs.map((doc) => ({
    authorAvatar: doc.data().photo,
  }))[0].authorAvatar;

  return formattedResult;
}

export async function getPosts(id) {
  if (!id) return null;
  const results = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', id)
    .get();

  const formattedResult = results.docs.map((doc) => ({
    ...doc.data(),
  }));

  return formattedResult;
}

const getUserNameById = async (id) => {
  if (!id) return;
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', id)
    .get();
  return result.docs.map((doc) => ({
    ...doc.data(),
  }))[0].username;
};

export async function toggleFollowing(target, current) {
  const result1 = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', target.userId)
    .limit(1)
    .get()
    .then((query) => {
      const thing = query.docs[0];
      var currVal = thing.data().followers;
      let newVal;
      if (currVal.includes(current.userId)) {
        newVal = currVal.filter((val) => val !== current.userId);
      } else {
        newVal = [...currVal, current.userId];
      }
      thing.ref.update({ followers: newVal });
    });

  const result2 = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', current.userId)
    .limit(1)
    .get()
    .then((query) => {
      const thing = query.docs[0];
      var currVal = thing.data().following;
      let newVal;
      if (currVal.includes(target.userId)) {
        newVal = currVal.filter((val) => val !== target.userId);
      } else {
        newVal = [...currVal, target.userId];
      }
      thing.ref.update({ following: newVal });
    });

  return [result1, result2];
}

export async function getSuggestions(uid = '') {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('userId', '!=', uid)
    .limit(10)
    .get();
  const formatted = results.docs
    .map((doc) => ({
      ...doc.data(),
    }))
    .filter((doc) => !doc.followers.includes(uid));
  if (!formatted.length) return null;
  return formatted;
}

export async function checkIsUserNameExist(username) {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return !!results.docs.length;
}

export async function checkIsEmailExist(email) {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('emailAddress', '==', email)
    .get();
  return !!results.docs.length;
}
