'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TalentMarketplaceRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the correct route
    router.replace('/marketplace/talent');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to Talent Marketplace...</p>
    </div>
  );
}

