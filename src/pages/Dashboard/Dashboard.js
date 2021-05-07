import { useEffect } from 'react';

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Instagram';
  }, []);
  return <div>Hello from dashboard</div>;
};

export default Dashboard;
