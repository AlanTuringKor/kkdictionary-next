import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import xss from 'xss'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const captchaToken = body.captchaToken
    if (!captchaToken) {
      return NextResponse.json({ error: '로봇 인증 실패' }, { status: 400 })
    }

    const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    })

    const verifyData = await verifyRes.json()
    if (!verifyData.success || verifyData.score < 0.5) {
      return NextResponse.json({ error: '로봇으로 판단됨' }, { status: 403 })
    }

    const word = xss(body.word?.trim())
    const description = xss(body.definition?.trim())
    const exampleRaw = body.example?.trim()
    const exampleList = exampleRaw ? [xss(exampleRaw)] : []

    if (!word || !description || exampleList.length === 0) {
      return NextResponse.json({ error: '필수 값 없음' }, { status: 400 })
    }

    const db = await getDb()
    const _id = new ObjectId()

    const entry = {
      _id,
      id: _id.toHexString(),
      word,
      definitions: [{ description, example: exampleList }],
      liked_users: [],
      disliked_users: [],
      author: xss(body.author?.trim() || '익명'),
      approved: false, // ✅ 고정
      entry_time: new Date(),
      tags: Array.isArray(body.tags) ? body.tags.filter(tag => typeof tag === 'string') : [],
      source: 'user',
    }

    await db.collection('dictionaries').insertOne(entry) // ✅ 여기가 핵심 수정!

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
