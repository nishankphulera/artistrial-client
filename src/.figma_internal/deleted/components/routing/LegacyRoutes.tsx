import React from 'react';
// Route component no longer needed from 'next/navigation';
import { ProfileSettingsPage } from '../pages/ProfileSettingsPage';
import { ProfileDebugPage } from '../pages/ProfileDebugPage';
import { CreateListingPage } from '../forms/ListingFormsManager';
import { CollaborationDashboard } from '../pages/CollaborationDashboard';
import { CollaborationsPage } from '../pages/CollaborationsPage';
import { CreateCollaborationPage } from '../pages/CreateCollaborationPage';
import { UserApplications } from '../pages/UserApplications';
import { CollaborationFlow } from '../pages/CollaborationFlow';
import { CartPage } from '../CartPage';
import { OrdersPage } from '../OrdersPage';
import { ProtectedRoute } from '../shared/ProtectedRoute';
import { LEGACY_ROUTES } from '../../utils/routes';
import { useAuth } from '../providers/AuthProvider';

interface LegacyRoutesProps {
  onProceedToCheckout: (cartData: any) => void;
}

export function LegacyRoutes({ onProceedToCheckout }: LegacyRoutesProps) {
  const { user } = useAuth();

  return (
    <React.Fragment>
      <Route path={LEGACY_ROUTES.PROFILE_SETTINGS} element={<ProfileSettingsPage />} />
      <Route path={LEGACY_ROUTES.PROFILE_DEBUG} element={<ProfileDebugPage />} />
      <Route path={LEGACY_ROUTES.CREATE_LISTING} element={<CreateListingPage />} />
      <Route 
        path={LEGACY_ROUTES.COLLABORATIONS} 
        element={
          <ProtectedRoute>
            <CollaborationDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={LEGACY_ROUTES.COLLABORATIONS_BROWSE} 
        element={
          <ProtectedRoute>
            <CollaborationsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={LEGACY_ROUTES.COLLABORATIONS_CREATE} 
        element={
          <ProtectedRoute>
            <CreateCollaborationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={LEGACY_ROUTES.COLLABORATIONS_APPLICATIONS} 
        element={
          <ProtectedRoute>
            <UserApplications />
          </ProtectedRoute>
        } 
      />
      <Route path={LEGACY_ROUTES.COLLABORATIONS_FLOW} element={<CollaborationFlow />} />
      <Route 
        path={LEGACY_ROUTES.CART} 
        element={
          <ProtectedRoute>
            <CartPage 
              userId={user?.id || ''}
              onProceedToCheckout={onProceedToCheckout}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={LEGACY_ROUTES.ORDERS} 
        element={
          <ProtectedRoute>
            <OrdersPage 
              userId={user?.id || ''}
              userRole={user?.user_metadata?.is_artist ? 'artist' : 'user'}
            />
          </ProtectedRoute>
        } 
      />
    </React.Fragment>
  );
}

