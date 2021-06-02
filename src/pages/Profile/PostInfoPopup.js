import { useEffect } from 'react';
import { connect } from 'react-redux';
import Post from '../../components/Post';

const PostInfoPopup = ({ togglePostInfoPopup, targetPostInfo, s }) => {
  useEffect(() => {
    const onKeyDownHandler = (e) => {
      if (e.key === 'Escape') {
        togglePostInfoPopup();
      }
    };
    document.addEventListener('keydown', onKeyDownHandler);
    return () => document.removeEventListener('keydown', onKeyDownHandler);
  }, []);
  return (
    <div
      onClick={() => {
        togglePostInfoPopup();
      }}
      className={s.overlay}
    >
      <section
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={s.PostInfo}
      >
        <Post poppedUp post={targetPostInfo} />
      </section>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUserId: state?.currentUser?.userId,
  currentUserName: state?.currentUser?.username,
  targetPostInfo: state?.targetUser?.photos.find(
    (photo) => photo.photoId === state.targetPostId
  ),
});

export default connect(mapStateToProps)(PostInfoPopup);
