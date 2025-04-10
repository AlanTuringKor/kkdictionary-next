'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import LoadingSpinner from './LoadingSpinner'
import Image from 'next/image'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [placeholder, setPlaceholder] = useState('')

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

  // 싸가지+위트 있는 placeholder 리스트
  const placeholders = [
    "오늘도 또 뭐 모르지? 써봐.",
    "너도 이 말 처음 듣지?",
    "할많하않, 그냥 검색이나 해.",
    "요즘 애들 말? 몰라도 돼. 검색하면 돼.",
    "뇌에 주름 하나 생기게 해줄게.",
    "그 말... 찐이야?",
    "얼탱이 없으면 검색부터.",
    "어디서 듣긴 했는데 뜻은 몰랐지?",
    "친구한테 아는 척 좀 해봐.",
    "그 단어, 감당 가능?",
    "말귀 못 알아들으면 서운하지?",
    "요즘 유행어 모르면 꼰대야.",
    "이걸 모른다고? 진심?",
    "X친 말투 좀 해석해줄게.",
    "검색 안 하고 버틸 자신 있음?",
    "너 이거 모르면 손절각.",
    "오늘도 한 입 단어충전 어때?",
    "대충 말하면 검색이 도와줌.",
    "무지성 검색 ㄱㄱ",
    "이 말, 내가 만든 건 아니야.",
    "검색은 살길이다.",
    "네가 생각한 그 뜻 아님.",
    "너만 몰라, 진심.",
    "그 단어, 조심히 다뤄.",
    "이건 좀... 어른 몰래 봐야 함.",
    "뜻 모르면 입 조심하자.",
    "써먹기 전에 뜻부터.",
    "철학이 담긴 단어일 수도?",
    "아는 척 금지, 검색 ㄱ",
    "이거 모르면 요즘 사람 아님.",
    "그 단어… 니가 만든 거 아니냐?",
    "ㅇㅇ 요즘 애들 이딴 말 씀",
    "지금 생각나는 단어 검색 ㄱ",
    "병1신같지만 쓸모있는 단어 찾는 중",
    "어디서 많이 들었는데… 뭐더라",
    "단어 뜻 모르면 걍 인터넷 끊으셈",
    "이거 욕이야 아니야? 판단 좀",
    "신조어 검색하다가 눈 썩음",
    "할많하않 단어 모음.zip",
    "DC인증 단어 찾는 중",
    "이건 좀 알려줘야지 시발",
    "초딩들이 쓰는 말인데 왜 유행함?",
    "그 말 뜻 모르면 인싸 못 함",
    "님 이 단어도 모르셈? ㅋㅋ",
    "찐따 감성 물씬 나는 단어 뭐였더라",
    "요즘 급식이 쓰는 말 찾아봄",
    "그거 그냥 아무말 대잔치 아님?",
    "욕 같은데 욕 아니고 욕인 단어",
    "병맛 단어 도감에 오신 걸 환영합니다",
    "개같은 뜻일 거 같긴 한데 정확히 모름",
    "이게 단어냐? 근데 웃기네",
    "나도 한때 저 단어 썼다…",
    "엄마가 들으면 혼날 단어 검색중",
    "찐 인싸들만 쓰는 은어 검색 ㄱㄱ",
    "이거 옛날에 디씨에서 본 거 같은데",
    "대충 그때 그 단어임",
    "이딴 말도 유행함? 진심?",
    "이게 2025년 신조어라고요?",
    "요즘 애들 진짜 무서움;;",
    "단어 뜻 모르고 썼다가 뒤통수 맞음"
  ]

  useEffect(() => {
    // 페이지 로드 시 랜덤 placeholder 선택
    const randomIndex = Math.floor(Math.random() * placeholders.length)
    setPlaceholder(placeholders[randomIndex])
  }, [])

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
    <div className="relative w-full max-w-xl font-mono text-base">
      <div className="flex border-8 border-[#FFDC00] rounded-none shadow-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          placeholder={placeholder}
          className="w-full p-4 text-base text-[#1a1a1a] bg-white focus:outline-none placeholder-[#999]"
        />
        <button
          onClick={() => handleSearch()}
          className="bg-[#FFDC00] text-[#001f3f] px-6 py-4 hover:brightness-105 transition flex items-center justify-center"
        >
          <Image src="/magnifying-glass.svg" alt="검색" width={24} height={24} />
        </button>
      </div>

      {/* 자동완성 목록 */}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 text-sm divide-y divide-[#f0f0f0] shadow-sm">
          {suggestions.map((word, index) => (
            <li
              key={word}
              onClick={() => handleSearch(word)}
              className={`px-4 py-3 cursor-pointer text-black ${
                selectedIndex === index ? 'bg-[#FFE970]' : 'hover:bg-[#FFF4A3]'
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
