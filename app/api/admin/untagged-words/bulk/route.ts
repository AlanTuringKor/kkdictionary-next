// ✅ app/api/admin/untagged-words/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

// PUT /api/admin/untagged-words/bulk
export async function PUT(req: NextRequest) {
  try {
    const db = await getDb()
    const { updates } = await req.json()

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
    }

    const bulkOps = updates.map((entry: { id: string, tags: string[] }) => ({
      updateOne: {
        filter: { id: entry.id },
        update: {
          $set: {
            tags: entry.tags,
            last_modified: new Date(),
          },
        },
      }
    }))

    const result = await db.collection('dictionaries').bulkWrite(bulkOps)
    return NextResponse.json({ message: '업데이트 완료', result })
  } catch (error) {
    console.error('태그 일괄 업데이트 실패:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
