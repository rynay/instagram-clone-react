import { connect } from 'react-redux';
import Post from '../../components/Post';

const PostInfoPopup = ({ togglePostInfoPopup, targetPostInfo, s }) => {
  return (
    <section className={s.PostInfo}>
      <Post poppedUp post={targetPostInfo} />
    </section>
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
