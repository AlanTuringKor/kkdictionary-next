// src/app/api/autocomplete/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')?.trim()

  if (!query) return NextResponse.json([])

  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  // 모든 포함 결과를 먼저 가져옴
  const rawMatches = await collection
    .find({ word: { $regex: query, $options: 'i' } })
    .project({ word: 1 })
    .limit(30) // 충분히 확보해서 JS에서 정렬
    .toArray()

  const words = rawMatches.map(doc => doc.word)

  // 먼저 시작하는 단어를 앞으로 정렬
  const sorted = words.sort((a, b) => {
    const aStarts = a.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1
    const bStarts = b.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1
    if (aStarts !== bStarts) return aStarts - bStarts
    return a.localeCompare(b)
  })

  // 중복 제거
  const unique = [...new Set(sorted)].slice(0, 15)

  return NextResponse.json(unique)
}
