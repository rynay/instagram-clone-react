import { firebase } from '../lib/firebase';

const getUserInfo = async (uid = '') => {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', uid)
    .get();
  return result;
};

export default getUserInfo;
