'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardTalentMarketplaceRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the correct route
    router.replace('/dashboard/marketplace/talent');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to Talent Marketplace...</p>
    </div>
  );
}

