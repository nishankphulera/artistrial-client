'use client'

import { Suspense } from 'react'
import { DashboardPageSidebar } from '@/components/pages/DashboardPageSidebar'

function BrowseCollaborationsContent() {
  return <DashboardPageSidebar currentPage="collaborations-browse" />
}

export default function BrowseCollaborationsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <BrowseCollaborationsContent />
    </Suspense>
  )
}
