import { useContext } from 'react';
import UserContext from '../../context/userContext';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import s from './Header.module.scss';

const Header = ({ logout, login }) => {
  const user = useContext(UserContext);
  return (
    <header className={s.header}>
      <div className={`container ${s.container}`}>
        <div className={s.header__logo}>
          <Link to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}>
            <img alt="Instagram" src="/images/logo.png" />
          </Link>
        </div>
        <nav>
          {user ? (
            <div className={s.header__buttons}>
              <Link to={ROUTES.DASHBOARD}>
                <button
                  className={s.header__icon_dashboard}
                  aria-label="Dashboard"
                  title="Dashboard"
                >
                  <img alt="Dashboard icon" src="/icons/home.svg" />
                </button>
              </Link>

              <button
                onClick={logout}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    logout();
                  }
                }}
                className={s.header__icon_logout}
                aria-label="Log Out"
                title="Log Out"
              >
                <img alt="Log Out icon" src="/icons/logout.svg" />
              </button>
              <div className={s.header__profile}>
                <Link to={`/p/${login}`} className={s.header__profile_link}>
                  <img src={`/images/avatars/${login}.jpg`} alt="" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className={`${s.button} ${s.button__login}`}
              >
                Log In
              </Link>
              <Link
                to={ROUTES.SIGN_UP}
                className={`${s.button} ${s.button__signup}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
