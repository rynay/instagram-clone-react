import Profile from '../Profile';
import Suggestions from '../Suggestions';
import s from './Sidebar.module.scss';

const Sidebar = ({ suggestions, follow, username }) => {
  return (
    <aside className={s.container}>
      <Profile username={username} />
      <Suggestions suggestions={suggestions} follow={follow} />
    </aside>
  );
};

export default Sidebar;
