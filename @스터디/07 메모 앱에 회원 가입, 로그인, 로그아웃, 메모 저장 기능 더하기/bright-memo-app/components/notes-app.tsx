"use client"

import { useMemo, useState, useTransition } from "react"
import { LogOut, Search, Sun, StickyNote } from "lucide-react"
import { NoteCard } from "@/components/note-card"
import { NoteComposer } from "@/components/note-composer"
import {
  colorSwatch,
  noteColors,
  todayLabel,
  type Note,
  type NoteColor,
} from "@/lib/notes"
import { logout } from "@/app/actions/auth"
import {
  createNote,
  deleteNote as deleteNoteAction,
  togglePinNote,
  updateNote as updateNoteAction,
} from "@/app/actions/notes"
import type { CurrentUser } from "@/lib/auth"

export function NotesApp({
  user,
  initialNotes,
}: {
  user: CurrentUser
  initialNotes: Note[]
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [query, setQuery] = useState("")
  const [, startTransition] = useTransition()

  function addNote(data: { title: string; content: string; color: NoteColor }) {
    const optimistic: Note = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      color: data.color,
      date: todayLabel(),
      pinned: false,
    }
    setNotes((prev) => [optimistic, ...prev])

    startTransition(async () => {
      const saved = await createNote(data)
      setNotes((prev) =>
        prev.map((n) =>
          n.id === optimistic.id
            ? {
                id: saved.id,
                title: saved.title,
                content: saved.content,
                color: saved.color as NoteColor,
                date: todayLabel(),
                pinned: saved.pinned,
              }
            : n,
        ),
      )
    })
  }

  function togglePin(id: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    )
    startTransition(async () => {
      await togglePinNote(id)
    })
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    startTransition(async () => {
      await deleteNoteAction(id)
    })
  }

  function updateNote(
    id: string,
    data: { title: string; content: string; color: NoteColor },
  ) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...data, date: todayLabel() } : n,
      ),
    )
    startTransition(async () => {
      await updateNoteAction(id, data)
    })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q),
        )
      : notes
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned))
  }, [notes, query])

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Sun className="h-6 w-6" />
            <span className="font-display text-sm font-bold uppercase tracking-wide">
              {todayLabel()}
            </span>
          </div>
          <h1 className="mt-1 font-display text-4xl font-extrabold text-balance text-foreground sm:text-5xl">
            햇살 메모
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">오늘 하루를 산뜻하게 기록해요.</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-3 pr-1.5 shadow-sm">
            <span className="text-sm font-bold text-foreground">{user.name}님</span>
            <form action={logout}>
              <button
                type="submit"
                aria-label="로그아웃"
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                로그아웃
              </button>
            </form>
          </div>

          <label className="relative block w-full sm:w-72">
            <span className="sr-only">메모 검색</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="메모 검색..."
              className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
      </header>

      <div className="mb-8">
        <NoteComposer onAdd={addNote} />
      </div>

      {filtered.length > 0 ? (
        <section
          aria-label="메모 목록"
          className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid"
        >
          {filtered.map((note, i) => (
            <NoteCard
              key={note.id}
              note={note}
              index={i}
              onTogglePin={togglePin}
              onDelete={deleteNote}
              onUpdate={updateNote}
            />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 py-16 text-center">
          <StickyNote className="h-10 w-10 text-muted-foreground" />
          <p className="font-display text-lg font-bold text-foreground">
            {query ? "검색 결과가 없어요" : "아직 메모가 없어요"}
          </p>
          <p className="text-sm text-muted-foreground">
            {query ? "다른 단어로 찾아보세요." : "위에서 첫 메모를 적어보세요!"}
          </p>
        </div>
      )}

      <footer className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="flex gap-1">
          {noteColors.map((c) => (
            <span key={c} className={`h-2 w-2 rounded-full ${colorSwatch[c]}`} />
          ))}
        </span>
        <span>총 {notes.length}개의 메모</span>
      </footer>
    </main>
  )
}
