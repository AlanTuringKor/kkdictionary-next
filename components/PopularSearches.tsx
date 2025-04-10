'use client'

// src/components/PopularSearches.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchPopularSearches } from '@/lib/fetchPopularSearches'

interface Props {
  days: number
}

export default function PopularSearches({ days }: Props) {
  const [entries, setEntries] = useState<{ word: string; count: number }[]>([])
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(entries.length / itemsPerPage)
  const start = (page - 1) * itemsPerPage
  const currentEntries = entries.slice(start, start + itemsPerPage)

  useEffect(() => {
    const fetchData = async () => {
      const popularSearches = await fetchPopularSearches(days)
      setEntries(popularSearches)
    }
    fetchData()
  }, [days])

  const handlePrev = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1)
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-bold mb-4 text-primary">
        {days === 7 ? '최근 7일간 인기 검색어' : '전체 인기 검색어'}
      </h2>
      <ul className="space-y-3 text-sm">
        {currentEntries.map(({ word, count }) => (
          <li key={`${word}-${count}`} className="flex justify-between items-center">
            <Link
              href={`/search/${encodeURIComponent(word)}`}
              className="text-gray-900 truncate max-w-[150px] hover:text-primary"
            >
              {word}
            </Link>
            <span className="text-gray-400 text-xs whitespace-nowrap">{count}회</span>
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
