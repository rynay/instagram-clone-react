import { connect } from 'react-redux';
import * as AC from '../../redux/AC';
import Skeleton from 'react-loading-skeleton';
import { FaHeart, FaCommentDots } from 'react-icons/fa';

const Photos = ({ s, toggleLike, photos, currentUserId }) => (
  <article className={s.photos}>
    {!photos && <Skeleton height={377} width={270} count={6} />}
    {photos && photos.length === 0 && <h2>User has not added photos yet</h2>}
    {photos &&
      photos.map((photo) => {
        const isLiked = photo.likes.includes(currentUserId);

        return (
          <section className={s.photos__photoContainer} key={photo.photoId}>
            <div className={s.photos__imageContainer}>
              <img src={photo.imageSrc} alt={photo.caption} />
            </div>
            <div className={s.photos__buttonContainer}>
              <button
                className={s.photos__button}
                onClick={() => {
                  toggleLike(photo.photoId);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  toggleLike(photo.photoId);
                }}
              >
                {<FaHeart style={{ fill: isLiked ? 'red' : 'white' }} />}
              </button>
              <button className={s.photos__button}>
                <FaCommentDots style={{ fill: 'white' }} />
              </button>
            </div>
          </section>
        );
      })}
  </article>
);

const mapStateToProps = (state) => ({
  photos: state.targetUser?.photos,
  currentUserId: state.currentUser?.userId,
});

const mapDispatchToProps = (dispatch) => ({
  toggleLike: (targetPostId) => dispatch(AC.toggleLike(targetPostId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Photos);
