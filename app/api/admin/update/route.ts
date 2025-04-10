import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id, updated } = await req.json()
  const db = await getDb()

  const _id = new ObjectId(id)

  // ✅ 기존 suggestion 불러오기 (id 필드 유지용)
  const existing = await db.collection("usersuggested").findOne({ _id })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.collection("usersuggested").updateOne(
    { _id },
    {
      $set: {
        ...updated,
        id: _id.toHexString(), // ✅ 항상 id 필드 유지
      },
    }
  )

  return NextResponse.json({ success: true })
}
