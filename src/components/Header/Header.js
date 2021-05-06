import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/userContext';
import * as ROUTES from '../../constants/routes';
import s from './Header.module.scss';

const Header = () => {
  const user = useContext(UserContext);
  return (
    <header className={s.header}>
      <div className={s.header__logo}>
        <Link to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}>
          <img alt="Instagram" src="./images/logo.png" />
        </Link>
      </div>
      <nav></nav>
    </header>
  );
};

export default Header;
