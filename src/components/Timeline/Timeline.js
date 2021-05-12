import Post from '../Post';
import Skeleton from 'react-loading-skeleton';
import s from './Timeline.module.scss';

const Timeline = ({ currentUserName, posts, getUserName, currentUserId }) => {
  return (
    <section className={s.container}>
      {!posts && <h2>Here's no posts just yet</h2>}
      {posts !== null && !posts?.length && (
        <Skeleton
          count={3}
          height={500}
          width={500}
          style={{ display: 'block', marginBottom: '3em' }}
        />
      )}
      {posts &&
        posts.map((post) => (
          <Post
            currentUserName={currentUserName}
            key={post.postId}
            currentUserId={currentUserId}
            getUserName={getUserName}
            post={post}
          />
        ))}
    </section>
  );
};

export default Timeline;
