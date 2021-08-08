import React, { Ref } from 'react'
import { useState } from 'react'
import { FaRegHeart, FaHeart, FaRegCommentDots } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import * as AC from '../../redux/AC'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

type Props = {
  refForInput: Ref<HTMLInputElement>
  handleFocus: () => void
  s: any
  currentUser: TUser
  currentUserName: TUser['username']
  currentUserId: TUser['userId']
  post: TPost
  username: TUser['username']
  toggleLike: (id: TPost['photoId']) => void
  sendComment: ({ comment, displayName, targetPhoto }: TSendingComment) => void
  poppedUp: boolean
}

const Info = ({
  refForInput,
  handleFocus,
  s,
  currentUser,
  post,
  username,
  toggleLike,
  sendComment,
  poppedUp,
}: Props) => {
  const isLiked = post.likes.includes(currentUser?.userId)

  const likesCount = post.likes.length
  const commentsCount = post.comments.length
  const [showingComments, setShowingComments] = useState(
    post.comments.length >= 3
      ? post.comments.slice(post.comments.length - 3, post.comments.length)
      : post.comments
  )
  const [comment, setComment] = useState('')

  return (
    <div
      style={
        poppedUp
          ? {
              display: 'flex',
              flexDirection: 'column',
            }
          : undefined
      }
      className={s.info}>
      <div
        style={
          poppedUp
            ? {
                order: 2,
              }
            : undefined
        }>
        <button
          className={s.info__button}
          onClick={() => {
            return toggleLike(post.photoId)
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            return toggleLike(post.photoId)
          }}>
          {isLiked ? <FaHeart style={{ fill: 'red' }} /> : <FaRegHeart />}
        </button>
        <button onClick={handleFocus} className={s.info__button}>
          <FaRegCommentDots />
        </button>
      </div>
      {post.caption && (
        <p>
          <strong>
            <Link to={`/p/${username}`} className={s.link}>
              {username}
            </Link>
          </strong>
          : {post.caption}
        </p>
      )}
      <div className={s.info__statistic}>
        <p>
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>
        <p>
          {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
        </p>
      </div>
      {post.comments.length > 3 && (
        <button
          className={s.toggleComments}
          aria-label="toggle comments"
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            if (showingComments.length === post.comments.length) {
              setShowingComments(
                post.comments.slice(
                  post.comments.length - 3,
                  post.comments.length
                )
              )
            } else {
              setShowingComments(post.comments)
            }
          }}
          onClick={() => {
            if (showingComments.length === post.comments.length) {
              setShowingComments(
                post.comments.slice(
                  post.comments.length - 3,
                  post.comments.length
                )
              )
            } else {
              setShowingComments(post.comments)
            }
          }}>
          {showingComments.length === post.comments.length
            ? 'Hide comments'
            : 'View all comments'}
        </button>
      )}
      <ul
        style={
          poppedUp
            ? {
                flexGrow: 1,
                overflow: 'auto',
                maxWidth: '25rem',
              }
            : undefined
        }>
        {!commentsCount && (
          <p style={{ color: '#666' }}>Here's no comments just yet</p>
        )}
        {showingComments &&
          showingComments.map((comment) => (
            <li key={comment.displayName + comment.comment}>
              <strong>
                <Link to={`/p/${comment.displayName}`} className={s.link}>
                  {comment.displayName}
                </Link>
              </strong>
              : {comment.comment}
            </li>
          ))}
      </ul>
      <form
        style={
          poppedUp
            ? {
                order: 2,
              }
            : undefined
        }
        className={s.info__form}
        onSubmit={(e) => {
          e.preventDefault()
          if (!comment.trim()) return
          setShowingComments((comments) => [
            ...comments,
            {
              comment,
              displayName: currentUser.username,
            },
          ])
          setComment('')
          return sendComment({
            displayName: currentUser.username,
            targetPhoto: post.photoId,
            comment: comment.trim(),
          })
        }}>
        <input
          ref={refForInput}
          className={s.info__form_input}
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment..."
        />
        <button className={s.info__form_button}>POST</button>
      </form>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleLike: (post: TPost) => {
    return dispatch(AC.toggleLike(post))
  },
  sendComment: ({ displayName, targetPhoto, comment }: TSendingComment) => {
    return dispatch(AC.sendComment({ displayName, targetPhoto, comment }))
  },
})

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
})

export default connect(mapStateToProps, mapDispatchToProps)(Info)
