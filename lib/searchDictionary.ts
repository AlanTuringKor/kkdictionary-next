import clientPromise from "@/lib/mongodb"
import { DictionaryEntry } from "@/types"

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export async function searchWord(query: string): Promise<DictionaryEntry[]> {
  const client = await clientPromise
  const db = client.db("DictionaryDB")
  const collection = db.collection("dictionaries")

  const escapedQuery = escapeRegex(query)
  const results = await collection.find({
    word: { $regex: `^${escapedQuery}$`, $options: 'i' }
  }).toArray()

  return results.map((entry: any) => ({
    ...entry,
    id: entry.id ?? entry._id?.toString(),
  }))
}
