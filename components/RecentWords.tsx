'use client'

// src/components/RecentWords.tsx
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  entries: { word: string; date: string }[]
}

export default function RecentWords({ entries }: Props) {
  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return `${date.getMonth() + 1}.${date.getDate()}`
  }

  const itemsPerPage = 10
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(entries.length / itemsPerPage)
  const start = (page - 1) * itemsPerPage
  const currentEntries = entries.slice(start, start + itemsPerPage)

  const handlePrev = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1)
  }

  return (
    <div className="bg-white border-2 border-[#FFDC00] rounded-none p-6 font-mono text-[#1a1a1a] shadow-sm text-base">
      <h2 className="text-sm font-bold mb-5 text-[#001f3f] tracking-widest uppercase border-b border-[#FFDC00] pb-2">
        최근 등록된 단어
      </h2>
      <ul className="divide-y divide-[#f0f0f0] text-sm">
        {currentEntries.map(({ word, date }) => (
          <li
            key={`${word}-${date}`}
            className="flex justify-between items-center py-2"
          >
            <Link
              href={`/search/${encodeURIComponent(word)}`}
              className="text-[#1a1a1a] hover:text-[#FFDC00] hover:underline truncate max-w-[160px]"
            >
              {word}
            </Link>
            <span className="text-[#999] whitespace-nowrap text-sm">{formatDate(date)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center mt-6 gap-2 text-[#666] text-sm">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="hover:text-[#001f3f] disabled:opacity-30"
        >
          ◀
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="hover:text-[#001f3f] disabled:opacity-30"
        >
          ▶
        </button>
      </div>
    </div>

  )
}