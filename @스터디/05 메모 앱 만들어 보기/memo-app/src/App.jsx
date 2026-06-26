import { useEffect, useMemo, useState } from 'react'
import MemoCard from './components/MemoCard'
import './App.css'

const STORAGE_KEY = 'my-memo-app/memos'

function loadMemos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const [memos, setMemos] = useState(loadMemos)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  }, [memos])

  const addMemo = () => {
    const text = draft.trim()
    if (!text) return
    const newMemo = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
    }
    setMemos((prev) => [newMemo, ...prev])
    setDraft('')
  }

  const updateMemo = (id, nextText) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id ? { ...memo, text: nextText } : memo,
      ),
    )
  }

  const deleteMemo = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id))
  }

  const handleDraftKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      addMemo()
    }
  }

  const filteredMemos = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return memos
    return memos.filter((memo) => memo.text.toLowerCase().includes(keyword))
  }, [memos, search])

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 나의 메모</h1>
        <p className="subtitle">생각날 때마다 가볍게 적어두세요</p>
      </header>

      <section className="composer">
        <textarea
          className="composer-input"
          placeholder="새 메모를 입력하세요... (Ctrl/Cmd + Enter 로 추가)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleDraftKeyDown}
          rows={3}
        />
        <button
          className="btn btn-primary add-btn"
          onClick={addMemo}
          disabled={!draft.trim()}
        >
          + 새 메모
        </button>
      </section>

      <section className="search">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 메모 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch('')}>
            ✕
          </button>
        )}
      </section>

      <main className="memo-list">
        {filteredMemos.length === 0 ? (
          <p className="empty">
            {memos.length === 0
              ? '아직 메모가 없습니다. 첫 메모를 추가해 보세요!'
              : '검색 결과가 없습니다.'}
          </p>
        ) : (
          filteredMemos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              onUpdate={updateMemo}
              onDelete={deleteMemo}
            />
          ))
        )}
      </main>
    </div>
  )
}

export default App
