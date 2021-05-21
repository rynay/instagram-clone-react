import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Timeline from '../../components/Timeline';
import s from './Dashboard.module.scss';

const Dashboard = ({
  suggestions,
  follow,
  currentUser,
  dashboardPosts,
  getUserName,
}) => {
  return (
    <main className={`container ${s.container}`}>
      <Timeline
        currentUserName={currentUser?.username}
        currentUserId={currentUser?.currentUserId}
        posts={dashboardPosts}
        getUserName={getUserName}
      />
      <Sidebar
        username={currentUser?.username}
        suggestions={suggestions}
        follow={follow}
      />
    </main>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  suggestions: state.suggestions,
  dashboardPosts: state.dashboardPosts,
});

export default connect(mapStateToProps)(Dashboard);
