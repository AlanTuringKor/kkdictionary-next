import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id } = await req.json()
  const db = await getDb()

  const result = await db.collection("dictionaries").deleteOne({
    _id: new ObjectId(id),
    approved: false, // 승인되지 않은 것만 삭제 가능
  })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "삭제할 단어를 찾을 수 없음 또는 이미 승인됨" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
