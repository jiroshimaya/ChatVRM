import { IconProvider } from '@/components/IconProvider'
import '@/styles/globals.css'

export const metadata = {
  title: 'ChatVRM',
  description: 'Talk with VRM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=M_PLUS_2:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundImage: `url(/bg-c.png)` }} className="font-M_PLUS_2">
        <IconProvider />
        {children}
      </body>
    </html>
  )
}
