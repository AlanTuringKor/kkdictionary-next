"use client"

import { useEffect, useState } from 'react'

const TAG_OPTIONS = ["일반단어", "줄임말", "유행어", "신조어","속어", "비속어", "성적용어", "힙합", "게임", "주식", "배그", "롤", "속담", "SNS"]

interface WordEntry {
  id: string
  word: string
  definitions: { description: string }[]
  tags: string[]
}

export default function AdminTagCleaner() {
  const [words, setWords] = useState<WordEntry[]>([])
  const [tagMap, setTagMap] = useState<Record<string, string[]>>({})
  const [count, setCount] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [customTags, setCustomTags] = useState<Record<string, string>>({})
  const [reloadTrigger, setReloadTrigger] = useState(0)

  useEffect(() => {
    fetch('/api/admin/untagged-words/count')
      .then(res => res.json())
      .then(data => setCount(data.count))
  }, [reloadTrigger])

  useEffect(() => {
    fetch('/api/admin/untagged-words?limit=20')
      .then(res => res.json())
      .then(data => {
        setWords(data.map((w: any) => ({ ...w, tags: [] })))
        const map: Record<string, string[]> = {}
        const custom: Record<string, string> = {}
        data.forEach((w: any) => {
          map[w.id] = []
          custom[w.id] = ''
        })
        setTagMap(map)
        setCustomTags(custom)
      })
  }, [reloadTrigger])

  const toggleTag = (id: string, tag: string) => {
    setTagMap(prev => {
      const tags = prev[id] || []
      return {
        ...prev,
        [id]: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
      }
    })
  }

  const handleCustomTagChange = (id: string, value: string) => {
    setCustomTags(prev => ({ ...prev, [id]: value }))
  }

  const handleCustomTagAdd = (id: string) => {
    const newTag = customTags[id]?.trim()
    if (!newTag) return
    if (tagMap[id]?.includes(newTag)) return
    setTagMap(prev => ({ ...prev, [id]: [...(prev[id] || []), newTag] }))
    setCustomTags(prev => ({ ...prev, [id]: '' }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const updates = Object.entries(tagMap).map(([id, tags]) => ({ id, tags }))

    const res = await fetch('/api/admin/untagged-words/bulk', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates })
    })

    if (res.ok) {
      alert('저장 완료!')
      setReloadTrigger(prev => prev + 1)
    } else {
      alert('저장 실패')
    }
    setIsSaving(false)
  }

  return (
    <main className="max-w-4xl mx-auto p-4 text-black">
      <h1 className="text-xl font-bold mb-4">🏷️ 태그 없는 단어 정리</h1>
      {count !== null && (
        <p className="mb-6 text-sm text-gray-700">총 <b>{count}</b>개의 태그 없는 단어가 있습니다.</p>
      )}

      <ul className="space-y-4">
        {words.map(word => (
          <li key={word.id} className="border p-4 rounded">
            <h2 className="font-bold text-lg">{word.word}</h2>
            <p className="text-sm text-gray-700 mb-2">{word.definitions[0]?.description}</p>

            <div className="flex flex-wrap gap-2 mb-2">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(word.id, tag)}
                  className={`text-sm px-3 py-1 border rounded-full ${tagMap[word.id]?.includes(tag) ? 'bg-yellow-400 text-[#001f3f]' : 'bg-white text-gray-800'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="직접 태그 입력"
                value={customTags[word.id] || ''}
                onChange={e => handleCustomTagChange(word.id, e.target.value)}
                className="flex-1 border rounded p-2 text-sm text-black"
              />
              <button
                onClick={() => handleCustomTagAdd(word.id)}
                className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
              >
                추가
              </button>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {(tagMap[word.id] || []).map(tag => (
                <span key={tag} className="bg-yellow-100 text-[#001f3f] px-2 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setReloadTrigger(prev => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          🔄 다음 20개 불러오기
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '💾 저장하기'}
        </button>
      </div>
    </main>
  )
}
