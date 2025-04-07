// src/app/search/loading.tsx
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center h-64">
      <LoadingSpinner />
      <p className="mt-4 text-gray-500">검색 중입니다...</p>
    </main>
  )
}
