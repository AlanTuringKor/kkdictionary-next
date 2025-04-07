import { getRandomWords } from '@/lib/getRandomWords'
import SkeletonCard from '@/components/SkeletonCard'
import WordCard from '@/components/WordCard'
import SearchBar from '@/components/SearchBar'
import { getRecentWords } from '@/lib/getRecentWords'
import RecentWords from '@/components/RecentWords'
import PopularSearches from '@/components/PopularSearches'

export default async function WelcomePage() {
  const randomWords = await getRandomWords(6)
  const recentWords = await getRecentWords()
  const isLoading = false // SSR이라 로딩은 거의 발생하지 않지만 구조 유지용

  return (
    <main className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
      {/* 왼쪽 사이드바 */}
      <aside className="w-full lg:w-[180px] shrink-0 hidden lg:block h-full">
        <PopularSearches days={0} />
      </aside>

      {/* 가운데 메인 콘텐츠 영역 */}
      <section className="flex-1">
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl font-bold mb-6">ㅋㅋ백과</h1>
          <SearchBar />
        </div>

        <h2 className="text-xl font-semibold mb-4 text-primary">오늘의 추천 단어</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : randomWords.map((entry) => (
                <WordCard
                  key={entry.id}
                  word={entry.word}
                  description={entry.definitions?.[0]?.description || '설명이 없습니다'}
                />
              ))}
        </div>
      </section>

      {/* 오른쪽 사이드바 */}
      <aside className="w-full lg:w-[180px] shrink-0 h-full">
        <RecentWords entries={recentWords} />
      </aside>
    </main>
  )
}


