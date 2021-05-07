import { firebase, FieldValue } from '../lib/firebase';

export async function getUserInfo(uid) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', uid)
    .get();
  return result;
}

export function toggleFollowing(target, current) {
  firebase
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

  firebase
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
}

export async function getSuggestions(uid = '') {
  const results = await firebase
    .firestore()
    .collection('users')
    .where('userId', '!=', uid)
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
