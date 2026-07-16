import {
  HomeIcon,
  HeartIcon,
  MessageIcon,
  ExploreIcon,
  ReelsIcon,
  PlusIcon,
} from './Icons.jsx'
import { currentUser } from '../data/posts.js'

export function MobileTopBar() {
  return (
    <header className="mtop">
      <h1 className="mtop__logo">Instagram</h1>
      <div className="mtop__actions">
        <button className="icon-btn"><HeartIcon /></button>
        <button className="icon-btn"><MessageIcon /></button>
      </div>
    </header>
  )
}

export function MobileTabBar() {
  return (
    <nav className="mtab">
      <button className="mtab__btn"><HomeIcon filled /></button>
      <button className="mtab__btn"><ExploreIcon /></button>
      <button className="mtab__btn"><ReelsIcon /></button>
      <button className="mtab__btn"><PlusIcon /></button>
      <button className="mtab__btn mtab__avatar">
        <img src={currentUser.avatar} alt={currentUser.username} />
      </button>
    </nav>
  )
}
