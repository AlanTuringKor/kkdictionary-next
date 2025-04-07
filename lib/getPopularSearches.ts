// lib/getPopularSearches.ts
import { getDb } from './mongodb'

export async function getPopularSearches(limit: number = 10, days: number | null = 7) {
  const db = await getDb()

  const match = days
    ? { timestamp: { $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000) } }
    : {}  // If days is null, do not filter by timestamp, i.e., fetch all data

  const pipeline = [
    { $match: match },
    { $group: { _id: '$search_word', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { word: '$_id', count: 1, _id: 0 } }
  ]

  const popularSearches = await db.collection('search_logs').aggregate(pipeline).toArray()
  return popularSearches
}
