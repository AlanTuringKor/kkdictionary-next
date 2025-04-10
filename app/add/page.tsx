"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ReCAPTCHA from "react-google-recaptcha"

const TAG_OPTIONS = ["비속어", "성적용어", "힙합", "게임", "배그", "롤", "속담", "SNS"]

export default function AddWordPage() {
  const [word, setWord] = useState("")
  const [definition, setDefinition] = useState("")
  const [example, setExample] = useState("")
  const [author, setAuthor] = useState("")
  const [anonymous, setAnonymous] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleTagToggle = (tag: string) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleAddTag = () => {
    const cleaned = newTag.trim()
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned])
      setNewTag("")
    }
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    if (!word.trim() || !definition.trim() || !example.trim()) {
      setError("모든 필드를 입력해야 합니다.")
      setLoading(false)
      return
    }

    if (!captchaToken) {
      setError("로봇 인증을 완료해주세요.")
      setLoading(false)
      return
    }

    const res = await fetch("/api/usersuggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word,
        definition,
        example,
        author: anonymous ? "익명" : author.trim() || "익명",
        tags,
        captchaToken,
      }),
    })

    setLoading(false)

    if (res.ok) {
      alert("단어 제안이 완료되었습니다!\n24시간 안에 체크하고 올릴게요. 왠만하면 올라가니까 걱정 ㄴㄴ")
      router.push("/")
    } else {
      setError("저장에 실패했어요.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 font-sans">
      <h1 className="text-4xl font-bold text-center text-[#001f3f]">단어 제안하기</h1>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block font-semibold">단어 이름 *</label>
          <input
            value={word}
            onChange={e => setWord(e.target.value)}
            className="w-full border-b-2 border-[#FFDC00] p-2 focus:outline-none focus:ring-0 bg-transparent text-grey"
          />
        </div>

        <div>
          <label className="block font-semibold">정의 *</label>
          <textarea
            value={definition}
            onChange={e => setDefinition(e.target.value)}
            className="w-full border-b-2 border-[#FFDC00] p-2 focus:outline-none bg-transparent min-h-[100px] text-grey"
          />
        </div>

        <div>
          <label className="block font-semibold">예시 문장 *</label>
          <textarea
            value={example}
            onChange={e => setExample(e.target.value)}
            className="w-full border-b-2 border-[#FFDC00] p-2 focus:outline-none bg-transparent min-h-[80px] text-grey"
          />
        </div>

        <div>
          <label className="block font-semibold">작성자</label>
          <input
            value={anonymous ? "" : author}
            onChange={e => setAuthor(e.target.value)}
            disabled={anonymous}
            className="w-full border p-2 bg-gray-100 disabled:bg-white/80 text-black"
          />
          <label className="flex items-center gap-2 mt-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            /> 익명으로 제출하기
          </label>
        </div>

        <div>
          <label className="block font-semibold mb-2">해시태그 선택 / 추가</label>

          {/* 선택된 태그들 + 삭제 버튼 */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span key={tag} className="bg-[#FFDC00] text-[#001f3f] px-3 py-1 rounded-full text-sm flex items-center gap-1">
                #{tag}
                <button
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className="text-[#001f3f] ml-1 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* 해시태그 입력 */}
          <div className="flex gap-2">
            <input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="해시태그 입력"
              className="flex-1 border p-2 text-black"
            />
            <button
              onClick={handleAddTag}
              className="bg-[#FFDC00] text-[#001f3f] px-4 py-2"
            >
              추가
            </button>
          </div>

          {/* 해시태그 옵션 버튼 */}
          <div className="mt-2 flex flex-wrap gap-2">
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 border rounded-full text-sm ${tags.includes(tag)
                  ? 'bg-[#FFDC00] text-[#001f3f]'
                  : 'bg-white text-[#333]'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold">로봇 인증 *</label>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        {error && <div className="text-red-500 font-semibold">{error}</div>}

        <button
          onClick={handleSubmit}
          disabled={!captchaToken || loading}
          className="w-full bg-[#FFDC00] text-[#001f3f] py-3 font-bold text-lg hover:brightness-105 disabled:opacity-60"
        >
          {loading ? "제안 중..." : "단어 제안하기"}
        </button>
      </div>
    </div>
  )
}
