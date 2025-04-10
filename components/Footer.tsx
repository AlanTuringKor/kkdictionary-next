// src/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-[#001830] text-white mt-10 border-t border-[#FFDC00]">
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm flex flex-col sm:flex-row justify-between items-center font-mono">
        <div>ⓒ 2025 ㅋㅋ백과. All rights reserved.</div>
        <div className="mt-2 sm:mt-0">
          <Link href="/privacy" className="hover:text-[#FFDC00] transition">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  )
}
