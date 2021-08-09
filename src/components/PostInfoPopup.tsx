import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Post from './Post'
import { RootStore } from '../redux/store'

type Props = {
  s: any
  targetUser: TUser | null
}

const PostInfoPopup = ({ s, targetUser }: Props) => {
  const [targetPostInfo, setTargetPostInfo] = useState<TFormattedPost | null>(
    null
  )
  const {
    postId,
  }: {
    postId: string
  } = useParams()
  const history = useHistory()
  useEffect(() => {
    if (!targetUser || !targetUser.photos) return
    setTargetPostInfo(
      targetUser.photos.find((post) => post.photoId == postId) || null
    )
  }, [targetUser])
  useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        history.goBack()
      }
    }
    document.addEventListener('keydown', onKeyDownHandler)
    return () => document.removeEventListener('keydown', onKeyDownHandler)
  }, [])
  return (
    <div onClick={() => history.goBack()} className={s.overlay}>
      <section
        onClick={(e) => {
          e.stopPropagation()
        }}
        className={s.PostInfo}>
        {targetPostInfo && <Post poppedUp post={targetPostInfo} />}
      </section>
    </div>
  )
}

const mapStateToProps = (state: RootStore) => ({
  targetUser: state?.targetUser,
})

export default connect(mapStateToProps)(PostInfoPopup)
