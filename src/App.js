import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import Header from './components/Header';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));

function App() {
  return (
    <Router>
      <Suspense fallback={<p>Loading...</p>}>
        <Header />
        <Switch>
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
