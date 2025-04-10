'use client'

import Link from 'next/link'
import { Nanum_Myeongjo } from 'next/font/google'

const nanum = Nanum_Myeongjo({ weight: '400', subsets: ['latin'], display: 'swap' })

export default function Header() {
  return (
    <header className="w-full bg-[#001830] py-6 shadow-sm border-b border-[#FFDC00]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-mono text-white text-lg">

        {/* 사이트 이름 */}
        <Link href="/" className="flex items-center gap-4 group mx-auto ml-0 sm:ml-8 justify-center sm:justify-start w-full sm:w-auto ">
          <span className={`text-4xl font-bold tracking-tight text-[#FFDC00] transition -rotate-[10deg]  ${nanum.className}`}>
            <span className="block sm:hidden">ㅋㅋ</span>
            <span className="hidden sm:inline">ㅋㅋ백과</span>
          </span>
        </Link>

        {/* 메뉴 */}
        <nav className="flex items-center gap-8 text-sm">
          <Link href="/about" className="hover:text-[#FFDC00] transition">
            소개
          </Link>
          {/* 더 추가하고 싶으면 여기에 */}
        </nav>
      </div>
    </header>
  )
}
