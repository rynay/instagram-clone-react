const Header = ({
  isFollowing,
  username,
  fullName,
  followersCount,
  followingCount,
  photosCount,
  toggleFollowing,
  currentUserId,
  currentPageUserId,
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
        {currentUserId !== currentPageUserId && (
          <button onClick={() => toggleFollowing}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <div>
        <p>{photosCount} photos</p>
        <p>
          {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
        </p>
        <p>{followingCount} following</p>
      </div>
    </section>
  );
};

export default Header;
