'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Header() {
  const pathname = usePathname()
  const showSearch = pathname !== '/'

  return (
    <header className="w-full bg-primary text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        {/* 로고 + 텍스트 */}
        <Link href="/" className="flex items-center gap-6 group">
          <div className="relative w-20 h-10">
            <Image
              src="/logo.png"
              alt="ㅋㅋ 로고"
              fill
              className="object-contain transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <span className="hidden sm:inline text-xl font-bold tracking-tight text-white">
            ㅋㅋ백과
          </span>
        </Link>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link href="/about" className="text-sm hover:underline">
            소개
          </Link>
        </div>
      </div>
    </header>
  )
}
