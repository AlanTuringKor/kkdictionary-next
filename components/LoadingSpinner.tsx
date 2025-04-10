// src/components/LoadingSpinner.tsx


'use client'
import { useEffect, useState } from 'react'

const laughArray = ['ㅋ', 'ㅋㅋ', 'ㅋㅋㅋ', 'ㅋㅋㅋㅋ', 'ㅋㅋㅋㅋㅋ', 'ㅋㅋㅋㅋㅋㅋ']

export default function LoadingSpinner() {
  const [laughIndex, setLaughIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLaughIndex((prev) => (prev + 1) % laughArray.length)
    }, 150) // 0.15초마다 한 글자씩 늘어남

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center text-2xl font-bold text-[#FFDC00] animate-pulse">
      {laughArray[laughIndex]}
    </div>
  )
}
