import { formatDistance } from 'date-fns';
import { useEffect, useState } from 'react';
import s from './Post.module.scss';
import Info from './Info';

const Post = ({ post, getUserName, currentUserId }) => {
  const [username, setUsername] = useState('');
  useEffect(() => {
    async function getAndSetUserName(uid) {
      const result = await getUserName(uid);
      setUsername(result);
    }
    getAndSetUserName(post.userId);
  }, []);
  return (
    <article className={s.container} key={post.photoId}>
      <div className={s.header}>
        <div className={s.image_container}>
          <img src={`./images/avatars/${username}.jpg`} alt="" />
        </div>
        <div className={s.author_info_container}>
          <h3 className={s.username}>{username}</h3>
          <p className={s.posted}>
            {formatDistance(post.dateCreated, Date.now())} ago
          </p>
        </div>
      </div>
      <div className={s.post_image_container}>
        <img src={post.imageSrc} alt="" />
      </div>
      <Info currentUserId={currentUserId} post={post} username={username} />
    </article>
  );
};

export default Post;
