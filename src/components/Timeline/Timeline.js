import Post from '../Post';
import Skeleton from 'react-loading-skeleton';
import s from './Timeline.module.scss';

const Timeline = ({ posts, getUserName }) => {
  console.log(posts);
  return (
    <section className={s.container}>
      {!posts.length && (
        <Skeleton
          count={3}
          height={500}
          width={500}
          style={{ display: 'block', marginBottom: '3em' }}
        />
      )}
      {posts.map((post) => (
        <Post key={post.postId} getUserName={getUserName} post={post} />
      ))}
    </section>
  );
};

export default Timeline;
