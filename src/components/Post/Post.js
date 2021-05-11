import { formatDistance } from 'date-fns';
import { useEffect, createRef, useState } from 'react';
import s from './Post.module.scss';
import Info from './Info';
import { Link } from 'react-router-dom';

const Post = ({ post, getUserName, currentUserId, currentUserName }) => {
  const [username, setUsername] = useState('');
  const ref = createRef();
  function handleFocus() {
    ref.current.focus();
  }
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
        <Link to={`/p/${username}`} className={s.link}>
          <div className={s.image_container}>
            <img src={`./images/avatars/${username}.jpg`} alt="" />
          </div>
        </Link>
        <div className={s.author_info_container}>
          <Link to={`/p/${username}`} className={s.link}>
            <h3 className={s.username}>{username}</h3>
          </Link>
          <p className={s.posted}>
            {formatDistance(post.dateCreated, Date.now())} ago
          </p>
        </div>
      </div>
      <div className={s.post_image_container}>
        <img src={post.imageSrc} alt="" />
      </div>
      <Info
        refForInput={ref}
        handleFocus={handleFocus}
        s={s}
        currentUserName={currentUserName}
        currentUserId={currentUserId}
        post={post}
        username={username}
      />
    </article>
  );
};

export default Post;
