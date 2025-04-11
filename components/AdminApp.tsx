'use client'

import { useState } from 'react'
import AdminNav from './AdminNav'
import AdminWords from './AdminWords'
import AdminDashboard from './AdminDashboard'
import AdminSuggestedWords from './SuggestedWordsPanel'
import AdminTagCleaner from './AdminTagCleaner'

export default function AdminApp() {
  const [tab, setTab] = useState<'dashboard' | 'words' | 'suggestions' | 'tagclean'>('dashboard')

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="sm:w-64 bg-[#001f3f] text-white">
        <AdminNav current={tab} setTab={setTab} />
      </div>
      <div className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50">
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'words' && <AdminWords />}
        {tab === 'suggestions' && <AdminSuggestedWords />}
        {tab === 'tagclean' && <AdminTagCleaner />}
      </div>
    </div>
  )
}
