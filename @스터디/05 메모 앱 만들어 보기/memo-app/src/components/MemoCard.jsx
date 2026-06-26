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
      className={`card h-100 border-0 shadow-sm rounded-4 memo-card ${
        isEditing ? 'border-primary border' : ''
      }`}
    >
      <div className="card-body d-flex flex-column p-3 p-sm-4">
        {isEditing ? (
          <textarea
            className="form-control bg-light border-0 rounded-3 mb-3 flex-grow-1"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            autoFocus
          />
        ) : (
          <p className="card-text memo-text flex-grow-1 mb-3">{memo.text}</p>
        )}

        <div className="d-flex align-items-center justify-content-between mt-auto">
          <small className="text-secondary">{formatDate(memo.createdAt)}</small>
          <div className="btn-group btn-group-sm" role="group">
            {isEditing ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={saveEdit}
                  disabled={!editText.trim()}
                >
                  저장
                </button>
                <button className="btn btn-outline-secondary" onClick={cancelEdit}>
                  취소
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-secondary" onClick={startEdit}>
                  수정
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => onDelete(memo.id)}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoCard
