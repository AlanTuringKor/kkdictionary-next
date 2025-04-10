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
    <div className="bg-white border-2 border-[#FFDC00] rounded-none p-6 font-mono text-[#1a1a1a] shadow-sm text-base">
      <h2 className="text-sm font-bold mb-5 text-[#001f3f] tracking-widest uppercase border-b border-[#FFDC00] pb-2">
        {days === 7 ? '최근 7일간 인기 검색어' : '전체 인기 검색어'}
      </h2>
      <ul className="divide-y divide-[#f0f0f0] text-sm">
        {currentEntries.map(({ word, count }) => (
          <li
            key={`${word}-${count}`}
            className="flex justify-between items-center py-2"
          >
            <Link
              href={`/search/${encodeURIComponent(word)}`}
              className="text-[#1a1a1a] hover:text-[#FFDC00] hover:underline truncate max-w-[160px]"
            >
              {word}
            </Link>
            <span className="text-[#999] whitespace-nowrap text-sm">{count}회</span>
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
