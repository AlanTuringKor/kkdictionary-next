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
    <div className="bg-white border rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-bold mb-4 text-primary">최근 등록된 단어</h2>
      <ul className="space-y-3 text-sm">
        {currentEntries.map(({ word, date }) => (
          <li key={`${word}-${date}`} className="flex justify-between items-center">
            <Link
              href={`/search/${encodeURIComponent(word)}`}
              className="text-gray-900 hover:text-primary truncate max-w-[150px]"
            >
              {word}
            </Link>
            <span className="text-gray-400 text-xs whitespace-nowrap">{formatDate(date)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-2 py-0.5 text-xs border rounded disabled:opacity-30"
        >
          ◀
        </button>
        <span className="text-xs text-gray-500">
          {page} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-2 py-0.5 text-xs border rounded disabled:opacity-30"
        >
          ▶
        </button>
      </div>
    </div>
  )
}