import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// GET /api/admin/untagged-words?limit=20
export async function GET(req: NextRequest) {
  const db = await getDb()
  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '20')

  const words = await db.collection('dictionaries')
    .aggregate([
      {
        $match: {
          $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }]
        }
      },
      { $sample: { size: limit } },
      {
        $project: {
          id: 1,
          word: 1,
          definitions: 1,
        }
      }
    ])
    .toArray()

  return NextResponse.json(words)
}
