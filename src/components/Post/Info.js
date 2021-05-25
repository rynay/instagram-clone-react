import { createRef, useState } from 'react';
import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as AC from '../../redux/AC';
import { connect } from 'react-redux';

const Info = ({
  refForInput,
  handleFocus,
  s,
  currentUser,
  post,
  username,
  toggleLike,
  sendComment,
}) => {
  const isLiked = post.likes.includes(currentUser?.userId);

  const likesCount = post.likes.length;
  const commentsCount = post.comments.length;
  const [showingComments, setShowingComments] = useState(
    post.comments.length >= 3
      ? post.comments.slice(post.comments.length - 3, post.comments.length)
      : post.comments
  );
  const [comment, setComment] = useState('');

  return (
    <div className={s.info}>
      <button
        className={s.info__button}
        onClick={() => {
          toggleLike(post.photoId);
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          toggleLike(post.photoId);
        }}
      >
        {isLiked ? <FaHeart style={{ fill: 'red' }} /> : <FaRegHeart />}
      </button>
      <button onClick={handleFocus} className={s.info__button}>
        <FaRegCommentDots />
      </button>
      <p>
        <strong>
          <Link to={`/p/${username}`} className={s.link}>
            {username}
          </Link>
        </strong>
        : {post.caption}
      </p>
      <div className={s.info__statistic}>
        <p>
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>
        <p>
          {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
        </p>
      </div>
      {post.comments.length > 3 && (
        <button
          className={s.toggleComments}
          aria-label="toggle comments"
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            if (showingComments.length === post.comments.length) {
              setShowingComments(
                post.comments.slice(
                  post.comments.length - 3,
                  post.comments.length
                )
              );
            } else {
              setShowingComments(post.comments);
            }
          }}
          onClick={() => {
            if (showingComments.length === post.comments.length) {
              setShowingComments(
                post.comments.slice(
                  post.comments.length - 3,
                  post.comments.length
                )
              );
            } else {
              setShowingComments(post.comments);
            }
          }}
        >
          {showingComments.length === post.comments.length
            ? 'Hide comments'
            : 'View all comments'}
        </button>
      )}
      <ul>
        {showingComments.map((comment) => (
          <li key={comment.displayName + comment.comment}>
            <strong>
              <Link to={`/p/${comment.displayName}`} className={s.link}>
                {comment.displayName}
              </Link>
            </strong>
            : {comment.comment}
          </li>
        ))}
      </ul>
      <form
        className={s.info__form}
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim()) return;
          sendComment({
            username: currentUser.username,
            targetPhoto: post.photoId,
            comment: comment.trim(),
          });
          setShowingComments((comments) => [
            ...comments,
            {
              comment,
              displayName: currentUser.username,
            },
          ]);
          setComment('');
        }}
      >
        <input
          ref={refForInput}
          className={s.info__form_input}
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment..."
        />
        <button className={s.info__form_button}>POST</button>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  toggleLike: (post) => {
    dispatch(AC.toggleLike(post));
  },
  sendComment: ({ username, targetPhoto, comment }) => {
    dispatch(AC.sendComment({ username, targetPhoto, comment }));
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(Info);
