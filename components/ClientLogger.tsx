// components/ClientLogger.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ClientLogger() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const queryString = searchParams.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname

    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'page_view',
        metadata: {
          url,
        },
      }),
    }).catch(err => console.error('자동 로깅 실패:', err))
  }, [pathname, searchParams])

  return null
}
