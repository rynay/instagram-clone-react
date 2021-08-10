import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import Skeleton from 'react-loading-skeleton'
import { FaHeart, FaCommentDots } from 'react-icons/fa'
import { toggleLike } from '../../redux/AC'
import { AppDispatch, RootStore } from '../../redux/store'

type Props = {
  s: any
  toggleLike: (targetPostId: RootStore['targetPostId']['value']) => void
  photos?: TUser['photos']
  currentUserId?: TUser['userId']
}

const Photos = ({ s, toggleLike, photos, currentUserId }: Props) => {
  const photosSorted = [...(photos || [])]?.sort((a, b) => {
    if (a && b) {
      return b.dateCreated - a.dateCreated
    }
    return 0
  })

  const history = useHistory()

  return (
    <article className={s.photos}>
      {!photosSorted && (
        <div className={s.skeleton}>
          <Skeleton
            className={s.skeleton__small}
            width={`100%`}
            height={377}
            count={6}
          />
          <Skeleton
            className={s.skeleton__medium}
            width={`50%`}
            height={377}
            count={6}
          />
          <Skeleton
            className={s.skeleton__large}
            width={`33%`}
            height={377}
            count={6}
          />
        </div>
      )}
      {photosSorted && photosSorted.length === 0 && (
        <h2>User has not added photos yet</h2>
      )}
      {photosSorted &&
        photosSorted.map((photo) => {
          const isLiked = photo.likes.includes(currentUserId || '')

          return (
            <Link
              key={photo.photoId}
              to={`/p/${photo.username}/${photo.photoId}`}>
              <section className={s.photos__photoContainer} key={photo.photoId}>
                <div className={s.photos__imageContainer}>
                  <img src={photo.imageSrc} alt={photo.caption} />
                </div>
                <div className={s.photos__buttonContainer}>
                  <button
                    className={s.photos__button}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      return toggleLike(photo.photoId)
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      if (e.key !== 'Enter') return
                      return toggleLike(photo.photoId)
                    }}>
                    {<FaHeart style={{ fill: isLiked ? 'red' : 'white' }} />}
                  </button>
                  <button
                    onClick={() => {
                      if (photos) {
                        history.push(
                          `/p/${photos[0].username}/${photo.photoId}`
                        )
                      }
                    }}
                    className={s.photos__button}>
                    <FaCommentDots style={{ fill: 'white' }} />
                  </button>
                </div>
              </section>
            </Link>
          )
        })}
    </article>
  )
}

const mapStateToProps = (state: RootStore) => ({
  photos: state.targetUser?.value?.photos,
  currentUserId: state.currentUser?.value?.userId,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  toggleLike: (targetPostId: RootStore['targetPostId']['value']) =>
    dispatch(toggleLike(targetPostId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Photos)
