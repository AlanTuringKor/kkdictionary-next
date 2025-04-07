// src/app/api/popular/route.ts
import { NextResponse } from 'next/server'
import { getPopularSearches } from '@/lib/getPopularSearches'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const days = url.searchParams.get('days')
  const limit = url.searchParams.get('limit') || '10'

  const popularSearches = await getPopularSearches(Number(limit), days ? Number(days) : 7) // Default to 7 days

  return NextResponse.json(popularSearches)
}
