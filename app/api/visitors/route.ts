import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

function randomTarget(min = 5000, max = 10000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function GET() {
  const db = await getDb()
  const today = new Date().toISOString().slice(0, 10)

  let visitorDoc = await db.collection('daily_visitors').findOne({ _id: today })

  if (!visitorDoc) {
    // 하루가 시작할 때 0에서 시작하고 목표 방문자 수 랜덤 설정
    visitorDoc = {
      _id: today,
      count: 0,
      target: randomTarget()
    }
    await db.collection('daily_visitors').insertOne(visitorDoc)
  } else {
    // 하루가 지나갈수록 랜덤하게 방문자 수를 증가시킴
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    const elapsedRatio = (now.getTime() - startOfDay.getTime()) / (endOfDay.getTime() - startOfDay.getTime())

    // 이상적 목표 값
    const idealCount = Math.floor(visitorDoc.target * elapsedRatio)

    if (visitorDoc.count < idealCount) {
      // 랜덤으로 증가값 설정 (약간의 편차 추가)
      const randomIncrement = Math.floor(Math.random() * (idealCount - visitorDoc.count + 1))
      
      visitorDoc.count += randomIncrement

      await db.collection('daily_visitors').updateOne(
        { _id: today },
        { $set: { count: visitorDoc.count } }
      )
    }
  }

  return NextResponse.json({ visitors: visitorDoc.count })
}
