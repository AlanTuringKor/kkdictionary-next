// src/app/layout.tsx
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ClientLogger from '@/components/ClientLogger'

export const metadata = {
  title: 'ㅋㅋ백과 - 한국어 신조어 사전',
  description: 'ㅋㅋ백과는 한국어 신조어와 비속어를 설명하는 커뮤니티 기반 백과사전입니다.',
  metadataBase: new URL('https://kkdictionary.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ㅋㅋ백과',
    description: '한국어 신조어/비속어 커뮤니티 사전',
    url: 'https://kkdictionary.com',
    siteName: 'ㅋㅋ백과',
    images: [
      {
        url: '/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'ㅋㅋ백과 썸네일',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    other: {
      'naver-site-verification': '0db3774f949bb6912125832f9506853a58f66469',
    },
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[#001f3f] text-[#f0f0f0] font-mono">
        <ClientLogger />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
