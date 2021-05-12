import { firebase } from '../lib/firebase';

export async function toggleLike(userId, targetPhoto) {
  await firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', targetPhoto)
    .get()
    .then((query) => {
      const target = query.docs[0];
      const currVal = target.data().likes;
      const newVal = currVal.includes(userId)
        ? [...currVal.filter((id) => id !== userId)]
        : [...currVal, userId];
      target.ref.update({
        likes: newVal,
      });
    });
}

export async function sendComment(displayName, targetPhoto, comment) {
  await firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', targetPhoto)
    .get()
    .then((query) => {
      const target = query.docs[0];
      var currVal = target.data().comments;
      target.ref.update({
        comments: [
          ...currVal,
          {
            comment,
            displayName,
          },
        ],
      });
    });
}

export async function getUserInfo(uid) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', uid)
    .get();
  return result;
}

export async function getUserInfoByUserName(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();
  return result;
}

export async function getFollowingPosts(following = []) {
  if (!following.length) return null;
  const results = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get();
  const formattedResult = results.docs.flatMap((doc) => ({
    ...doc.data(),
  }));
  if (!formattedResult.length) return null;
  return formattedResult;
}

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
  return results.docs
    .map((doc) => ({
      ...doc.data(),
    }))
    .filter((doc) => !doc.followers.includes(uid))
    .map(({ username, userId }) => ({
      username,
      userId,
    }));
}

export async function checkIsUserNameExist(username) {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  console.log(results.docs);

  return !!results.docs.length;
}

export async function checkIsEmailExist(email) {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('emailAddress', '==', email)
    .get();

  console.log(results.docs);
  return !!results.docs.length;
}
