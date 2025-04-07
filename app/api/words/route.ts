// src/app/api/words/route.ts
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')
  const sort = url.searchParams.get('sort') || 'latest'
  const search = url.searchParams.get('search')?.trim()

  const skip = (page - 1) * limit
  const db = await getDb()

  const query = search
    ? { word: { $regex: search, $options: 'i' } }
    : {}

  const totalCount = await db.collection('dictionaries').countDocuments(query)
  const sortOption = sort === 'asc' ? { word: 1 } : { entry_time: -1 }

  const words = await db
    .collection('dictionaries')
    .find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .toArray()

  return NextResponse.json({
    words,
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  })
}

  
  

export async function POST(req: Request) {
  const body = await req.json()
  const db = await getDb()

  const now = new Date()

  const newEntry = {
    ...body,
    liked_users: [],
    disliked_users: [],
    author: null,
    entry_time: now,
    last_modified: now,
    source_dictID: crypto.randomUUID(),
  }

  const result = await db.collection('dictionaries').insertOne(newEntry)

  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 })
}
