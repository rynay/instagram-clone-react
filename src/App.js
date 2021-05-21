import { connect } from 'react-redux';
import * as AC from './redux/AC';
import { lazy, Suspense, useEffect } from 'react';
import { Switch, Route, useParams, useHistory } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Header from './components/Header';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));
const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const NotFound = lazy(() => import('./pages/NotFound/index'));
const Profile = lazy(() => import('./pages/Profile/index'));

function App({
  currentUser,
  setCurrentUserListener,
  setTargetUserListenerById,
}) {
  const { userId: targetUserId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const listener = setCurrentUserListener();
    return listener;
  }, []);

  useEffect(() => {
    if (!currentUser) history.push(ROUTES.LOGIN);
    if (currentUser) history.push(ROUTES.DASHBOARD);
    if (currentUser) localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!targetUserId) return;

    const listener = setTargetUserListenerById(targetUserId);
    return listener;
  }, [targetUserId]);
  return (
    <>
      <Header />
      <Suspense fallback={<p>Loading...</p>}>
        <Switch>
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.DASHBOARD} exact>
            <Dashboard />
          </Route>
          <Route path={ROUTES.PROFILE}>
            <Profile />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUserListener: () => {
    dispatch(AC.setCurrentUserListener());
  },
  setTargetUserListenerById: (id) => {
    dispatch(AC.setTargetUserListenerById(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
