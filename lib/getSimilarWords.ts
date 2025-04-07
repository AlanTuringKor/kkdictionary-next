// src/lib/getSimilarWords.ts
import clientPromise from './mongodb'
import { distance } from 'fastest-levenshtein'

export async function getSimilarWords(input: string, limit = 5) {
  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  const allWords = await collection.find({}, { projection: { word: 1 } }).toArray()
  const wordList = allWords.map((doc) => doc.word)

  const scored = wordList
    .map((word) => ({ word, score: distance(input, word) }))
    .sort((a, b) => a.score - b.score)

  return scored.slice(0, limit).map((entry) => entry.word)
}
