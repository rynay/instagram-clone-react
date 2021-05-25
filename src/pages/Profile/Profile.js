import Header from './Header';
import s from './Profile.module.scss';

const Profile = () => {
  return (
    <main className={`container ${s.container}`}>
      <Header s={s} />
    </main>
  );
};

export default Profile;
