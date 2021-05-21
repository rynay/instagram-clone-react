import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Timeline from '../../components/Timeline';
import s from './Dashboard.module.scss';

const Dashboard = ({
  suggestions,
  follow,
  username,
  dashboardPosts,
  getUserName,
  currentUserId,
}) => {
  return (
    <main className={`container ${s.container}`}>
      <Timeline
        currentUserName={username}
        currentUserId={currentUserId}
        posts={dashboardPosts}
        getUserName={getUserName}
      />
      <Sidebar username={username} suggestions={suggestions} follow={follow} />
    </main>
  );
};

const mapStateToProps = (state) => ({
  username: state.currentUser.username,
  suggestions: state.suggestions,
  dashboardPosts: state.dashboardPosts,
});

export default connect(mapStateToProps)(Dashboard);
