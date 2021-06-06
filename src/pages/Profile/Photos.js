import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as AC from '../../redux/AC';
import Skeleton from 'react-loading-skeleton';
import { FaHeart, FaCommentDots } from 'react-icons/fa';

const Photos = ({ s, toggleLike, photos, currentUserId }) => {
  const photosSorted = photos?.sort((a, b) => {
    return b.dateCreated - a.dateCreated;
  });

  const history = useHistory();

  return (
    <article className={s.photos}>
      {!photosSorted && (
       <div  className={s.skeleton}>
         <Skeleton className={s.skeleton__small} width={`100%`} height={377} count={6} />
         <Skeleton className={s.skeleton__medium} width={`50%`} height={377} count={6} />
         <Skeleton className={s.skeleton__large} width={`33%`} height={377} count={6} />
       </div>
      )}
      {photosSorted && photosSorted.length === 0 && (
        <h2>User has not added photos yet</h2>
      )}
      {photosSorted &&
        photosSorted.map((photo) => {
          const isLiked = photo.likes.includes(currentUserId);

          return (
            <Link
              key={photo.photoId}
              to={`/p/${photo.username}/${photo.photoId}`}
            >
              <section className={s.photos__photoContainer} key={photo.photoId}>
                <div className={s.photos__imageContainer}>
                  <img src={photo.imageSrc} alt={photo.caption} />
                </div>
                <div className={s.photos__buttonContainer}>
                  <button
                    className={s.photos__button}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleLike(photo.photoId);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (e.key !== 'Enter') return;
                      toggleLike(photo.photoId);
                    }}
                  >
                    {<FaHeart style={{ fill: isLiked ? 'red' : 'white' }} />}
                  </button>
                  <button
                    onClick={() =>
                      history.push(`/p/${photos[0].username}/${photo.photoId}`)
                    }
                    className={s.photos__button}
                  >
                    <FaCommentDots style={{ fill: 'white' }} />
                  </button>
                </div>
              </section>
            </Link>
          );
        })}
    </article>
  );
};

const mapStateToProps = (state) => ({
  photos: state.targetUser?.photos,
  currentUserId: state.currentUser?.userId,
});

const mapDispatchToProps = (dispatch) => ({
  toggleLike: (targetPostId) => dispatch(AC.toggleLike(targetPostId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Photos);
