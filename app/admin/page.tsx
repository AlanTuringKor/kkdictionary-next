// ✅ app/admin/page.tsx
import { notFound } from 'next/navigation'
import AdminApp from '@/components/AdminApp'

interface AdminPageProps {
  searchParams: { secret?: string }
}

export default function AdminPage({ searchParams }: AdminPageProps) {
  const secret = searchParams.secret
  const correctSecret = process.env.ADMIN_SECRET

  if (secret !== correctSecret) {
    return notFound()
  }

  return <AdminApp />
}