import { RootStore } from '../../redux/store'
import Profile from '../Profile'
import Suggestions from '../Suggestions'
import s from './Sidebar.module.scss'

type Props = {
  suggestions: RootStore['suggestions']
  follow: (target: TUser) => void
  currentUser: RootStore['currentUser']
}

const Sidebar = ({ suggestions, follow, currentUser }: Props) => {
  return (
    <aside className={s.container}>
      <Profile
        fullName={currentUser?.fullName}
        avatar={currentUser?.avatar}
        username={currentUser?.username}
      />
      <Suggestions
        currentUser={currentUser}
        suggestions={suggestions}
        follow={follow}
      />
    </aside>
  )
}

export default Sidebar
