// src/lib/mongodb.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

// ✅ getDb 함수 추가
export async function getDb() {
  const client = await clientPromise
  return client.db('DictionaryDB') // ← 너의 실제 DB 이름으로 유지
}

export default clientPromise
