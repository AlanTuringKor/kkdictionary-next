'use client'

import { useEffect } from 'react'
import SkeletonCard from '@/components/SkeletonCard'
import DefinitionCard from '@/components/DefinitionCard'
import Pagination from '@/components/Pagination'

interface DefinitionSectionProps {
  randomWords: any[]
  currentPage: number
}

export default function DefinitionSection({ randomWords, currentPage }: DefinitionSectionProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-primary">추천해 드리는 단어들</h2>

      <div className="space-y-6">
        {randomWords.length === 0
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : randomWords.map((entry, idx) => (
              <DefinitionCard
                key={idx}
                word={entry.word}
                definitions={entry.definitions}
                author={entry.author}
                entry_time={entry.entry_time}
                wordId={entry.id}
                likedUsers={entry.liked_users ?? []}
                dislikedUsers={entry.disliked_users ?? []}
              />
            ))}
      </div>

      <div className="mt-12">
        <Pagination currentPage={currentPage} totalPages={40} basePath="/" />
      </div>
    </div>
  )
}
