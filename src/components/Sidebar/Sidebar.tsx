import React from 'react'
import Profile from '../Profile'
import Suggestions from '../Suggestions'
import s from './Sidebar.module.scss'

type Props = {
  suggestions: TUser[]
  follow: (target: TUser) => void
  currentUser: TUser
}

const Sidebar = ({ suggestions, follow, currentUser }: Props) => {
  return (
    <aside className={s.container}>
      <Profile
        fullName={currentUser?.fullName}
        avatar={currentUser?.photo}
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
