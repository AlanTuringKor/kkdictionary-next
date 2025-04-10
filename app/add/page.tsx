"use client"

import { useRouter } from "next/navigation"
import ReCAPTCHA from "react-google-recaptcha"
import { useState, useEffect } from "react" // ← useEffect 추가

const TAG_OPTIONS = ["신조어","비속어","줄임말", "성적용어", "힙합", "게임", "배그", "롤", "속담", "SNS"]


const funHeaders = [
  "이랏샤이마세!! 단어 추가하신답니다!!",
  "당신의 단어, 여기서 꽃피워요 🌸",
  "헉… 이 단어 나만 몰랐어?",
  "이런 단어도 있었어?! 추가 ㄱㄱ",
  "ㅋㅋ백과의 새 역사를 써보자 📘",
  "나만 아는 단어, 이제 모두의 것으로",
  "오늘의 밈은 너가 만든다 🔥",
  "단어 추가는 사랑입니다 ❤️",
  "언어의 마법사, 당신을 환영합니다!",
  "드루와~ 단어 한 스푼만 주세요",
  "지금 안 넣으면 잊혀짐 주의;;",
  "여기 단어 넣으면 내 친구가 알아감",
  "ㅋㅋ백과 제작진이 되고 싶다면?",
  "센스 폭발! 단어 좀 추가해줘~",
  "이 단어가 진짜라고요…?",
  "오늘도 신규 단어 런칭합니다 🎉",
  "말 한마디가 밈을 만든다",
  "전 국민이 아는 그 단어, 혹시 너야?",
  "소문난 단어, 여기 다 모임",
  "나도 추가했어, 너도 하자",
  "말해 뭐해~ 그냥 추가해",
  "백과사전보다 생생한 너의 단어",
  "사람들이 궁금해하는 그 말, 등록 ㄱ",
  "이 단어 누가 만들었어? (너)",
  "추억의 단어도 대환영~",
  "ㅋㅋ 이거 완전 신박해요",
  "한 줄로 정의해보는 나만의 단어",
  "ㅋㅋ백과 고인물이 되어보자",
  "단어 하나로 세상을 흔들자",
  "추가하면 복 받습니다 🙏",
  "아 ㅋㅋ 단어 하나 추가했을 뿐인데 벌써 유물됨",
  "님 이거 안 올리면 나중에 후회함 ㄹㅇ",
  "이 단어 모르면 간첩임 ㅇㅇ",
  "병1신같지만 쓸모있는 단어 추가 ㄱ",
  "그거 걍 니가 만든 단어 아님? ㅋㅋ",
  "지금 추가 안 하면 조만간 누가 훔쳐감",
  "단어 추가하면 여친 생김 (아님 말고)",
  "좆같은 단어 정리 좀 하자;;",
  "진짜 급식들이나 쓰는 말인데 왜 유행함?",
  "ㅋㅋ 단어보소 21세기 시적 감각",
  "님 이런 단어도 모름? 인터넷 끊으셈",
  "이게 단어냐? 근데 웃기네",
  "아니 시발 이건 좀 알려줘야지",
  "요즘 애들 말하는 거 못 알아먹겠음",
  "대충 유행어 만든놈 잡으러 가는 짤",
  "DC공인 병맛 단어 백서 1장 추가",
  "이거 올리면 일베 소리 들음 (진짜 주의)",
  "너 이런 단어 쓰지 마라… 여자 도망감",
  "단어 뜻 모르면 인싸랑 대화 불가임",
  "이거 나만 쓰는 말인데 퍼지면 어떡함;;",
  "욕은 아닌데 욕처럼 들리는 단어 추천좀",
  "니 단어잖아 이거;; 뭐 멋있다고 올리냐",
  "DC야 이런 거에 진심인 사이트임",
  "단어 하나 추가하면 정신 나간 사람 취급받는 사이트",
  "단어로 사회 풍자하는 거 개간지임 ㅇㅈ?",
  "이거 내가 2012년에 쓰던 말인데요",
  "요즘 신조어 보면 걍 무서움;;",
  "추억팔이 하다가 백과사전 만들 기세",
  "지금 당장 고증 추가 ㄱㄱ",
  "찐 디씨인이라면 이 단어 기억한다"
]

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

  const [headerText, setHeaderText] = useState("단어 제안하기")

  useEffect(() => {
    const random = funHeaders[Math.floor(Math.random() * funHeaders.length)]
    setHeaderText(random)
  }, [])

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
      <h1 className="text-4xl font-bold text-center text-grey">{headerText}</h1>

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
