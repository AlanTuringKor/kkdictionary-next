'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import LoadingSpinner from './LoadingSpinner'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSearch = (input?: string) => {
    const finalQuery = input || query
    if (!finalQuery.trim()) return

    startTransition(() => {
      router.push(`/search/${encodeURIComponent(finalQuery)}`)
    })

    setSuggestions([])
    setIsFocused(false)
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchSuggestions = async () => {
      if (!query) {
        setSuggestions([])
        setSelectedIndex(-1)
        return
      }

      try {
        const res = await fetch(`/api/autocomplete?query=${query}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setSuggestions(data)
        setSelectedIndex(-1)
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err)
      }
    }

    fetchSuggestions()
    return () => controller.abort()
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSearch(suggestions[selectedIndex])
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setSelectedIndex(-1)
      setIsFocused(false)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          placeholder="단어를 입력하세요"
          className="w-full p-3 border border-gray-300 rounded-l-xl focus:outline-none"
        />
        <button
          onClick={() => handleSearch()}
          className="bg-accent text-black px-4 py-3 rounded-r-xl hover:brightness-110"
        >
          검색
        </button>
      </div>

      {/* 자동완성 목록 */}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow">
          {suggestions.map((word, index) => (
            <li
              key={word}
              onClick={() => handleSearch(word)}
              className={`px-4 py-2 cursor-pointer ${
                selectedIndex === index ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
            >
              {word}
            </li>
          ))}
        </ul>
      )}

      {/* 로딩 메시지 */}
      {isPending && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/90 px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3 backdrop-blur">
          <LoadingSpinner />
          <p className="text-gray-700">검색 중입니다...</p>
        </div>
      )}
    </div>
  )
}
