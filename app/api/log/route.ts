// app/api/log/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const body = await req.json()

    const headers = req.headers
    const ip = headers.get('x-forwarded-for') || 'unknown'
    const userAgent = headers.get('user-agent') || 'unknown'
    const referer = headers.get('referer') || 'unknown'
    const language = headers.get('accept-language') || 'unknown'

    await db.collection('event_logs').insertOne({
      ...body,
      ip,
      userAgent,
      referer,
      language,
      timestamp: new Date(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('로깅 실패:', err)
    return NextResponse.json({ error: '서버 에러' }, { status: 500 })
  }
}
