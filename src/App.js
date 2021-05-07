import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Header from './components/Header';
import FirebaseContext from './context/firebaseContext';
import UserContext from './context/userContext';
import * as FirebaseService from './services/firebase';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));
const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const NotFound = lazy(() => import('./pages/NotFound/index'));

function App() {
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState(localStorage.getItem('authUser'));
  const [userInfo, setUserInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  async function firebaseSuggestions(uid) {
    const result = await FirebaseService.getSuggestions(uid);
    setSuggestions(result);
  }

  async function firebaseUserInfo(uid) {
    const result = await FirebaseService.getUserInfo(uid);
    setUserInfo(
      result.docs.map((doc) => ({
        ...doc.data(),
        docId: uid,
      }))[0]
    );
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        setUser(user);
        firebaseUserInfo(user.uid);
        firebaseSuggestions(user.uid);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
        setUserInfo(null);
      }
    });
  }, [firebase]);

  const logout = () => {
    firebase.auth().signOut();
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const toggleFollowing = async (targetUser) => {
    await FirebaseService.toggleFollowing(targetUser, userInfo);
    firebaseSuggestions(userInfo.userId);
  };

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.DASHBOARD} exact>
              {user ? (
                <>
                  <Header login={userInfo?.username} logout={logout} />
                  <Dashboard
                    username={userInfo?.username}
                    suggestions={suggestions}
                    follow={toggleFollowing}
                  />
                </>
              ) : (
                <Login />
              )}
            </Route>
            <Route>
              <Header login={userInfo?.username} logout={logout} />
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
