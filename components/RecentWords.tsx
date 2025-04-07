// src/components/RecentWords.tsx
import Link from 'next/link'

interface Props {
  entries: { word: string; date: string }[]
}

export default function RecentWords({ entries }: Props) {
  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return `${date.getMonth() + 1}.${date.getDate()}`
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-bold mb-4 text-primary">최근 등록된 단어</h2>
      <ul className="space-y-3 text-sm">
        {entries.map(({ word, date }) => (
          <li key={word} className="flex justify-between items-center">
            <Link
              href={`/search/${encodeURIComponent(word)}`}
              className="text-gray-900 hover:text-primary truncate max-w-[150px]"
            >
              {word}
            </Link>
            <span className="text-gray-400 text-xs whitespace-nowrap">{formatDate(date)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
