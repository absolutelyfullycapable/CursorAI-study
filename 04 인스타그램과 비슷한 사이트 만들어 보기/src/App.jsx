import LeftNav from './components/LeftNav.jsx'
import Stories from './components/Stories.jsx'
import Feed from './components/Feed.jsx'
import Sidebar from './components/Sidebar.jsx'
import { MobileTopBar, MobileTabBar } from './components/MobileNav.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <LeftNav />
      <MobileTopBar />

      <main className="main">
        <section className="content">
          <Stories />
          <Feed />
        </section>
        <Sidebar />
      </main>

      <MobileTabBar />
    </div>
  )
}
