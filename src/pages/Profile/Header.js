const Header = ({
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
    <section>
      <div>
        <img />
      </div>
      <div>
        <div>
          <h2>{username}</h2>
          <h3>{fullName}</h3>
        </div>
        {currentUser?.userId !== currentPageUser?.userId && (
          <button
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
      <div>
        <p>{photosCount} photos</p>
        <p>
          {followersCount || 0}{' '}
          {followersCount === 1 ? 'follower' : 'followers'}
        </p>
        <p>{followingCount} following</p>
      </div>
    </section>
  );
};

export default Header;
