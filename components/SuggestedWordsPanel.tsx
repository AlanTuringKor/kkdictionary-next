"use client"

import { useEffect, useState } from "react"

export default function SuggestedWordsPanel() {
  const [items, setItems] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ word: "", description: "", example: "" })

  useEffect(() => {
    fetch("/api/admin/suggestions")
      .then(res => res.json())
      .then(setItems)
  }, [])

  const handleApprove = async (id: string) => {
    await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setItems(prev => prev.filter(item => item._id !== id))
  }

  const handleReject = async (id: string) => {
    await fetch("/api/admin/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setItems(prev => prev.filter(item => item._id !== id))
  }

  const handleStartEdit = (item: any) => {
    setEditingId(item._id)
    setEditForm({
      word: item.word,
      description: item.definitions?.[0]?.description || "",
      example: item.definitions?.[0]?.example?.[0] || "",
    })
  }

  const handleEditSubmit = async () => {
    if (!editingId) return
    await fetch("/api/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        updated: {
          word: editForm.word,
          definitions: [
            {
              description: editForm.description,
              example: [editForm.example],
            },
          ],
        },
      }),
    })
    setItems(prev =>
      prev.map(item =>
        item._id === editingId
          ? {
              ...item,
              word: editForm.word,
              definitions: [
                { description: editForm.description, example: [editForm.example] },
              ],
            }
          : item
      )
    )
    setEditingId(null)
  }

  return (
    <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
      <h2 className="text-2xl font-bold mb-4 text-[#001f3f]">제안된 단어 승인/수정/거절</h2>

      {items.length === 0 && (
        <p className="text-gray-500 text-sm">현재 승인 대기 중인 단어가 없습니다.</p>
      )}

      {items.map(item => (
        <div key={item._id} className="border p-4 rounded-md space-y-2 mb-4 bg-gray-50  text-[#001f3f]">
          {editingId === item._id ? (
            <div className="space-y-2">
              <input
                value={editForm.word}
                onChange={e => setEditForm({ ...editForm, word: e.target.value })}
                className="w-full border p-2"
              />
              <textarea
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full border p-2"
              />
              <input
                value={editForm.example}
                onChange={e => setEditForm({ ...editForm, example: e.target.value })}
                className="w-full border p-2"
              />
              <div className="flex gap-2">
                <button onClick={handleEditSubmit} className="bg-blue-600 text-white px-3 py-1 rounded">저장</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">취소</button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>단어:</strong> {item.word}</p>
              <p><strong>정의:</strong> {item.definitions?.[0]?.description}</p>
              <p><strong>예시:</strong> {item.definitions?.[0]?.example?.[0]}</p>
              <p><strong>작성자:</strong> {item.author}</p>
              <p><strong>태그:</strong> {item.tags?.join(", ")}</p>

              <div className="flex gap-2 mt-2">
                <button onClick={() => handleStartEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded">수정</button>
                <button onClick={() => handleApprove(item._id)} className="bg-green-600 text-white px-3 py-1 rounded">승인</button>
                <button onClick={() => handleReject(item._id)} className="bg-red-600 text-white px-3 py-1 rounded">거절</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
