import * as AC from '../../redux/AC';
import { connect } from 'react-redux';
import Sidebar from '../../components/Sidebar';
import Timeline from '../../components/Timeline';
import s from './Dashboard.module.scss';

const Dashboard = ({
  currentUser,
  suggestions,
  dashboardPosts,
  toggleFollowing,
}) => {
  console.log(dashboardPosts);
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
  toggleFollowing: (target, current) => {
    dispatch(AC.toggleFollowing(target, current));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
