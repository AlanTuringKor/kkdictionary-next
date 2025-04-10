'use client'

import { useState } from 'react'
import { LikeDislikeButtons } from '@/components/LikeDislikeButtons'
import Link from 'next/link'
import Image from 'next/image'

interface Definition {
  description: string
  example?: string[]
}

interface DefinitionCardProps {
  word: string
  definitions: Definition[]
  author?: string
  entry_time: string
  wordId: string
  likedUsers: string[]
  dislikedUsers: string[]
}

export default function DefinitionCard({
  word,
  definitions,
  author = '익명',
  entry_time,
  wordId,
  likedUsers,
  dislikedUsers,
}: DefinitionCardProps) {
  const time = new Date(entry_time)
  const isValidDate = !isNaN(time.getTime())

  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kkdictionary.com'
    const url = `${baseUrl}/search/${encodeURIComponent(word)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      alert('링크 복사에 실패했어요.')
    }
  }

  return (
    <div className="relative bg-white border-2 border-[#FFDC00] p-6 space-y-4   transition-transform duration-300 ease-in-out transform hover:scale-[1.01] font-mono text-[#1a1a1a]">

      {/* 공유 버튼 */}
      <button
        onClick={handleShare}
        className="absolute top-4 right-4 hover:opacity-80"
        title="이 단어 링크 복사하기"
      >
        <Image
          src="/share.svg"
          alt="공유"
          width={24}
          height={24}
          className="text-[#FFDC00] "
        />
      </button>

      {/* 단어 제목 */}
      <Link href={`/search/${encodeURIComponent(word)}`}>
        <h2 className="text-3xl font-bold text-[#001f3f] hover:text-[#ffd700]  transition-all duration-200 ease-in-out cursor-pointer tracking-tight">
          {word}
        </h2>
      </Link>

      {definitions?.map((def, i) => (
        <div key={i} className="space-y-2">
          <p className="text-2xl whitespace-pre-line leading-snug text-[#333]">{def.description}</p>
          {def.example && def.example.length > 0 && (
            <div className=" italic text-[#666] space-y-1">
              {def.example.map((ex, j) => (
                <p key={j} className="text-xl">"{ex}"</p>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="text-xs text-[#888]">
        {(author?.trim() || '익명')} · {isValidDate ? `${time.getFullYear()}년 ${time.getMonth() + 1}월 ${time.getDate()}일` : '날짜 없음'}
      </div>

      <LikeDislikeButtons
        wordId={wordId}
        likedUsers={likedUsers}
        dislikedUsers={dislikedUsers}
      />

      {/* 복사 확인 메시지 */}
      {copied && (
        <div className="absolute top-4 right-20 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          링크 복사됨!
        </div>
      )}
    </div>
  )
}
