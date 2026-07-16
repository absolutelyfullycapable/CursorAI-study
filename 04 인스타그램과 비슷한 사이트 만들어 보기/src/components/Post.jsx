import { useState } from 'react'
import {
  HeartIcon,
  CommentIcon,
  ShareIcon,
  BookmarkIcon,
  MoreIcon,
} from './Icons.jsx'

export default function Post({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [showHeart, setShowHeart] = useState(false)
  const [pop, setPop] = useState(false)
  const [comment, setComment] = useState('')

  const setLike = (next) => {
    setLiked(next)
    setLikes((n) => n + (next ? 1 : -1))
    if (next) {
      setPop(true)
      setTimeout(() => setPop(false), 350)
    }
  }

  const toggleLike = () => setLike(!liked)

  const handleDoubleClick = () => {
    if (!liked) setLike(true)
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 900)
  }

  return (
    <article className="post">
      <header className="post__head">
        <div className="post__user">
          <span className="post__avatar-ring">
            <img className="post__avatar" src={post.avatar} alt={post.username} />
          </span>
          <div className="post__meta">
            <span className="post__username">{post.username}</span>
            <span className="post__dot">•</span>
            <span className="post__time-inline">{post.time}</span>
            {post.location && (
              <span className="post__location">· {post.location}</span>
            )}
          </div>
        </div>
        <button className="post__more"><MoreIcon /></button>
      </header>

      <div className="post__image-wrap" onDoubleClick={handleDoubleClick}>
        <img className="post__image" src={post.image} alt={`${post.username}의 게시물`} />
        {showHeart && (
          <span className="post__burst">
            <HeartIcon filled size={96} />
          </span>
        )}
      </div>

      <div className="post__actions">
        <div className="post__actions-left">
          <button className={`icon-btn ${pop ? 'heart-pop' : ''}`} onClick={toggleLike}>
            <HeartIcon filled={liked} />
          </button>
          <button className="icon-btn"><CommentIcon /></button>
          <button className="icon-btn"><ShareIcon /></button>
        </div>
        <button className="icon-btn" onClick={() => setSaved((s) => !s)}>
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      <div className="post__body">
        <p className="post__likes">좋아요 {likes.toLocaleString()}개</p>
        <p className="post__caption">
          <span className="post__username">{post.username}</span> {post.caption}
        </p>

        {post.comments.length > 0 && (
          <button className="post__view-comments">
            댓글 {post.comments.length}개 모두 보기
          </button>
        )}
        {post.comments.map((c, i) => (
          <p className="post__comment" key={i}>
            <span className="post__username">{c.user}</span> {c.text}
          </p>
        ))}
      </div>

      <div className="post__add-comment">
        <input
          type="text"
          placeholder="댓글 달기..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className={`post__post-btn ${comment.trim() ? 'post__post-btn--active' : ''}`}
          onClick={() => setComment('')}
        >
          게시
        </button>
      </div>
    </article>
  )
}
