"use client"

import { useEffect, useState } from 'react'

interface Stats {
  todayCount: number
  yesterdayCount: number
  realtimeUsers: number
  topPages: { url: string; count: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats/overview')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
  }, [])

  if (!stats) return <p className="p-4 text-black">📊 통계 불러오는 중...</p>

  const growth = stats.todayCount - stats.yesterdayCount
  const growthText = growth === 0 ? '변화 없음' : growth > 0 ? `▲ +${growth}` : `▼ ${growth}`

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 text-black">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">📊 방문자 통계 대시보드</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard title="오늘 방문자 수" value={stats.todayCount} emoji="🟡" />
        <StatCard title="어제보다" value={growthText} emoji="📈" />
        <StatCard title="실시간 사용자" value={stats.realtimeUsers} emoji="⏱️" />
      </section>

      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">🔥 인기 페이지 TOP 20</h2>
        <ul className="space-y-2">
          {stats.topPages.map((item, idx) => (
            <li key={item.url} className="bg-gray-100 p-3 rounded text-sm sm:text-base">
              <span className="font-mono mr-2">#{idx + 1}</span>
              <span className="text-blue-800 font-medium break-all">{item.url}</span>
              <span className="ml-2 text-gray-500">({item.count}회)</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function StatCard({ title, value, emoji }: { title: string; value: string | number; emoji: string }) {
  return (
    <div className="bg-white border shadow rounded p-4 flex flex-col items-center justify-center text-center">
      <div className="text-2xl sm:text-3xl mb-2">{emoji}</div>
      <div className="text-xs sm:text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-lg sm:text-xl font-bold">{value}</div>
    </div>
  )
}
