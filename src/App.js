import { connect } from 'react-redux';
import * as AC from './redux/AC';
import { lazy, Suspense, useEffect } from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Header from './components/Header';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));
const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const NotFound = lazy(() => import('./pages/NotFound/index'));
const Profile = lazy(() => import('./pages/Profile/index'));

function App({
  currentUser,
  currentUsername,
  setCurrentUserAuthenticationListener,
  setCurrentUserInformationListener,
  deleteCurrentUser,
}) {
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
  }, [currentUsername]);

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
  currentUsername: state.currentUser?.username,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUserAuthenticationListener: () => {
    return dispatch(AC.setCurrentUserAuthenticationListener());
  },
  setCurrentUserInformationListener: () => {
    return dispatch(AC.setCurrentUserInformationListener());
  },
  deleteCurrentUser: () => {
    dispatch(AC.setCurrentUser(null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
