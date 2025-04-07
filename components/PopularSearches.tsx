'use client'

// src/components/PopularSearches.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link' // Link 추가
import { fetchPopularSearches } from '@/lib/fetchPopularSearches'

interface Props {
  days: number
}

export default function PopularSearches({ days }: Props) {
  const [entries, setEntries] = useState<{ word: string; count: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const popularSearches = await fetchPopularSearches(days)
      setEntries(popularSearches)
    }
    fetchData()
  }, [days])

  return (
    <div className="bg-white border rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-bold mb-4 text-primary">
        {days === 7 ? '최근 7일간 인기 검색어' : '전체 인기 검색어'}
      </h2>
      <ul className="space-y-3 text-sm">
        {entries.map(({ word, count }) => (
          <li key={word} className="flex justify-between items-center">
            {/* 단어 클릭 시 검색 페이지로 리다이렉트 */}
            <Link
              href={`/search/${encodeURIComponent(word)}`} // 단어로 리다이렉트
              className="text-gray-900 truncate max-w-[150px] hover:text-primary"
            >
              {word}
            </Link>
            <span className="text-gray-400 text-xs">{count}회</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
