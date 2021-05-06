import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Header from './components/Header';
import FirebaseContext from './context/firebaseContext';
import UserContext from './context/userContext';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));
const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const NotFound = lazy(() => import('./pages/NotFound/index'));

function App() {
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState(localStorage.getItem('authUser'));

  useEffect(() => {
    firebase.auth().onAuthStatusChanges((user) => {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        setUser(user);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
      }
    });
  }, [firebase]);

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.DASHBOARD} exact>
              <Header />
              <Dashboard />
            </Route>
            <Route>
              <Header />
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
