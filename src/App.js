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
  setCurrentUserAuthenticationListener,
  setTargetUserListenerByName,
  setCurrentUserInformationListener,
  deleteCurrentUser,
}) {
  const history = useHistory();

  useEffect(() => {
    const listener = setCurrentUserAuthenticationListener();
    return listener;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      deleteCurrentUser(null);
      return;
    }
    const listener = setCurrentUserInformationListener();
    return listener;
  }, [currentUser]);

  const { userId: targetUserName } = useParams();

  useEffect(() => {
    if (!targetUserName) return;

    const listener = setTargetUserListenerByName(targetUserName);
    return listener;
  }, [targetUserName]);

  useEffect(() => {
    if (!currentUser) history.push(ROUTES.LOGIN);
    if (currentUser) history.push(ROUTES.DASHBOARD);
    if (currentUser) localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

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
  setCurrentUserAuthenticationListener: () => {
    dispatch(AC.setCurrentUserAuthenticationListener());
  },
  setTargetUserListenerByName: (name) => {
    dispatch(AC.setTargetUserListenerByName(name));
  },
  setCurrentUserInformationListener: () => {
    dispatch(AC.setCurrentUserInformationListener());
  },
  deleteCurrentUser: () => {
    dispatch(AC.setCurrentUser(null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
