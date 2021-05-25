import { connect } from 'react-redux';
import * as firebaseService from '../../services/firebase';

const Header = ({ s, currentUser, targetUser }) => {
  console.log(currentUser, targetUser);
  return (
    <section className={s.header}>
      <div className={s.header__image_container}>
        <img src={`/images/avatars/${targetUser?.username}.jpg`} alt="" />
      </div>
      <div className={s.header__content}>
        <div className={s.header__userInfo}>
          <div className={s.header__heading}>
            <h2 className={s.header__username}>{targetUser?.username}</h2>
            {currentUser &&
              targetUser &&
              currentUser?.userId !== targetUser?.userId && (
                <button
                  className={`${s.header__button} ${
                    targetUser?.followers.includes(currentUser?.userId)
                      ? s.header__button_unfollow
                      : s.header__button_follow
                  }`}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    firebaseService.toggleFollowing(targetUser, currentUser);
                  }}
                  onClick={() => {
                    firebaseService.toggleFollowing(targetUser, currentUser);
                  }}
                >
                  {targetUser?.followers.includes(currentUser?.userId)
                    ? 'Unfollow'
                    : 'Follow'}
                </button>
              )}
          </div>
          <h3 className={s.header__fullName}>{targetUser?.fullName}</h3>
        </div>
        <div className={s.header__statistic}>
          {/* <p>{photosCount} photos</p> */}
          <p>
            {targetUser?.followers.length || 0}{' '}
            {targetUser?.followers.length === 1 ? 'follower' : 'followers'}
          </p>
          <p>{targetUser?.following.length} following</p>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  targetUser: state.targetUser,
});

export default connect(mapStateToProps)(Header);
