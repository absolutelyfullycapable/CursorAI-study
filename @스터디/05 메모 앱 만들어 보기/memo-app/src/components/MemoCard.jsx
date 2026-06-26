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
    <article className={`memo-card ${isEditing ? 'editing' : ''}`}>
      {isEditing ? (
        <textarea
          className="memo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={3}
          autoFocus
        />
      ) : (
        <p className="memo-text">{memo.text}</p>
      )}

      <div className="memo-footer">
        <span className="memo-date">{formatDate(memo.createdAt)}</span>
        <div className="memo-actions">
          {isEditing ? (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={saveEdit}
                disabled={!editText.trim()}
              >
                저장
              </button>
              <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                취소
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={startEdit}>
                수정
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(memo.id)}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default MemoCard
