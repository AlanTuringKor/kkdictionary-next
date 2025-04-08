// src/app/search/[query]/page.tsx
import { notFound } from 'next/navigation'
import { searchWord } from '@/lib/searchDictionary'
import { getSimilarWords } from '@/lib/getSimilarWords'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import { logSearch } from '@/lib/logSearch'

interface SearchPageProps {
  params: { query: string }
}

// ✅ SEO 메타데이터 설정
export async function generateMetadata({ params }: SearchPageProps) {
  const rawQuery = params.query
  const query = decodeURIComponent(rawQuery.trim())

  const result = await searchWord(query)

  const title = result
    ? `${result.word} 뜻 - 신조어사전 ㅋㅋ백과`
    : `${query} - 신조어 검색 결과 없음 | ㅋㅋ백과`

  const description = result
    ? `${result.definitions?.[0]?.description ?? '정의 없음'} - ${result.word}의 뜻을 ㅋㅋ백과에서 확인하세요.`
    : `"${query}"에 대한 신조어 검색 결과가 없습니다. 비슷한 단어를 추천해드려요.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://kkdictionary.com/search/${encodeURIComponent(query)}`,
    },
  }
}

export default async function ResultPage({ params }: SearchPageProps) {
  const rawQuery = params.query
  const query = decodeURIComponent(rawQuery.trim())

  if (!query) return notFound()

  const result = await searchWord(query)
  await logSearch(query, !!result)

  if (!result) {
    const similarWords = await getSimilarWords(query)

    return (
      <main className="p-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">"{query}"에 대한 결과가 없어요.</h1>

        {similarWords.length > 0 && (
          <div>
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
      </main>
    )
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-10">
        <SearchBar />
      </div>
      <h1 className="text-2xl font-bold mb-4">"{result.word}"의 정의</h1>
      <div className="bg-white p-4 shadow rounded">
        {result.definitions.map((def: any, i: number) => (
          <div key={i} className="mb-4">
            <p className="font-medium">• {def.description}</p>
            {def.example && def.example.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">예: {def.example.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}

import { getPopularSearches } from '@/lib/getPopularSearches'

// SSG용 파라미터 생성
export async function generateStaticParams() {
  const popular = await getPopularSearches(50, null) // 전체 로그에서 상위 50개
  return popular.map(({ word }) => ({
    query: encodeURIComponent(word)
  }))
}

// 강제로 정적 페이지로 생성
export const dynamic = 'force-static'
