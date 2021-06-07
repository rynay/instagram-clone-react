import * as AC from '../../redux/AC';
import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Timeline from '../../components/Timeline';
import s from './Dashboard.module.scss';
import { useEffect } from 'react';

const Dashboard = ({
  currentUser,
  suggestions,
  dashboardPosts,
  toggleFollowing,
}) => {
  useEffect(() => {
    document.title = 'Instagram';
  }, []);
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
        follow={toggleFollowing}
      />
    </main>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  suggestions: state.suggestions,
  dashboardPosts: state.dashboardPosts,
});

const mapDispatchToProps = (dispatch) => ({
  toggleFollowing: (target) => {
    dispatch(AC.toggleFollowing(target));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
