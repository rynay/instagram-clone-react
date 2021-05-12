import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import Header from './components/Header';
import FirebaseContext from './context/firebaseContext';
import UserContext from './context/userContext';
import * as FirebaseService from './services/firebase';

const Login = lazy(() => import('./pages/Login/index'));
const SignUp = lazy(() => import('./pages/SignUp/index'));
const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const NotFound = lazy(() => import('./pages/NotFound/index'));
const Profile = lazy(() => import('./pages/Profile/index'));

function App({ match }) {
  const { firebase } = useContext(FirebaseContext);
  const [user, setUser] = useState(localStorage.getItem('authUser'));
  const [userInfo, setUserInfo] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [followingPosts, setFollowingPosts] = useState([]);

  async function firebaseSuggestions(uid) {
    const result = await FirebaseService.getSuggestions(uid);
    setSuggestions(result);
    return result;
  }

  async function firebaseFollowingPosts(following) {
    const result = await FirebaseService.getFollowingPosts(following);
    if (!result) {
      setFollowingPosts(null);
      return;
    }
    const formatted = result
      .map((post) => ({
        ...post,
      }))
      .sort((a, b) => b.dateCreated - a.dateCreated);
    setFollowingPosts(formatted);
    return formatted;
  }

  async function getUserName(uid) {
    const result = await FirebaseService.getUserInfo(uid);
    const { username } = result.docs.map((doc) => ({
      ...doc.data(),
    }))[0];

    return username;
  }

  async function firebaseUserInfo(uid) {
    const result = await FirebaseService.getUserInfo(uid);
    const info = result.docs.map((doc) => ({
      ...doc.data(),
      docId: uid,
    }))[0];

    setUserInfo(info);
    return info;
  }

  const logout = () => {
    firebase.auth().signOut();
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const toggleFollowing = (targetUser) => {
    FirebaseService.toggleFollowing(targetUser, userInfo).then(() => {
      firebaseUserInfo(user.uid)
        .then(() => {
          firebaseSuggestions(userInfo.userId);
        })
        .then(() => {
          firebaseFollowingPosts(userInfo.following);
        });
    });
    if (userInfo.following.includes(targetUser.userId)) {
      setFollowingPosts((posts) =>
        posts.filter((post) => post.userId !== targetUser.userId)
      );
    }
    if (!userInfo.following.includes(targetUser.userId)) {
      setSuggestions((suggestions) =>
        suggestions.filter(
          (suggestion) => suggestion.userId !== targetUser.userId
        )
      );
    }
  };

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        setUser(user);
        async function firebaseWork(uid) {
          const info = await firebaseUserInfo(uid);
          if (match.path !== '/') return;
          await firebaseSuggestions(uid);
          await firebaseFollowingPosts(info.following);
        }
        firebaseWork(user.uid);
      } else {
        localStorage.removeItem('authUser');
        setUser(null);
        setUserInfo(null);
      }
    });

    return listener;
  }, [firebase]);

  useEffect(() => {
    if (!userInfo) return;
    firebaseSuggestions(userInfo.userId);
    firebaseFollowingPosts(userInfo.following);
  }, [userInfo?.following]);

  return (
    <UserContext.Provider value={user}>
      <Header login={userInfo?.username} logout={logout} />
      <Suspense fallback={<p>Loading...</p>}>
        <Switch>
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.DASHBOARD} exact>
            {user ? (
              <>
                <Dashboard
                  currentUserId={userInfo?.userId}
                  getUserName={getUserName}
                  posts={followingPosts}
                  username={userInfo?.username}
                  suggestions={suggestions}
                  follow={toggleFollowing}
                />
              </>
            ) : (
              <Login />
            )}
          </Route>
          <Route path={ROUTES.PROFILE}>
            <Profile
              toggleFollowing={toggleFollowing}
              currentUserInfo={userInfo}
            />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </UserContext.Provider>
  );
}

export default withRouter(App);
