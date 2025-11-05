'use client'

import { StudioDetailPage } from '@/components/pages/StudioDetailPage';

export default function StudioDetailRoute() {
  return (
    <div className="min-h-screen">
      <StudioDetailPage isDashboardDarkMode={true} isDashboardContext={true} />
    </div>
  );
}

