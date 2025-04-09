import { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { anon_id } = await req.json()

  const client = await clientPromise
  const db = client.db("DictionaryDB")
  const collection = db.collection("dictionaries")

  const existing = await collection.findOne({ id: params.id })

  if (
    !existing ||
    existing.liked_users?.includes(anon_id) ||
    existing.disliked_users?.includes(anon_id)
  ) {
    return new Response("Already voted or not found", { status: 400 })
  }

  await collection.updateOne(
    { id: params.id },
    { $addToSet: { disliked_users: anon_id } }
  )

  return new Response("Disliked", { status: 200 })
}
