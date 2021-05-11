import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import {
  getUserInfoByUserName,
  toggleFollowing,
} from '../../services/firebase';
import Header from './Header';
import s from './Profile.module.scss';

const Profile = ({
  currentUserInfo = {},
  match: {
    params: { userId: targetUserName },
  },
}) => {
  console.log();
  const [targetUser, setTargetUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(
    currentUserInfo?.following?.includes(targetUserName)
  );
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (currentUserInfo?.userId === targetUserName) {
      setTargetUser(currentUserInfo);
      return;
    }

    async function getUserInfoFromFirebase(userId) {
      const result = await getUserInfoByUserName(userId);
      const info = result.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }))[0];
      return info;
    }

    async function setInfo() {
      const targetUserInfo = await getUserInfoFromFirebase(targetUserName);
      setTargetUser(targetUserInfo);
    }

    setInfo();
  }, [targetUserName, currentUserInfo]);
  return (
    <main className={`container ${s.container}`}>
      {targetUser ? (
        <Header
          isFollowing={isFollowing}
          username={targetUser.username}
          fullName={targetUser.fullName}
          followersCount={targetUser.followers.length}
          followingCount={targetUser.following.length}
          photosCount={photos.length}
          toggleFollowing={toggleFollowing}
          currentUserId={currentUserInfo?.userId}
          currentPageUserId={targetUser.userId}
        />
      ) : null}
    </main>
  );
};

export default withRouter(Profile);
