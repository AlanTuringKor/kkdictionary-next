// ✅ app/api/admin/untagged-words/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// GET /api/admin/untagged-words?limit=20
export async function GET(req: NextRequest) {
  const db = await getDb()
  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '20')

  const words = await db.collection('dictionaries')
    .find({ $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }] })
    .sort({ entry_time: -1 })
    .limit(limit)
    .project({ id: 1, word: 1, definitions: 1 })
    .toArray()

  return NextResponse.json(words)
}
