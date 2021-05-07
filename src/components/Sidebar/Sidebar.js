import Profile from '../Profile';
import Suggestions from '../Suggestions';

const Sidebar = ({ suggestions, follow, username }) => {
  return (
    <aside>
      <Profile username={username} />
      <Suggestions suggestions={suggestions} follow={follow} />
    </aside>
  );
};

export default Sidebar;
