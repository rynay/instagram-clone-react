import { connect } from 'react-redux';
import * as AC from './redux/AC';
import { lazy, Suspense, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Header from './components/Header';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));
const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const NotFound = lazy(() => import('./pages/NotFound/index'));
const Profile = lazy(() => import('./pages/Profile/index'));

function App({ initApp, currentUsername }) {
  const history = useHistory();

  useEffect(() => {
    document.title = 'Instagram';
  }, []);

  useEffect(() => {
    return initApp();
  }, []);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUsername && !localUser) history.push('/login');
  }, [currentUsername]);

  return (
    <>
      <Header />
      <Suspense fallback={<p></p>}>
        <div style={{ paddingTop: '5rem' }}>
          <Switch>
            <Route path={ROUTES.LOGIN}>
              <Login currentUsername={currentUsername} />
            </Route>
            <Route path={ROUTES.SIGN_UP}>
              <SignUp currentUsername={currentUsername} />
            </Route>
            <Route path={ROUTES.DASHBOARD} exact>
              <Dashboard />
            </Route>
            <Route path={ROUTES.PROFILE}>
              <Profile />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  currentUsername: state.currentUser?.username,
});

const mapDispatchToProps = (dispatch) => ({
  // setCurrentUserAuthenticationListener: () => {
  //   return dispatch(AC.setCurrentUserAuthenticationListener());
  // },
  // setCurrentUserInformationListener: () => {
  //   return dispatch(AC.setCurrentUserInformationListener());
  // },
  // deleteCurrentUser: () => {
  //   dispatch(AC.setCurrentUser(null));
  // },
  initApp: () => {
    return dispatch(AC.initApp());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
