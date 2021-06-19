import { connect } from 'react-redux';
import { logout } from '../../redux/AC';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import s from './Header.module.scss';

const Header = ({ logout, user }) => {
  return (
    <header className={s.header}>
      <div className={`container ${s.container}`}>
        <div className={s.header__logo}>
          <Link to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}>
            <h2>Fakegram</h2>
          </Link>
        </div>
        <nav>
          {user ? (
            <div className={s.header__buttons}>
              <Link to={ROUTES.DASHBOARD}>
                <button
                  className={s.header__icon_dashboard}
                  aria-label="Dashboard"
                  title="Dashboard">
                  <img alt="Dashboard icon" src="/icons/home.svg" />
                </button>
              </Link>

              <button
                onClick={logout}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    return logout();
                  }
                }}
                className={s.header__icon_logout}
                aria-label="Log Out"
                title="Log Out">
                <img alt="Log Out icon" src="/icons/logout.svg" />
              </button>
              <div className={s.header__profile}>
                <Link
                  to={`/p/${user.username}`}
                  className={s.header__profile_link}>
                  <img
                    src={user.photo || `/images/avatars/${user.username}.jpg`}
                    alt=""
                  />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className={`${s.button} ${s.button__login}`}>
                Log In
              </Link>
              <Link
                to={ROUTES.SIGN_UP}
                className={`${s.button} ${s.button__signup}`}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => ({
  user: state.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
