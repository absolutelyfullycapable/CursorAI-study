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
    <div className="app-bg min-vh-100 py-5">
      <div className="container" style={{ maxWidth: 760 }}>
        <header className="text-center mb-4">
          <h1 className="fw-bold display-6 mb-1">
            <span className="me-2">📝</span>나의 메모
          </h1>
          <p className="text-secondary mb-0">생각날 때마다 가볍게 적어두세요</p>
        </header>

        <div className="card border-0 shadow-sm rounded-4 mb-3">
          <div className="card-body p-3 p-sm-4">
            <textarea
              className="form-control border-0 bg-light rounded-3 mb-3"
              placeholder="새 메모를 입력하세요... (Ctrl/Cmd + Enter 로 추가)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleDraftKeyDown}
              rows={3}
            />
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary rounded-3 px-4 fw-semibold"
                onClick={addMemo}
                disabled={!draft.trim()}
              >
                <span className="me-1">+</span> 새 메모
              </button>
            </div>
          </div>
        </div>

        <div className="input-group input-group-lg mb-4 shadow-sm rounded-3">
          <span className="input-group-text bg-white border-0 text-secondary">
            🔍
          </span>
          <input
            className="form-control border-0"
            type="text"
            placeholder="메모 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-light border-0 text-secondary"
              onClick={() => setSearch('')}
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>

        {filteredMemos.length === 0 ? (
          <div className="text-center text-secondary py-5">
            <div className="display-6 mb-2 opacity-50">🗒️</div>
            <p className="mb-0">
              {memos.length === 0
                ? '아직 메모가 없습니다. 첫 메모를 추가해 보세요!'
                : '검색 결과가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {filteredMemos.map((memo) => (
              <div className="col-12 col-md-6" key={memo.id}>
                <MemoCard
                  memo={memo}
                  onUpdate={updateMemo}
                  onDelete={deleteMemo}
                />
              </div>
            ))}
          </div>
        )}

        <footer className="text-center text-secondary mt-5">
          <small>총 {memos.length}개의 메모</small>
        </footer>
      </div>
    </div>
  )
}

export default App
