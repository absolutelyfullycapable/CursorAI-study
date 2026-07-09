"use client"

import { useState } from "react"
import { Check, Pencil, Pin, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { noteColors, type Note, type NoteColor } from "@/lib/notes"

const colorClasses: Record<NoteColor, string> = {
  yellow: "bg-note-yellow",
  pink: "bg-note-pink",
  mint: "bg-note-mint",
  blue: "bg-note-blue",
  peach: "bg-note-peach",
}

const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"]

type NoteCardProps = {
  note: Note
  index: number
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: { title: string; content: string; color: NoteColor }) => void
}

export function NoteCard({ note, index, onTogglePin, onDelete, onUpdate }: NoteCardProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [color, setColor] = useState<NoteColor>(note.color)

  function startEditing() {
    setTitle(note.title)
    setContent(note.content)
    setColor(note.color)
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
  }

  function saveEditing() {
    if (!title.trim() && !content.trim()) return
    onUpdate(note.id, { title: title.trim() || "제목 없음", content: content.trim(), color })
    setEditing(false)
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl p-5 text-foreground shadow-sm transition-all duration-200",
        !editing && "hover:-translate-y-1 hover:rotate-0 hover:shadow-lg",
        colorClasses[editing ? color : note.color],
        editing ? "rotate-0 shadow-lg ring-2 ring-primary/40" : rotations[index % rotations.length],
      )}
    >
      {editing ? (
        <>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            aria-label="메모 제목 수정"
            className="w-full rounded-xl bg-white/50 px-3 py-2 font-display text-lg font-bold text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            aria-label="메모 내용 수정"
            rows={4}
            className="w-full resize-none rounded-xl bg-white/50 px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5">
              {noteColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`${c} 색상 선택`}
                  aria-pressed={color === c}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-transform",
                    colorClasses[c],
                    color === c ? "scale-110 border-foreground/60" : "border-white/60 hover:scale-105",
                  )}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={cancelEditing}
                aria-label="수정 취소"
                className="rounded-full bg-black/5 p-2 text-foreground/60 transition-colors hover:bg-black/10"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={saveEditing}
                aria-label="수정 저장"
                className="rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:opacity-90"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold leading-tight text-balance">{note.title}</h3>
            <button
              type="button"
              onClick={() => onTogglePin(note.id)}
              aria-label={note.pinned ? "고정 해제" : "고정하기"}
              aria-pressed={note.pinned}
              className={cn(
                "shrink-0 rounded-full p-1.5 transition-colors",
                note.pinned
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/5 text-foreground/50 hover:bg-black/10",
              )}
            >
              <Pin className={cn("h-4 w-4", note.pinned && "fill-current")} />
            </button>
          </div>

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{note.content}</p>

          <div className="mt-auto flex items-center justify-between pt-2">
            <time className="text-xs font-semibold text-foreground/50">{note.date}</time>
            <div className="flex gap-1 opacity-0 transition-all group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={startEditing}
                aria-label="메모 수정"
                className="rounded-full p-1.5 text-foreground/40 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(note.id)}
                aria-label="메모 삭제"
                className="rounded-full p-1.5 text-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </article>
  )
}
