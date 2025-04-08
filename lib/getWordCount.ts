import clientPromise from './mongodb'

export async function getWordCount() {
  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  const count = await collection.countDocuments()
  return count
}
