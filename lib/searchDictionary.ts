// /lib/searchDictionary.ts
import { getDb } from './mongodb'

export async function searchWord(word: string) {
  const db = await getDb()
  const results = await db
    .collection('dictionaries')
    .find({ word })
    .toArray()

  return results
}
