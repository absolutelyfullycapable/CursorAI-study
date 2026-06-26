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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-10 px-4">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="flex items-center justify-center gap-2 text-4xl font-extrabold tracking-tight text-slate-800">
            <span>📝</span>
            <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              나의 메모
            </span>
          </h1>
          <p className="mt-2 text-slate-500">생각날 때마다 가볍게 적어두세요</p>
        </header>

        <div className="mb-4 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
          <textarea
            className="w-full resize-y rounded-xl border border-transparent bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            placeholder="새 메모를 입력하세요... (Ctrl/Cmd + Enter 로 추가)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleDraftKeyDown}
            rows={3}
          />
          <div className="mt-3 flex justify-end">
            <button
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={addMemo}
              disabled={!draft.trim()}
            >
              <span className="text-lg leading-none">+</span> 새 메모
            </button>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-1 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
          <span className="text-slate-400">🔍</span>
          <input
            className="w-full bg-transparent py-2.5 text-slate-800 outline-none placeholder:text-slate-400"
            type="text"
            placeholder="메모 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600 transition hover:bg-slate-300"
              onClick={() => setSearch('')}
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>

        {filteredMemos.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <div className="mb-3 text-5xl opacity-60">🗒️</div>
            <p>
              {memos.length === 0
                ? '아직 메모가 없습니다. 첫 메모를 추가해 보세요!'
                : '검색 결과가 없습니다.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredMemos.map((memo) => (
              <MemoCard
                key={memo.id}
                memo={memo}
                onUpdate={updateMemo}
                onDelete={deleteMemo}
              />
            ))}
          </div>
        )}

        <footer className="mt-10 text-center text-sm text-slate-400">
          총 {memos.length}개의 메모
        </footer>
      </div>
    </div>
  )
}

export default App
