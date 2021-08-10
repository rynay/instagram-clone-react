import { connect } from 'react-redux'
import Sidebar from '../../components/Sidebar'
import Timeline from '../../components/Timeline'
import s from './Dashboard.module.scss'
import { useEffect } from 'react'
import { toggleFollowing } from '../../redux/AC'
import { AppDispatch, RootStore } from '../../redux/store'

type Props = {
  currentUser: RootStore['currentUser']['value']
  suggestions: RootStore['suggestions']['value']
  dashboardPosts: RootStore['dashboardPosts']['value']
  toggleFollowing: (target: TUser) => void
}

const Dashboard = ({
  currentUser,
  suggestions,
  dashboardPosts,
  toggleFollowing,
}: Props) => {
  useEffect(() => {
    document.title = 'Instagram'
  }, [])
  return (
    <main className={`container ${s.container}`}>
      <Timeline currentUser={currentUser} posts={dashboardPosts} />
      <Sidebar
        currentUser={currentUser}
        suggestions={suggestions}
        follow={toggleFollowing}
      />
    </main>
  )
}

const mapStateToProps = (state: RootStore) => ({
  currentUser: state.currentUser.value,
  suggestions: state.suggestions.value,
  dashboardPosts: state.dashboardPosts.value,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  toggleFollowing: (target: TUser) => dispatch(toggleFollowing(target)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
