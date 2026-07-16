import { suggestions, currentUser } from '../data/posts.js'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__me">
        <img className="sidebar__avatar" src={currentUser.avatar} alt={currentUser.username} />
        <div className="sidebar__me-info">
          <span className="sidebar__username">{currentUser.username}</span>
          <span className="sidebar__name">{currentUser.name}</span>
        </div>
        <button className="sidebar__switch">전환</button>
      </div>

      <div className="sidebar__head">
        <span className="sidebar__title">회원님을 위한 추천</span>
        <button className="sidebar__all">모두 보기</button>
      </div>

      <ul className="sidebar__list">
        {suggestions.map((s) => (
          <li className="suggestion" key={s.id}>
            <img className="suggestion__avatar" src={s.avatar} alt={s.username} />
            <div className="suggestion__info">
              <span className="suggestion__username">{s.username}</span>
              <span className="suggestion__reason">{s.reason}</span>
            </div>
            <button className="suggestion__follow">팔로우</button>
          </li>
        ))}
      </ul>

      <footer className="sidebar__footer">
        <p>소개 · 도움말 · 홍보 센터 · API · 채용 정보 · 개인정보처리방침 · 약관</p>
        <p>© 2026 INSTAGRAM CLONE</p>
      </footer>
    </aside>
  )
}
