import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import s from './Profile.module.scss';

const Profile = ({ username }) => {
  return (
    <>
      {!username && <Skeleton count={1} height={60} />}
      {username && (
        <Link className={s.container} to={`/p/${username}`}>
          <div className={s.image_container}>
            <img alt="" src={`./images/avatars/${username}.jpg`} />
          </div>
          <h3 className={s.username}>{username}</h3>
        </Link>
      )}
    </>
  );
};

export default Profile;
