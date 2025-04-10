// lib/getRandomWordsPaged.ts
import clientPromise from '@/lib/mongodb'
import { DictionaryEntry } from '@/types'
import { ObjectId } from 'mongodb'

function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5)
}

export async function getRandomWordsPaged(page: number): Promise<DictionaryEntry[]> {
  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  const perPage = 10
  const recentDayLimit = 10
  const recentTargetCount = Math.floor(perPage * 0.7)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let recentWords: DictionaryEntry[] = []
  let dayRange = recentDayLimit

  while (recentWords.length < recentTargetCount && dayRange <= 90) {
    const fromDate = new Date(today)
    fromDate.setDate(today.getDate() - dayRange)

    const temp = await collection
      .find({ entry_time: { $gte: fromDate } })
      .limit(perPage * 3)
      .toArray()

    recentWords = shuffle(temp).slice(0, recentTargetCount)
    dayRange += 1
  }

  const extraCount = perPage - recentWords.length
  const randomExtra = await collection
    .aggregate([{ $sample: { size: extraCount * 2 } }])
    .toArray()

  // 중복 제거
  const combined = shuffle([...recentWords, ...randomExtra])
  const seen = new Set()
  const deduped = combined.filter((e) => {
    if (seen.has(e.word)) return false
    seen.add(e.word)
    return true
  }).slice(0, perPage)

  return deduped.map((entry: any) => ({
    ...entry,
    id: entry._id?.toString() ?? entry.id,
  }))
}