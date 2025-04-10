// page.tsx
import { getRandomWordsPaged } from '@/lib/getRandomWordsPaged'
import DefinitionSection from '@/components/DefinitionSection'
import SearchBar from '@/components/SearchBar'
import { getRecentWords } from '@/lib/getRecentWords'
import RecentWords from '@/components/RecentWords'
import PopularSearches from '@/components/PopularSearches'
import { getWordCount } from '@/lib/getWordCount'
import { redirect } from 'next/navigation'
import { Nanum_Myeongjo } from 'next/font/google'

const nanum = Nanum_Myeongjo({ weight: '400', subsets: ['latin'], display: 'swap' })

export const dynamic = 'force-dynamic'

interface SearchParams {
  searchParams: { page?: string }
}

export default async function WelcomePage({ searchParams }: SearchParams) {
  const currentPage = parseInt(searchParams.page || '1', 10)
  if (currentPage < 1 || currentPage > 40) redirect('/?page=1')

  const [randomWords, recentWords, wordCount] = await Promise.all([
    getRandomWordsPaged(currentPage),
    getRecentWords(),
    getWordCount(),
  ])

  return (
    <main className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8 bg-[#001f3f] text-[#f0f0f0] font-mono">
      {/* 왼쪽 사이드바 */}
      <aside className="w-full lg:w-[180px] shrink-0 hidden lg:block h-full lg:mt-28">
        <RecentWords entries={recentWords} />
      </aside>

      {/* 가운데 메인 콘텐츠 영역 */}
      <section className="flex-1">
        <div className="flex flex-col items-center justify-center mb-10 relative">

          <h1 className={`absolute text-[8rem] font-bold text-[#f0f0f0] opacity-10 -rotate-[20deg] top-10 pointer-events-none whitespace-nowrap leading-none ${nanum.className}`}>
            ㅋㅋ백과
          </h1>
          <p className="text-l text-gray-400 mb-6">
            현재 등록된 단어 수: {(wordCount + 10000).toLocaleString()}개
          </p>
          <SearchBar />
        </div>

        <DefinitionSection randomWords={randomWords} currentPage={currentPage} />

        <div className="block lg:hidden w-full mt-10">
          <RecentWords entries={recentWords} />
        </div>
      </section>

      {/* 오른쪽 사이드바 */}
      <aside className="w-full lg:w-[180px] shrink-0 h-full lg:mt-28">
        <PopularSearches days={0} />
      </aside>
    </main>
  )
}
