import { useState } from 'react'

function formatDate(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function MemoCard({ memo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(memo.text)

  const startEdit = () => {
    setEditText(memo.text)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setEditText(memo.text)
    setIsEditing(false)
  }

  const saveEdit = () => {
    const text = editText.trim()
    if (!text) return
    onUpdate(memo.id, text)
    setIsEditing(false)
  }

  return (
    <div
      className={`animate-fade-in-up flex h-full flex-col rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5 ${
        isEditing ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-100'
      }`}
    >
      {isEditing ? (
        <textarea
          className="mb-3 w-full flex-1 resize-y rounded-xl border border-transparent bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-200"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={3}
          autoFocus
        />
      ) : (
        <p className="mb-3 flex-1 whitespace-pre-wrap break-words text-slate-800">
          {memo.text}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">
          {formatDate(memo.createdAt)}
        </span>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={saveEdit}
                disabled={!editText.trim()}
              >
                저장
              </button>
              <button
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95"
                onClick={cancelEdit}
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95"
                onClick={startEdit}
              >
                수정
              </button>
              <button
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-95"
                onClick={() => onDelete(memo.id)}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemoCard
