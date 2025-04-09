import clientPromise from "@/lib/mongodb"
import { DictionaryEntry } from "@/types" // 이건 네가 만든 타입이 정의된 곳에 맞게 조정해야 함

export async function searchWord(query: string): Promise<DictionaryEntry[]> {
  const client = await clientPromise
  const db = client.db("DictionaryDB")
  const collection = db.collection("dictionaries")

  const results = await collection.find({ word: query }).toArray()

  // ObjectId → string 변환 처리 포함
  return results.map((entry: any) => ({
    ...entry,
    id: entry.id ?? entry._id?.toString(), // ObjectId를 문자열로 변환해서 id 필드로 제공
  }))
}
