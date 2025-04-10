import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { id } = await req.json()
  const db = await getDb()

  await db.collection("usersuggested").deleteOne({ _id: new ObjectId(id) })

  return NextResponse.json({ success: true })
}
