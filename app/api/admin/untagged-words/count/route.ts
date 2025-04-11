// ✅ app/api/admin/untagged-words/count/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()

    const count = await db.collection('dictionaries').countDocuments({
      $or: [
        { tags: { $exists: false } },
        { tags: { $size: 0 } },
      ],
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('태그 없는 단어 개수 조회 실패:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
