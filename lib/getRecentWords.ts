import clientPromise from './mongodb'

export async function getRecentWords(limit = 100) {
  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  const words = await collection
    .find({ entry_time: { $exists: true } })
    .sort({ entry_time: -1 }) // 최신순
    .limit(limit)
    .toArray()

  return words.map((word) => ({
    word: word.word,
    date: new Date(word.entry_time).toISOString(), // 문자열 변환
  }))
}
