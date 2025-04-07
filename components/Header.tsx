// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const showSearch = pathname !== '/'

  return (
    <header className="w-full bg-primary text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          ㅋㅋ백과
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
