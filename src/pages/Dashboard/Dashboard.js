import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Timeline from '../../components/Timeline';
import s from './Dashboard.module.scss';
import * as firebaseService from '../../services/firebase';

const Dashboard = ({ currentUser, suggestions, dashboardPosts }) => {
  return (
    <main className={`container ${s.container}`}>
      <Timeline
        currentUserName={currentUser?.username}
        currentUserId={currentUser?.currentUserId}
        posts={dashboardPosts}
      />
      <Sidebar
        currentUser={currentUser}
        suggestions={suggestions}
        follow={firebaseService.toggleFollowing}
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
