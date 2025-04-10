import { notFound } from 'next/navigation'
import { searchWord } from '@/lib/searchDictionary'
import { getSimilarWords } from '@/lib/getSimilarWords'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import { logSearch } from '@/lib/logSearch'
import { LikeDislikeButtons } from '@/components/LikeDislikeButtons'
import DefinitionCard from '@/components/DefinitionCard'
import { Nanum_Myeongjo } from 'next/font/google'

const nanum = Nanum_Myeongjo({ weight: '400', subsets: ['latin'], display: 'swap' })

interface SearchPageProps {
  params: { query: string }
}

// ✅ SEO 메타데이터
export async function generateMetadata({ params }: SearchPageProps) {
  const rawQuery = params.query
  const query = decodeURIComponent(rawQuery.trim())
  const results = await searchWord(query)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pageUrl = `${baseUrl}/search/${encodeURIComponent(query)}`
  const ogImage = `${baseUrl}/api/og/${encodeURIComponent(query)}.png`

  const title = results.length
    ? `${query} 뜻 - 신조어사전 ㅋㅋ백과`
    : `${query} - 신조어 검색 결과 없음 | ㅋㅋ백과`

  const description = results.length
    ? results[0]?.definitions?.[0]?.description ?? '정의 없음'
    : `"${query}"에 대한 신조어 검색 결과가 없습니다.`

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'ㅋㅋ백과',
      images: [ogImage],
      type: 'article',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function ResultPage({ params }: SearchPageProps) {
  const rawQuery = params.query
  const query = decodeURIComponent(rawQuery.trim())

  if (!query) return notFound()

  const results = await searchWord(query)
  await logSearch(query, results.length > 0)

  if (results.length === 0) {
    const similarWords = await getSimilarWords(query)

    return (
          <main className="p-4 max-w-2xl mx-auto text-center">
            <h1 className="text-xl font-semibold mb-6">"{query}"에 대한 결과가 없어요.</h1>

            {similarWords.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-2">혹시 이런 단어를 찾으셨나요?</h2>
                <ul className="space-y-2">
                  {similarWords.map((word) => (
                    <li key={word}>
                      <Link
                        href={`/search/${encodeURIComponent(word)}`}
                        className="text-blue-600 hover:underline"
                      >
                        {word}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🧨 크고 오버스러운 단어 추가하기 버튼 */}
            <Link
              href="/add"
              className="inline-block bg-[#FFDC00] text-[#001f3f] font-extrabold px-8 py-5 sm:px-10 sm:py-6 rounded-full shadow-[0_6px_30px_rgba(255,220,0,0.8)] hover:shadow-[0_8px_40px_rgba(255,220,0,1)] hover:scale-105 transition-all duration-300 text-2xl sm:text-3xl uppercase tracking-wide animate-pulse hover:animate-none mt-10"
            >
              ✏️ 단어 추가하러 가기
            </Link>
          </main>
    )
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-10">
        <SearchBar />
      </div>

      <h1 className="text-2xl font-bold mb-6">"{query}"의 정의</h1>


      <div className="space-y-6">
      {results.map((entry, idx) => (
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
    </main>
  )
}
