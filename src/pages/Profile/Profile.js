import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { getUserInfoByUserName } from '../../services/firebase';
import Header from './Header';
import s from './Profile.module.scss';

const Profile = ({
  toggleFollowing,
  currentUserInfo = {},
  match: {
    params: { userId: targetUserName },
  },
}) => {
  const [targetUser, setTargetUser] = useState(null);
  const [followersCountUpdated, setFollowersCountUpdated] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!targetUser) return;
    setFollowersCountUpdated(targetUser.followers.length);
    setIsFollowing(targetUser.followers.includes(currentUserInfo?.userId));
  }, [targetUser, currentUserInfo]);

  const updateFollowingInfo = (target, current) => {
    toggleFollowing(target, current).then(() => {
      setTargetUser({ ...targetUser });
    });
  };

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
          s={s}
          isFollowing={isFollowing}
          username={targetUser.username}
          fullName={targetUser.fullName}
          followersCount={followersCountUpdated}
          followingCount={targetUser.following.length}
          photosCount={photos.length}
          toggleFollowing={updateFollowingInfo}
          currentUser={currentUserInfo}
          currentPageUser={targetUser}
        />
      ) : null}
    </main>
  );
};

export default withRouter(Profile);
