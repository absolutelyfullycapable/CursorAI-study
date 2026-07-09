"use client"

import { useState } from "react"
import { Plus, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { colorSwatch, noteColors, type NoteColor } from "@/lib/notes"

type NoteComposerProps = {
  onAdd: (note: { title: string; content: string; color: NoteColor }) => void
}

export function NoteComposer({ onAdd }: NoteComposerProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState<NoteColor>("yellow")

  const canSubmit = title.trim().length > 0 || content.trim().length > 0

  function handleSubmit() {
    if (!canSubmit) return
    onAdd({
      title: title.trim() || "제목 없음",
      content: content.trim(),
      color,
    })
    setTitle("")
    setContent("")
    setColor("yellow")
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Sparkles className="h-5 w-5" />
        <span className="font-display text-base font-bold">새 메모 적기</span>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full rounded-2xl bg-muted px-4 py-3 font-display text-lg font-bold text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) {
            handleSubmit()
          }
        }}
        placeholder="오늘 떠오른 생각을 자유롭게 적어보세요..."
        rows={3}
        className="mt-3 w-full resize-none rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" role="radiogroup" aria-label="메모 색상 선택">
          {noteColors.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              aria-label={`${c} 색상`}
              onClick={() => setColor(c)}
              className={cn(
                "h-7 w-7 rounded-full transition-transform",
                colorSwatch[c],
                color === c
                  ? "scale-110 ring-2 ring-foreground/40 ring-offset-2 ring-offset-card"
                  : "hover:scale-105",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-2.5 font-display text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          추가하기
        </button>
      </div>
    </div>
  )
}
