// src/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 mt-10 border-t">
      <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center">
        <div>ⓒ 2025 ㅋㅋ백과. All rights reserved.</div>
        <div className="mt-2 sm:mt-0">
          <Link href="/privacy" className="hover:underline">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  )
}
