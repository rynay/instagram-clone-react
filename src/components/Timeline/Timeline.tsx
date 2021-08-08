import React from 'react'
import Post from '../Post'
import Skeleton from 'react-loading-skeleton'
import s from './Timeline.module.scss'

type Props = {
  posts: TPost[]
  currentUserName: TUser['username']
  currentUserId: TUser['userId']
}

const Timeline = ({ currentUserName, posts, currentUserId }: Props) => {
  return (
    <section className={s.container}>
      {posts?.length === 0 && <h2>Here's no posts just yet</h2>}
      {posts === null && (
        <Skeleton
          count={3}
          height={750}
          width={500}
          style={{ display: 'block', marginBottom: '3em' }}
        />
      )}
      {posts &&
        posts.map((post) => (
          <Post
            currentUserName={currentUserName}
            key={post.photoId}
            currentUserId={currentUserId}
            post={post}
          />
        ))}
    </section>
  )
}

export default Timeline
