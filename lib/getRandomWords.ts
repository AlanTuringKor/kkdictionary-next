// src/lib/getRandomWords.ts
import clientPromise from './mongodb'

export async function getRandomWords(count = 6) {
  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  const pipeline = [{ $sample: { size: count } }]
  const results = await collection.aggregate(pipeline).toArray()

  return results
}
