// src/lib/searchDictionary.ts
import clientPromise from './mongodb'

export async function searchWord(word: string) {
  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  const result = await collection.findOne({ word })

  return result
}
