import { formatDistance } from 'date-fns';
import { createRef } from 'react';
import s from './Post.module.scss';
import Info from './Info';
import { Link } from 'react-router-dom';

const Post = ({ post, currentUserId, currentUserName, poppedUp }) => {
  const ref = createRef();
  function handleFocus() {
    ref.current.focus();
  }
  return (
    <>
      {post && (
        <article
          style={
            poppedUp && {
              display: 'flex',
            }
          }
          className={s.container}
          key={post.photoId}
        >
          <div>
            <div className={s.header}>
              <Link to={`/p/${post.username}`} className={s.link}>
                <div className={s.image_container}>
                  <img
                    src={
                      post.authorAvatar ||
                      `/images/avatars/${post.username}.jpg`
                    }
                    alt=""
                  />
                </div>
              </Link>
              <div className={s.author_info_container}>
                <Link to={`/p/${post.username}`} className={s.link}>
                  <h3 className={s.username}>{post.username}</h3>
                </Link>
                <p className={s.posted}>
                  {formatDistance(post.dateCreated, Date.now())} ago
                </p>
              </div>
            </div>
            <div className={s.post_image_container}>
              <img src={post.imageSrc} alt="" />
            </div>
          </div>
          <Info
            poppedUp={poppedUp}
            refForInput={ref}
            handleFocus={handleFocus}
            s={s}
            currentUserName={currentUserName}
            currentUserId={currentUserId}
            post={post}
            username={post.username}
          />
        </article>
      )}
    </>
  );
};

export default Post;
