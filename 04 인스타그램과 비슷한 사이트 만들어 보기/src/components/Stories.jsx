import { stories } from '../data/posts.js'
import { PlusIcon } from './Icons.jsx'

export default function Stories() {
  return (
    <div className="stories">
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <div className={`story__ring ${story.isOwn ? 'story__ring--own' : ''}`}>
            <img className="story__img" src={story.avatar} alt={story.username} />
            {story.isOwn && (
              <span className="story__add">
                <PlusIcon size={16} />
              </span>
            )}
          </div>
          <span className="story__name">{story.username}</span>
        </div>
      ))}
    </div>
  )
}
