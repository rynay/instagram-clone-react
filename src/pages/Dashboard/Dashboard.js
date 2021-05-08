import Sidebar from '../../components/Sidebar';
import Timeline from '../../components/Timeline';
import { useEffect } from 'react';
import s from './Dashboard.module.scss';

const Dashboard = ({ suggestions, follow, username, posts, getUserName }) => {
  useEffect(() => {
    document.title = 'Instagram';
  }, []);
  return (
    <main className={`container ${s.container}`}>
      <Timeline posts={posts} getUserName={getUserName} />
      <Sidebar username={username} suggestions={suggestions} follow={follow} />
    </main>
  );
};

export default Dashboard;
