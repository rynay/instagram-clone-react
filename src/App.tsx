import { connect } from 'react-redux'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import * as ROUTES from './constants/routes'
import Header from './components/Header'
import s from './app.module.scss'
import NewPostPopup from './components/NewPostPopup'
import { initApp } from './redux/AC'
import { AppDispatch, RootStore } from './redux/store'

const Login = lazy(() => import('./pages/Login/index'))
const SignUp = lazy(() => import('./pages/SignUp/index'))
const Dashboard = lazy(() => import('./pages/Dashboard/index'))
const NotFound = lazy(() => import('./pages/NotFound/index'))
const Profile = lazy(() => import('./pages/Profile/index'))
const PostInfoPopup = lazy(() => import('./components/PostInfoPopup'))

type Props = {
  initApp: () => () => void
  currentUsername?: TUser['username']
}

function App({ initApp, currentUsername }: Props) {
  const history = useHistory()
  const [isNewPostPopupOpen, setIsNewPostPopupOpen] = useState(false)

  useEffect(() => {
    document.title = 'Instagram'
    const listener = initApp()

    return listener
  }, [])

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || 'null')
    if (!currentUsername && !localUser) history.push('/login')
  }, [currentUsername])

  return (
    <>
      {isNewPostPopupOpen && (
        <NewPostPopup
          s={s}
          togglePopup={() => setIsNewPostPopupOpen((state) => !state)}
        />
      )}
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
              <Profile
                toggleNewPostPopup={() =>
                  setIsNewPostPopupOpen((state) => !state)
                }
              />
              <Route path={ROUTES.PROFILE + '/:postId'} exact>
                <PostInfoPopup s={s} />
              </Route>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Suspense>
    </>
  )
}

const mapStateToProps = (state: RootStore) => ({
  currentUser: state.currentUser,
  currentUsername: state.currentUser?.value?.username,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  initApp: () => dispatch(initApp()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
