import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id, updated } = await req.json()
  const db = await getDb()

  const _id = new ObjectId(id)

  const result = await db.collection("dictionaries").updateOne(
    { _id, approved: false },
    {
      $set: {
        ...updated,
        last_modified: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Not found or already approved" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
