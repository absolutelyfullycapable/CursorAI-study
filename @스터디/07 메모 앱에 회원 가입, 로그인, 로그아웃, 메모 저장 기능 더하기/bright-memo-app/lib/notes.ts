export type NoteColor = "yellow" | "pink" | "mint" | "blue" | "peach"

export type Note = {
  id: string
  title: string
  content: string
  color: NoteColor
  date: string
  pinned: boolean
}

export const noteColors: NoteColor[] = ["yellow", "pink", "mint", "blue", "peach"]

export const colorSwatch: Record<NoteColor, string> = {
  yellow: "bg-note-yellow",
  pink: "bg-note-pink",
  mint: "bg-note-mint",
  blue: "bg-note-blue",
  peach: "bg-note-peach",
}

export function todayLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date())
}

export const initialNotes: Note[] = [
  {
    id: "1",
    title: "오늘의 다짐",
    content: "물 2L 마시기, 산책 30분, 그리고 활짝 웃기 :)",
    color: "yellow",
    date: "6월 12일",
    pinned: true,
  },
  {
    id: "2",
    title: "장보기 목록",
    content: "• 딸기\n• 그릭요거트\n• 바질 화분\n• 레몬 두 개",
    color: "mint",
    date: "6월 11일",
    pinned: false,
  },
  {
    id: "3",
    title: "아이디어 메모",
    content: "주말 브런치 모임 초대장 디자인. 파스텔 톤에 손글씨 느낌 폰트로!",
    color: "pink",
    date: "6월 10일",
    pinned: false,
  },
  {
    id: "4",
    title: "읽고 싶은 책",
    content: "『아주 작은 습관의 힘』 다시 읽기. 이번엔 밑줄 그으면서 천천히.",
    color: "blue",
    date: "6월 9일",
    pinned: false,
  },
  {
    id: "5",
    title: "감사한 일",
    content: "창가로 들어오는 햇살, 따뜻한 커피 한 잔, 친구의 안부 전화.",
    color: "peach",
    date: "6월 8일",
    pinned: true,
  },
]
