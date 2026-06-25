import { useState } from 'react'
import {
  HomeIcon,
  SearchIcon,
  ExploreIcon,
  ReelsIcon,
  MessageIcon,
  HeartIcon,
  PlusIcon,
  MenuIcon,
  ThreadsIcon,
} from './Icons.jsx'
import { currentUser } from '../data/posts.js'

const items = [
  { key: 'home', label: '홈', icon: (active) => <HomeIcon filled={active} /> },
  { key: 'search', label: '검색', icon: () => <SearchIcon size={24} /> },
  { key: 'explore', label: '탐색 탭', icon: () => <ExploreIcon /> },
  { key: 'reels', label: '릴스', icon: () => <ReelsIcon /> },
  { key: 'messages', label: '메시지', icon: () => <MessageIcon /> },
  { key: 'alerts', label: '알림', icon: (active) => <HeartIcon filled={active} /> },
  { key: 'create', label: '만들기', icon: () => <PlusIcon /> },
  { key: 'threads', label: 'Threads', icon: () => <ThreadsIcon /> },
]

export default function LeftNav() {
  const [active, setActive] = useState('home')

  return (
    <nav className="leftnav">
      <div className="leftnav__top">
        <h1 className="leftnav__logo">Instagram</h1>
        <span className="leftnav__logo-mark">
          <ThreadsIcon size={28} />
        </span>
      </div>

      <ul className="leftnav__list">
        {items.map((item) => (
          <li key={item.key}>
            <button
              className={`navitem ${active === item.key ? 'navitem--active' : ''}`}
              onClick={() => setActive(item.key)}
            >
              <span className="navitem__icon">{item.icon(active === item.key)}</span>
              <span className="navitem__label">{item.label}</span>
            </button>
          </li>
        ))}

        <li>
          <button
            className={`navitem ${active === 'profile' ? 'navitem--active' : ''}`}
            onClick={() => setActive('profile')}
          >
            <span className="navitem__icon">
              <img className="navitem__avatar" src={currentUser.avatar} alt={currentUser.username} />
            </span>
            <span className="navitem__label">프로필</span>
          </button>
        </li>
      </ul>

      <div className="leftnav__bottom">
        <button className="navitem">
          <span className="navitem__icon"><MenuIcon /></span>
          <span className="navitem__label">더 보기</span>
        </button>
      </div>
    </nav>
  )
}
