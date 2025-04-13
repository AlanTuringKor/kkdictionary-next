'use client'

import Link from 'next/link'
import localFont from 'next/font/local'
import { useEffect, useState } from 'react'

const nanum = localFont({
  src: 'fonts/NanumMyeongjo-ExtraBold.ttf',
  weight: '400',
  display: 'swap',
  variable: '--font-nanum',
})

export default function Header() {
  const [visitors, setVisitors] = useState(0)

  useEffect(() => {
    async function fetchVisitors() {
      const res = await fetch('/api/visitors')
      const data = await res.json()
      setVisitors(data.visitors)
    }

    fetchVisitors()
    const interval = setInterval(fetchVisitors, 60000) // 매 1분마다 새로고침

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="w-full bg-[#001830] py-6 shadow-sm border-b border-[#FFDC00]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-white text-lg">

        {/* 사이트 이름 */}
        <Link href="/" className="flex items-center gap-4 group justify-center sm:justify-start">
          <span className={`text-4xl font-bold tracking-tight text-[#FFDC00] transition -rotate-[10deg] ${nanum.className}`}>
            <span className="block sm:hidden">ㅋㅋ</span>
            <span className="hidden sm:inline">ㅋㅋ백과</span>
          </span>
        </Link>

        {/* 방문자 수 */}
        <div className="text-sm sm:text-base font-mono text-[#FFDC00]">
          오늘 방문자 수: {visitors.toLocaleString()}명
        </div>

        {/* 메뉴 & 버튼 */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/about" className="hover:text-[#FFDC00] transition">
            소개
          </Link>

          {/* 🔥 단어 추가하기 버튼 */}
          <Link
            href="/add"
            className="bg-[#FFDC00] text-[#001f3f] font-extrabold px-6 py-3 sm:px-8 sm:py-3.5 rounded-full shadow-[0_4px_20px_rgba(255,220,0,0.6)] hover:shadow-[0_6px_30px_rgba(255,220,0,0.85)] hover:scale-105 transition-all duration-300 uppercase tracking-wider text-base sm:text-lg hover:animate-none"
          >
            단어 추가하기
          </Link>
        </div>
      </div>
    </header>
  )
}
