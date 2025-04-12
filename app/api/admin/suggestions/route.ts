import { getDb } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const db = await getDb()

  const suggestions = await db
    .collection("dictionaries")
    .find({ approved: false }) // 정확하게 approved: false 만!
    .sort({ entry_time: -1 })
    .toArray()

  return NextResponse.json(suggestions)
}
