// lib/fetchPopularSearches.ts
import { getPopularSearches } from './getPopularSearches'

export const fetchPopularSearches = async (days: number) => {
  const res = await fetch(`/api/popular?days=${days}`)
  const data = await res.json()
  return data
}
