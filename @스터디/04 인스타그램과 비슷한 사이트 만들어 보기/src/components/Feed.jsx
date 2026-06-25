import Post from './Post.jsx'
import { posts } from '../data/posts.js'

export default function Feed() {
  return (
    <div className="feed">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
