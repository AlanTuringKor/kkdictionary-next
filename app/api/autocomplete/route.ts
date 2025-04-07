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

  const results = await collection
    .find({ word: { $regex: `^${query}`, $options: 'i' } }) // 대소문자 무시
    .project({ word: 1 }) // word 필드만 가져옴
    .limit(5)
    .toArray()

  return NextResponse.json(results.map((doc) => doc.word))
}
