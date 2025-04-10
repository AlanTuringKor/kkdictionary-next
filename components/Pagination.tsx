// components/Pagination.tsx
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const maxPageLinks = 5
  const half = Math.floor(maxPageLinks / 2)
  let startPage = Math.max(1, currentPage - half)
  let endPage = Math.min(totalPages, currentPage + half)

  if (endPage - startPage < maxPageLinks - 1) {
    if (startPage === 1) {
      endPage = Math.min(startPage + maxPageLinks - 1, totalPages)
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPageLinks + 1)
    }
  }

  const pages = []

  if (startPage > 1) pages.push(<span key="start-ellipsis" className="text-[#FFDC00] text-base">...</span>)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Link
        key={i}
        href={`${basePath}?page=${i}`}
        className={`px-3 py-1.5 text-base font-mono transition text-[#FFDC00] ${
          currentPage === i
            ? 'bg-[#FFDC00] text-[#001f3f] font-bold'
            : 'hover:bg-[#FFDC00]/10 rounded'
        }`}
      >
        {i}
      </Link>
    )
  }

  if (endPage < totalPages) pages.push(<span key="end-ellipsis" className="text-[#FFDC00] text-base">...</span>)

  const createPageLink = (page: number, label?: string, isDisabled = false) => (
    <Link
      key={label || page}
      href={`${basePath}?page=${page}`}
      className={`px-3 py-1.5 text-base font-mono text-[#FFDC00] transition ${
        isDisabled
          ? 'opacity-30 cursor-default'
          : 'hover:bg-[#FFDC00]/10 rounded'
      }`}
    >
      {label || page}
    </Link>
  )

  return (
    <nav className="flex justify-center items-center gap-2 flex-wrap mt-6">
      {createPageLink(1, '<<', currentPage === 1)}
      {createPageLink(currentPage - 1, '<', currentPage === 1)}
      {pages}
      {createPageLink(currentPage + 1, '>', currentPage === totalPages)}
      {createPageLink(totalPages, '>>', currentPage === totalPages)}
    </nav>
  )
}
