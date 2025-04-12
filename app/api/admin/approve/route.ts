import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id } = await req.json()
  const db = await getDb()

  const result = await db.collection("dictionaries").updateOne(
    { _id: new ObjectId(id), approved: false },
    {
      $set: {
        approved: true,
        last_modified: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "단어를 찾을 수 없거나 이미 승인됨" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
