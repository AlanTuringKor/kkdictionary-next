import { getDb } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  const db = await getDb()
  const suggestions = await db
    .collection("usersuggested")
    .find({ approved: { $in: [null, undefined] } })
    .sort({ entry_time: -1 })
    .toArray()

  return NextResponse.json(suggestions)
}
