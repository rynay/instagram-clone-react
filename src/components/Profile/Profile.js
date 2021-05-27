import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import s from './Profile.module.scss';

const Profile = ({ username, avatar, fullName }) => {
  return (
    <>
      {!username && <Skeleton count={1} height={60} />}
      {username && (
        <Link className={s.container} to={`/p/${username}`}>
          <div className={s.image_container}>
            <img alt="" src={avatar || `./images/avatars/${username}.jpg`} />
          </div>
          <div className={s.info}>
            <h3 className={s.username}>{username}</h3>
            <h4 className={s.fullName}>{fullName}</h4>
          </div>
        </Link>
      )}
    </>
  );
};

export default Profile;
