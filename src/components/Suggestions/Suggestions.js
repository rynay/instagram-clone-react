import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import s from './Suggestions.module.scss';

const Suggestions = ({ suggestions, follow }) => {
  return (
    <section className={s.container}>
      {suggestions && (
        <>
          {!suggestions.length && <Skeleton count={1} height={20} />}
          {!!suggestions.length && (
            <h2 className={s.title}>Suggestions for you</h2>
          )}
          <ul className={s.list}>
            {!suggestions.length && <Skeleton count={1} height={150} />}
            {suggestions.map((sug) => (
              <li className={s.list_item} key={sug.username}>
                <Link className={s.link} to={`/p/${sug.username}`}>
                  <div className={s.image_container}>
                    <img
                      alt=""
                      src={sug.photo || `./images/avatars/${sug.username}.jpg`}
                    />
                  </div>
                  <h3 className={s.username}>{sug.username}</h3>
                </Link>
                <button
                  className={s.button}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    follow(sug);
                  }}
                  onClick={() => follow(sug)}>
                  follow
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default Suggestions;
