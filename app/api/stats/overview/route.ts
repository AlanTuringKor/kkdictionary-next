// ✅ app/api/stats/overview/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  const db = await getDb()

  // 📆 날짜 계산
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const fiveMinAgo = new Date(now.getTime() - 1000 * 60 * 5)

  // ✅ 오늘 방문자 수
  const todayCount = await db.collection('event_logs').countDocuments({
    eventType: 'page_view',
    timestamp: { $gte: today },
  })

  // ✅ 어제 방문자 수
  const yesterdayCount = await db.collection('event_logs').countDocuments({
    eventType: 'page_view',
    timestamp: { $gte: yesterday, $lt: today },
  })

  // ✅ 실시간 접속자 수 (5분 이내, IP+UA 기준 고유)
  const realtimeUsersAgg = await db.collection('event_logs').aggregate([
    { $match: { eventType: 'page_view', timestamp: { $gte: fiveMinAgo } } },
    {
      $group: {
        _id: {
          ip: '$serverMetadata.ip',
          ua: '$serverMetadata.userAgent',
        },
      },
    },
    { $count: 'users' },
  ]).toArray()
  const realtimeUsers = realtimeUsersAgg[0]?.users || 0

  // ✅ 인기 페이지 TOP 20
  const topPages = await db.collection('event_logs').aggregate([
    { $match: { eventType: 'page_view' } },
    {
      $group: {
        _id: { $ifNull: ['$clientMetadata.url', '$metadata.url'] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
    {
      $project: {
        url: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]).toArray()

  return NextResponse.json({
    todayCount,
    yesterdayCount,
    realtimeUsers,
    topPages,
  })
}