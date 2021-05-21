import { connect } from 'react-redux';
import * as AC from './redux/AC';
import { lazy, Suspense, useContext, useEffect } from 'react';
import { Switch, Route, useParams, useHistory } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Header from './components/Header';
import FirebaseContext from './context/firebaseContext';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));
const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const NotFound = lazy(() => import('./pages/NotFound/index'));
const Profile = lazy(() => import('./pages/Profile/index'));

function App({ setCurrentUser, setTargetUserById }) {
  const { firebase } = useContext(FirebaseContext);
  const { userId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) history.push(ROUTES.LOGIN);
    });

    return listener;
  }, [firebase]);

  useEffect(() => {
    if (!userId) return;

    setTargetUserById(userId);
  }, [userId]);

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

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => {
    dispatch(AC.setCurrentUser(user));
  },
  setTargetUserById: (id) => {
    dispatch(AC.setTargetUserById(id));
  },
});

export default connect(null, mapDispatchToProps)(App);
