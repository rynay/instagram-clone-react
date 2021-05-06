import { useContext } from 'react';
import UserContext from '../../context/userContext';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import s from './Header.module.scss';

const Header = () => {
  const user = useContext(UserContext);
  return (
    <header className={s.header}>
      <div className={`container ${s.container}`}>
        <div className={s.header__logo}>
          <Link to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}>
            <img alt="Instagram" src="./images/logo.png" />
          </Link>
        </div>
        <nav>
          {user ? (
            <>
              <button
                className={s.header__icon}
                aria-label="Dashboard"
                title="Dashboard"
              ></button>

              <button
                className={s.header__icon}
                aria-label="Sign Out"
                title="Sign Out"
              ></button>
            </>
          ) : (
            <>
              <Link className={`${s.button} ${s.button__login}`}>Log In</Link>
              <Link className={`${s.button} ${s.button__signup}`}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
