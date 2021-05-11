const Header = ({
  s,
  isFollowing,
  username,
  fullName,
  followersCount,
  followingCount,
  photosCount,
  toggleFollowing,
  currentUser,
  currentPageUser,
}) => {
  return (
    <section className={s.header}>
      <div className={s.header__image_container}>
        <img src={`/images/avatars/${currentPageUser.username}.jpg`} alt="" />
      </div>
      <div className={s.header__content}>
        <div className={s.header__userInfo}>
          <div className={s.header__heading}>
            <h2 className={s.header__username}>{username}</h2>
            {currentUser?.userId !== currentPageUser?.userId && (
              <button
                className={`${s.header__button} ${
                  isFollowing
                    ? s.header__button_unfollow
                    : s.header__button_follow
                }`}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  toggleFollowing(currentPageUser, currentUser);
                }}
                onClick={() => {
                  toggleFollowing(currentPageUser, currentUser);
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          <h3 className={s.header__fullName}>{fullName}</h3>
        </div>
        <div className={s.header__statistic}>
          <p>{photosCount} photos</p>
          <p>
            {followersCount || 0}{' '}
            {followersCount === 1 ? 'follower' : 'followers'}
          </p>
          <p>{followingCount} following</p>
        </div>
      </div>
    </section>
  );
};

export default Header;
