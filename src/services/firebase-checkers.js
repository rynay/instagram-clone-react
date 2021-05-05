import { firebase } from '../lib/firebase';

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
