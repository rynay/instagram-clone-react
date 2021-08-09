import Post from '../Post'
import Skeleton from 'react-loading-skeleton'
import s from './Timeline.module.scss'
import { RootStore } from '../../redux/store'

type Props = {
  posts: RootStore['dashboardPosts']
  currentUser: RootStore['currentUser']
}

const Timeline = ({ posts, currentUser }: Props) => {
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
        currentUser &&
        posts.map((post) => (
          <Post
            currentUserName={currentUser.username}
            key={post.photoId}
            currentUserId={currentUser.userId}
            post={post}
          />
        ))}
    </section>
  )
}

export default Timeline
