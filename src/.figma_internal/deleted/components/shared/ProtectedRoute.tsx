import React from 'react';
import { Navigate } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = '/auth' }: ProtectedRouteProps) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate href={redirectTo} replace />;
  }
  
  return <>{children}</>;
}

