import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './components/Header';

const Login = lazy(() => import('./pages/Login/index'));

function App() {
  return (
    <Router>
      <Suspense fallback={<p>Loading...</p>}>
        <Header />
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
