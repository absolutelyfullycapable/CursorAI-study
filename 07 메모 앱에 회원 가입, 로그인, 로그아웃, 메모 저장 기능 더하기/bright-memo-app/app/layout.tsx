import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Baloo_2, Nunito } from 'next/font/google'
import { appleIcon, iconDark32, iconLight32, iconSvg } from '@/lib/site-icons'
import './globals.css'

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  weight: ['500', '600', '700', '800'],
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: '햇살 메모 · Sunny Notes',
  description: '밝고 상쾌한 하루를 위한 메모 앱',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: iconLight32,
        media: '(prefers-color-scheme: light)',
      },
      {
        url: iconDark32,
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: iconSvg,
        type: 'image/svg+xml',
      },
    ],
    apple: appleIcon,
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`bg-background ${baloo.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
