// lib/logSearch.ts
import { getDb } from './mongodb'
import { headers } from 'next/headers'


export async function logSearch(query: string, found: boolean) {
  try {
    const db = await getDb()
    const ip = getClientIp()

    await db.collection('search_logs').insertOne({
      search_word: query,
      result_found: found,
      timestamp: new Date(),
      ip,
    })
  } catch (error) {
    console.error('검색 로그 저장 실패:', error)
  }
}

function getClientIp(): string | undefined {
  try {
    const headerList = headers()
    const ip = headerList.get('x-forwarded-for') || headerList.get('x-real-ip')
    return ip?.split(',')[0]?.trim()
  } catch {
    return undefined
  }
} 
