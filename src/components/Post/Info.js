import { useState } from 'react';
import { FaRegHeart, FaHeart, FaCommentDots } from 'react-icons/fa';
import { sendComment, toggleLike } from '../../services/firebase';

const Info = ({ currentUserId, currentUserName, post, username }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentsCount, setCommentsCount] = useState(post.comments.length);
  const [showingComments, setShowingComments] = useState(
    post.comments.slice(0, 3)
  );
  const [comment, setComment] = useState('');
  return (
    <div>
      <button
        onClick={() => {
          console.log('toggle');
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
      <button>
        <FaCommentDots />
      </button>
      <p>
        <strong>{username}</strong>: {post.caption}
      </p>
      <div>
        <p>
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>
        <p>
          {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
        </p>
      </div>
      {post.comments.length > 3 && (
        <button
          aria-label="toggle comments"
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            if (showingComments.length === post.comments.length) {
              setShowingComments(post.comments.slice(0, 3));
            } else {
              setShowingComments(post.comments);
            }
          }}
          onClick={() => {
            if (showingComments.length === post.comments.length) {
              setShowingComments(post.comments.slice(0, 3));
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
            <strong>{comment.displayName}</strong>: {comment.comment}
          </li>
        ))}
      </ul>
      <form
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
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment..."
        />
        <button>POST</button>
      </form>
    </div>
  );
};

export default Info;
