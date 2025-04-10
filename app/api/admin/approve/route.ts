import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id } = await req.json()
  const db = await getDb()

  const suggestion = await db.collection("usersuggested").findOne({ _id: new ObjectId(id) })
  if (!suggestion) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.collection("usersuggested").updateOne(
    { _id: new ObjectId(id) },
    { $set: { approved: true } }
  )

  await db.collection("dictionaries").insertOne({
    id: suggestion._id.toHexString(), // ✅ 핵심!
    word: suggestion.word,
    definitions: suggestion.definitions,
    author: suggestion.author ?? "익명",
    tags: suggestion.tags,
    liked_users: [],
    disliked_users: [],
    entry_time: new Date(),
    last_modified: new Date(),
    source: "usersuggested",
    source_dictID: suggestion._id.toHexString(),
  })

  return NextResponse.json({ success: true })
}
