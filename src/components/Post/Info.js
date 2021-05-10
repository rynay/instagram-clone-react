import { useState } from 'react';
import { FaRegHeart, FaHeart, FaCommentDots } from 'react-icons/fa';
import { sendComment } from '../../services/firebase';

const Info = ({ currentUserId, currentUserName, post, username }) => {
  const [showingComments, setShowingComments] = useState(
    post.comments.slice(0, 3)
  );
  const [comment, setComment] = useState('');
  return (
    <div>
      <button>
        {post.likes.includes(currentUserId) ? (
          <FaHeart style={{ fill: 'red' }} />
        ) : (
          <FaRegHeart />
        )}
      </button>
      <button>
        <FaCommentDots />
      </button>
      <p>
        <strong>{username}</strong>: {post.caption}
      </p>
      <div>
        <p>
          {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
        </p>
        <p>
          {post.comments.length}{' '}
          {post.comments.length === 1 ? 'comment' : 'comments'}
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
