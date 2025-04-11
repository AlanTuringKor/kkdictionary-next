"use client"

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TAG_OPTIONS = ["일반단어", "줄입말", "유행어","신조어", "비속어", "성적용어", "주식","힙합", "게임", "배그", "롤", "속담", "SNS"]

interface Definition {
  description: string
  example: string[]
}

interface WordEntry {
  _id?: string
  id: string
  word: string
  definitions: Definition[]
  tags?: string[]
}

export default function AdminWords() {
  const [words, setWords] = useState<WordEntry[]>([])
  const [newWord, setNewWord] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [newExamples, setNewExamples] = useState('')
  const [newTags, setNewTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'latest' | 'asc'>('latest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editExamples, setEditExamples] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showUntaggedOnly, setShowUntaggedOnly] = useState(false)

  const fetchWords = async () => {
    const searchParam = searchTerm.trim() ? `&search=${encodeURIComponent(searchTerm.trim())}` : ''
    const res = await fetch(`/api/words?page=${page}&limit=10&sort=${sortOrder}${searchParam}`)
    const data = await res.json()
    setWords(data.words)
    setTotalPages(data.totalPages)
  }

  useEffect(() => {
    setPage(1)
    setIsSearching(searchTerm.trim().length > 0)
  }, [searchTerm])

  useEffect(() => {
    fetchWords()
  }, [page, sortOrder, searchTerm])

  const handleAdd = async () => {
    const entry: WordEntry = {
      id: uuidv4(),
      word: newWord.trim(),
      definitions: [{
        description: newDefinition.trim(),
        example: newExamples.split(',').map(e => e.trim()).filter(Boolean),
      }],
      tags: newTags
    }

    const res = await fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })

    if (res.ok) {
      alert('단어가 추가되었습니다.')
      setNewWord('')
      setNewDefinition('')
      setNewExamples('')
      setNewTags([])
      fetchWords()
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/words/${id}`, { method: 'DELETE' })
    if (res.ok) {
      alert('삭제 완료되었습니다.')
      fetchWords()
    }
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    const res = await fetch(`/api/words/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: editText,
        example: editExamples.split(',').map(e => e.trim()),
        tags: editTags,
      }),
    })

    if (res.ok) {
      alert('수정 완료되었습니다.')
      setEditingId(null)
      setEditText('')
      setEditExamples('')
      setEditTags([])
      fetchWords()
    }
    setIsSaving(false)
  }

  const toggleTag = (tag: string, tags: string[], setTags: (t: string[]) => void) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  const filteredWords = showUntaggedOnly
    ? words.filter(w => !w.tags || w.tags.length === 0)
    : words

  return (
    <main className="max-w-3xl mx-auto p-4 text-black">
      <h2 className="text-2xl font-bold mb-6">📖 단어 관리</h2>

      {/* ➕ 단어 추가 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">➕ 단어 추가</h3>
        <div className="space-y-2">
          <input className="w-full border rounded p-2 text-black" placeholder="단어" value={newWord} onChange={e => setNewWord(e.target.value)} />
          <textarea className="w-full border rounded p-2 text-black" placeholder="정의" value={newDefinition} onChange={e => setNewDefinition(e.target.value)} />
          <input className="w-full border rounded p-2 text-black" placeholder="예시 (쉼표로 구분)" value={newExamples} onChange={e => setNewExamples(e.target.value)} />

          <div className="flex flex-wrap gap-2">
            {newTags.map(tag => (
              <span key={tag} className="bg-yellow-400 text-[#001f3f] px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(tag => (
              <button key={tag} type="button" onClick={() => toggleTag(tag, newTags, setNewTags)} className={`text-sm px-3 py-1 border rounded-full ${newTags.includes(tag) ? 'bg-yellow-400 text-[#001f3f]' : 'bg-white text-[#333]'}`}>
                #{tag}
              </button>
            ))}
          </div>

          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            추가하기
          </button>
        </div>
      </section>

      {/* 🔍 검색 & 정렬 */}
      <section className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input type="text" placeholder="단어 검색 (전체 DB)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-1/2 border px-3 py-2 rounded text-sm text-black" />
        <select value={sortOrder} onChange={e => { setSortOrder(e.target.value as 'latest' | 'asc'); setPage(1) }} className="border px-3 py-2 rounded text-sm text-black">
          <option value="latest">최신순</option>
          <option value="asc">가나다순</option>
        </select>
      </section>

      {/* 🔘 태그 없는 단어 필터 */}
      <label className="flex items-center gap-2 text-sm mb-4">
        <input type="checkbox" checked={showUntaggedOnly} onChange={() => setShowUntaggedOnly(prev => !prev)} />
        태그 없는 단어만 보기
      </label>

      {/* 📖 단어 목록 */}
      <section>
        <ul className="space-y-4">
          {filteredWords.map((entry) => {
            const isEditing = editingId === entry.id

            return (
              <li key={entry.id} className="border p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{entry.word}</span>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <button onClick={() => handleSave(entry.id)} disabled={isSaving} className="text-green-600 text-sm hover:underline">
                        {isSaving ? '저장 중...' : '저장'}
                      </button>
                    ) : (
                      <button onClick={() => {
                        setEditingId(entry.id)
                        setEditText(entry.definitions[0]?.description || '')
                        setEditExamples(entry.definitions[0]?.example?.join(', ') || '')
                        setEditTags(entry.tags ?? [])
                      }} className="text-blue-600 text-sm hover:underline">
                        수정
                      </button>
                    )}
                    <button onClick={() => {
                      if (confirm(`"${entry.word}" 단어를 정말 삭제하시겠습니까?`)) {
                        handleDelete(entry.id)
                      }
                    }} className="text-red-600 text-sm hover:underline">
                      삭제
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-2 space-y-2">
                    <textarea className="w-full border rounded p-2 text-sm text-black" value={editText} onChange={e => setEditText(e.target.value)} />
                    <input className="w-full border rounded p-2 text-sm text-black" placeholder="예시 (쉼표로 구분)" value={editExamples} onChange={e => setEditExamples(e.target.value)} />
                    <div className="flex flex-wrap gap-2">
                      {editTags.map(tag => (
                        <span key={tag} className="bg-yellow-400 text-[#001f3f] px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map(tag => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag, editTags, setEditTags)} className={`text-sm px-3 py-1 border rounded-full ${editTags.includes(tag) ? 'bg-yellow-400 text-[#001f3f]' : 'bg-white text-[#333]'}`}>
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm mt-1">{entry.definitions[0]?.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.tags?.map(tag => (
                        <span key={tag} className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">#{tag}</span>
                      ))}
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>

        {/* ⏩ 페이지네이션 */}
        {!isSearching && (
          <div className="mt-6 flex justify-center items-center gap-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">◀ 이전</button>
            <span>페이지 {page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">다음 ▶</button>
          </div>
        )}
      </section>
    </main>
  )
}
