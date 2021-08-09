import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { connect } from 'react-redux'
import { FaCamera, FaPlus } from 'react-icons/fa'
import { toggleFollowing, uploadAvatar } from '../../redux/AC'

const Header = ({
  s,
  currentUser,
  targetUser,
  toggleFollowing,
  toggleNewPostPopup,
  uploadAvatar,
}) => {
  const [photoPreview, setPhotoPreview] = useState(null)
  const handlePhotoChange = (e) => {
    setPhotoPreview(URL.createObjectURL(e.target.files[0]))
    return uploadAvatar(e.target.files[0])
  }
  return (
    <>
      <section className={s.header}>
        <div className={s.header__image_container}>
          {currentUser &&
            targetUser &&
            currentUser.userId === targetUser.userId && (
              <form>
                <label
                  className={s.label}
                  htmlFor="file"
                  aria-label="Choose an avatar from your device">
                  {' '}
                  <FaPlus /> <FaCamera />
                </label>
                <input
                  multiple={false}
                  id="file"
                  accept="image/*"
                  type="file"
                  onChange={(e) => handlePhotoChange(e)}
                />
              </form>
            )}
          {targetUser?.username && (
            <img
              src={
                photoPreview ||
                targetUser.photo ||
                `/images/avatars/${targetUser.username}.jpg`
              }
              alt=""
            />
          )}
          {!targetUser?.username && (
            <Skeleton height={85} width={85} circle={true} count={1} />
          )}
        </div>
        <div className={s.header__content}>
          <div className={s.header__userInfo}>
            <div className={s.header__heading}>
              {targetUser?.username && (
                <h2 className={s.header__username}>{targetUser.username}</h2>
              )}
              {!targetUser?.username && (
                <Skeleton height={20} width={100} count={1} />
              )}
              {currentUser &&
                targetUser &&
                currentUser?.userId !== targetUser?.userId && (
                  <button
                    className={`${s.header__button} ${
                      targetUser?.followers.includes(currentUser?.userId)
                        ? s.header__button_unfollow
                        : s.header__button_follow
                    }`}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      return toggleFollowing(targetUser, currentUser)
                    }}
                    onClick={() => {
                      return toggleFollowing(targetUser, currentUser)
                    }}>
                    {targetUser?.followers.includes(currentUser?.userId)
                      ? 'Unfollow'
                      : 'Follow'}
                  </button>
                )}
              {currentUser &&
                targetUser &&
                currentUser.userId === targetUser.userId && (
                  <button
                    className={s.toggleNewPostPopup}
                    onClick={toggleNewPostPopup}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        return toggleNewPostPopup()
                      }
                    }}>
                    + Post
                  </button>
                )}
            </div>
            {targetUser?.fullName && (
              <h3 className={s.header__fullName}>{targetUser?.fullName}</h3>
            )}
            {!targetUser?.fullName && (
              <Skeleton height={14} width={75} count={1} />
            )}
          </div>
          <div className={s.header__statistic}>
            {/* <p>{photosCount} photos</p> */}
            <p>
              {targetUser?.followers.length &&
                (targetUser?.followers.length || 0)}{' '}
              {targetUser?.followers.length === undefined && (
                <Skeleton height={14} width={14} count={1} />
              )}{' '}
              {targetUser?.followers.length === 1 ? 'follower' : 'followers'}
            </p>
            <p>
              {targetUser?.following.length && targetUser?.following.length}
              {targetUser?.following.length === undefined && (
                <Skeleton height={14} width={14} count={1} />
              )}{' '}
              following
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  targetUser: state.targetUser,
})

const mapDispatchToProps = (dispatch) => ({
  toggleFollowing: (target, current) => {
    return dispatch(toggleFollowing(target, current))
  },
  uploadAvatar: (file) => {
    return dispatch(uploadAvatar(file))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
