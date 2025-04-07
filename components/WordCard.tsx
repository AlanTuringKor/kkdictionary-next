// src/components/WordCard.tsx
import Link from 'next/link'

interface Props {
  word: string
  description: string
}

export default function WordCard({ word, description }: Props) {
  return (
    <Link
      href={`/search/${encodeURIComponent(word)}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 border border-gray-100"
    >
      <h3 className="text-lg font-bold mb-2 text-primary">{word}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
    </Link>
  )
}
