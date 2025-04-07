// src/app/api/words/[id]/route.ts
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

interface Params {
  params: { id: string }
}

export async function DELETE(_: Request, { params }: Params) {
  const db = await getDb()
  const result = await db.collection('dictionaries').deleteOne({ id: params.id })

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Deleted' }, { status: 200 })
}

export async function PUT(req: Request, { params }: Params) {
  const db = await getDb()
  const body = await req.json()

  const result = await db.collection('dictionaries').updateOne(
    { id: params.id },
    {
      $set: {
        'definitions.0.description': body.description,
        'definitions.0.example': body.example,
        last_modified: new Date(),
      },
    }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Updated' }, { status: 200 })
}
