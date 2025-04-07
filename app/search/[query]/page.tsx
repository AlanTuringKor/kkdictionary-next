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
