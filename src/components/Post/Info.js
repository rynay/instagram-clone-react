import { useState } from 'react';
import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { sendComment, toggleLike } from '../../services/firebase';
import { Link } from 'react-router-dom';

const Info = ({
  refForInput,
  handleFocus,
  s,
  currentUserId,
  currentUserName,
  post,
  username,
}) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentsCount, setCommentsCount] = useState(post.comments.length);
  const [showingComments, setShowingComments] = useState(
    post.comments.slice(post.comments.length - 3, post.comments.length)
  );
  const [comment, setComment] = useState('');
  return (
    <div className={s.info}>
      <button
        className={s.info__button}
        onClick={() => {
          toggleLike(currentUserId, post.photoId);
          setIsLiked((isLiked) => !isLiked);
          setLikesCount((count) => (isLiked ? count - 1 : count + 1));
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          toggleLike(currentUserId, post.photoId);
          setIsLiked((isLiked) => !isLiked);
          setLikesCount((count) => (isLiked ? count - 1 : count + 1));
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
          sendComment(currentUserName, post.photoId, comment.trim());
          setShowingComments((comments) => [
            ...comments,
            {
              comment,
              displayName: currentUserName,
            },
          ]);
          setComment('');
          setCommentsCount((count) => count + 1);
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

export default Info;
