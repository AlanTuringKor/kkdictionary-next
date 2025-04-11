// components/AdminNav.tsx
interface Props {
    current: string
    setTab: (tab: 'dashboard' | 'words' | 'suggestions' | 'tagclean') => void
  }
  
  export default function AdminNav({ current, setTab }: Props) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">관리자 메뉴</h2>
        <button
          onClick={() => setTab('dashboard')}
          className={`block w-full text-left py-2 px-3 rounded ${current === 'dashboard' ? 'bg-yellow-400 text-black' : ''}`}
        >
          📊 대시보드
        </button>
        <button
          onClick={() => setTab('words')}
          className={`block w-full text-left py-2 px-3 rounded ${current === 'words' ? 'bg-yellow-400 text-black' : ''}`}
        >
          📖 단어 관리
        </button>
        <button
          onClick={() => setTab('suggestions')}
          className={`block w-full text-left py-2 px-3 rounded ${current === 'suggestions' ? 'bg-yellow-400 text-black' : ''}`}
        >
          📬 제안 단어
        </button>
        <button
          onClick={() => setTab('tagclean')}
          className={`block w-full text-left py-2 px-3 rounded ${current === 'tagclean' ? 'bg-yellow-400 text-black' : ''}`}
        >
          🏷️ 태그 정리
        </button>
      </div>
    )
  }
  