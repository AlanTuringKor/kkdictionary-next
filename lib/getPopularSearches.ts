import { getDb } from './mongodb'

export async function getPopularSearches(limit: number = 100, days: number | null = 7) {
  const db = await getDb()

  const match = days
    ? { timestamp: { $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000) } }
    : {}

  const pipeline = [
    { $match: match },
    { $group: { _id: '$search_word', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    
    // 🔍 dictionaries 컬렉션과 조인
    {
      $lookup: {
        from: 'dictionaries',
        localField: '_id',
        foreignField: 'word',
        as: 'dictionary_entry'
      }
    },
    // 🧹 사전에 존재하는 단어만 필터링
    { $match: { dictionary_entry: { $ne: [] } } },

    // ✅ 최종 정제
    { $project: { word: '$_id', count: 1, _id: 0 } },
    { $limit: limit }
  ]

  const popularSearches = await db.collection('search_logs').aggregate(pipeline).toArray()
  return popularSearches
}
