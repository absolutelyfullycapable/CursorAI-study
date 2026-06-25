// 인스타그램에서 사용하는 라인 아이콘들을 SVG로 직접 그린다.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HeartIcon({ filled = false, size = 24 }) {
  return (
    <svg {...base} width={size} height={size} fill={filled ? '#ed4956' : 'none'} stroke={filled ? '#ed4956' : 'currentColor'}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export function CommentIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

export function ShareIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

export function BookmarkIcon({ filled = false, size = 24 }) {
  return (
    <svg {...base} width={size} height={size} fill={filled ? 'currentColor' : 'none'}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function MoreIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}

export function HomeIcon({ size = 24, filled = false }) {
  return (
    <svg {...base} width={size} height={size} fill={filled ? 'currentColor' : 'none'} strokeWidth={filled ? 0 : 1.8}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  )
}

export function SearchIcon({ size = 18 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function ExploreIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="16 8 14 14 8 16 10 10 16 8" />
    </svg>
  )
}

export function ReelsIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="8" y1="3" x2="10" y2="8" />
      <line x1="14" y1="3" x2="16" y2="8" />
      <polygon points="11 11 15 13 11 15 11 11" fill="currentColor" />
    </svg>
  )
}

export function MessageIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

export function PlusIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

export function MenuIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function ThreadsIcon({ size = 24 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M12 21c-4.5 0-7.5-3.2-7.5-9S7.5 3 12 3c3.2 0 5.4 1.5 6.4 4" />
      <path d="M9.5 13c.4 2 2 3 3.7 2.8 1.6-.2 2.5-1.4 2.4-2.8-.2-2-2.2-2.6-3.8-2.4-2 .3-2.9 1.7-2.1 3.2" />
    </svg>
  )
}
