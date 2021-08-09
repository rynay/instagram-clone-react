import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import Header from './Header'
import Photos from './Photos'
import s from './Profile.module.scss'
import { setTargetUser } from '../../redux/slices/targetUserSlice'
import { setTargetUserListenerByName } from '../../redux/AC'
import { AppDispatch } from '../../redux/store'

type Props = {
  deleteTargetUser: () => void
  setTargetUserListenerByName: (
    name: TUser['username']
  ) => Promise<(() => void) | undefined>
  toggleNewPostPopup: () => void
}

const Profile = ({
  deleteTargetUser,
  setTargetUserListenerByName,
  toggleNewPostPopup,
}: Props) => {
  const {
    userId: userName,
  }: {
    userId: TUser['username']
  } = useParams()

  useEffect(() => {
    document.title = `${userName} - Instagram`
  }, [])

  useEffect(() => {
    let listener: () => void
    setTargetUserListenerByName(userName).then((res) => {
      if (res) {
        listener = res
      }
    })

    return () => {
      deleteTargetUser()
      listener()
    }
  }, [userName])

  return (
    <>
      <main className={`container ${s.container}`}>
        <Header toggleNewPostPopup={toggleNewPostPopup} s={s} />
        <Photos s={s} />
      </main>
    </>
  )
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  deleteTargetUser: () => {
    dispatch(setTargetUser(null))
  },
  setTargetUserListenerByName: (name: TUser['username']) => {
    return dispatch(setTargetUserListenerByName(name))
  },
})

export default connect(null, mapDispatchToProps)(Profile)
