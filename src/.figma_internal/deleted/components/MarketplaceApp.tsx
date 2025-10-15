import React from 'react';
// React Router components no longer needed from 'next/navigation';
import { CheckoutPage } from './CheckoutPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePageFixed';
import { AuthPage } from './pages/AuthPage';
import { CommunityPage } from './pages/CommunityPage';
import { TalentMarketplacePage } from './pages/TalentMarketplacePage';
import { TalentDetailPage } from './pages/TalentDetailPage';
import { AssetMarketplacePage } from './pages/AssetMarketplacePage';
import { StudiosPage } from './pages/StudiosPage';
import { InvestorsPage } from './pages/InvestorsPage';
import { TicketsPage } from './pages/TicketsPage';
import { LegalServicesPage } from './pages/LegalServicesPage';
import { ProductServicesPage } from './pages/ProductServicesPage';
import { EducationPage } from './pages/EducationPage';
import { DashboardPageSidebar } from './pages/DashboardPageSidebar';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { ProfileDebugPage } from './pages/ProfileDebugPage';
import { CreateListingPage } from './forms/ListingFormsManager';
import { CollaborationDashboard } from './pages/CollaborationDashboard';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { CreateCollaborationPage } from './pages/CreateCollaborationPage';
import { UserApplications } from './pages/UserApplications';
import { CollaborationFlow } from './pages/CollaborationFlow';
import { CartPage } from './CartPage';
import { OrdersPage } from './OrdersPage';
import { ProtectedRoute } from './shared/ProtectedRoute';
import { useCart } from '../hooks/useCart';
import { useAuth } from './providers/AuthProvider';
import { PUBLIC_ROUTES, DASHBOARD_ROUTES, CREATE_ROUTES, LEADS_ROUTES, BUSINESS_ROUTES, LEGACY_ROUTES } from '../utils/routes';

export function MarketplaceApp() {
  const { user } = useAuth();
  const {
    cart,
    showCheckout,
    handleAddToCart,
    handleProceedToCheckout,
    handlePaymentComplete,
    handleBackToCart,
  } = useCart();

  const onAddToCart = (artworkId: string) => handleAddToCart(artworkId, user);

  if (showCheckout && user) {
    return (
      <CheckoutPage
        cart={cart}
        userId={user.id}
        onPaymentComplete={handlePaymentComplete}
        onBack={handleBackToCart}
      />
    );
  }

  return (
    <Routes>
      {/* Dashboard Routes - Must come first to match before public routes */}
      <Route 
        path={DASHBOARD_ROUTES.ROOT} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="dashboard" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.ACTIVITY} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="activity" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.ANALYTICS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="analytics" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.CHAT} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="chat" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.CONNECTIONS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="connections" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.TALENT_MARKETPLACE} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="talent-marketplace" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.TALENT_DETAIL} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="talent-detail" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.MARKETPLACE} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar 
              currentPage="marketplace"
              onAddToCart={onAddToCart}
              cartItemCount={cart.items.length}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.STUDIOS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="studios" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.INVESTORS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="investors" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.TICKETS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="tickets" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.LEGAL_SERVICES} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="legal-services" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.PRODUCT_SERVICES} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="product-services" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.EDUCATION} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="education" />
          </ProtectedRoute>
        } 
      />

      {/* Collaboration Routes */}
      <Route 
        path={DASHBOARD_ROUTES.COLLABORATIONS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="collaborations" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.COLLABORATIONS_BROWSE} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="collaborations-browse" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.COLLABORATIONS_CREATE} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="collaborations-create" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.COLLABORATIONS_APPLICATIONS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="collaborations-applications" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.COLLABORATIONS_FLOW} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="collaborations-flow" />
          </ProtectedRoute>
        } 
      />

      {/* Gig Management Route */}
      <Route 
        path={DASHBOARD_ROUTES.GIGS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="gigs" />
          </ProtectedRoute>
        } 
      />

      {/* Profile Routes */}
      <Route 
        path={DASHBOARD_ROUTES.PROFILE} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="profile" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.PROFILE_SETTINGS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="profile-settings" />
          </ProtectedRoute>
        } 
      />

      {/* Form Examples Route */}
      <Route 
        path={DASHBOARD_ROUTES.FORM_EXAMPLES} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="form-examples" />
          </ProtectedRoute>
        } 
      />

      {/* IP Creation Route */}
      <Route 
        path={DASHBOARD_ROUTES.CREATE_IP} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="create-ip" />
          </ProtectedRoute>
        } 
      />

      {/* Ongoing Creation Route */}
      <Route 
        path={DASHBOARD_ROUTES.ONGOING_CREATION} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="ongoing-creation" />
          </ProtectedRoute>
        } 
      />

      {/* Ongoing Creation Detail Route */}
      <Route 
        path={DASHBOARD_ROUTES.ONGOING_CREATION_DETAIL} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="ongoing-creation-detail" />
          </ProtectedRoute>
        } 
      />

      {/* Creations Route */}
      <Route 
        path={DASHBOARD_ROUTES.CREATIONS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="creations" />
          </ProtectedRoute>
        } 
      />

      {/* My OGs Route */}
      <Route 
        path={DASHBOARD_ROUTES.MY_OGS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar currentPage="my-ogs" />
          </ProtectedRoute>
        } 
      />

      {/* Cart and Orders */}
      <Route 
        path={DASHBOARD_ROUTES.CART} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar 
              currentPage="cart"
              onProceedToCheckout={handleProceedToCheckout}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={DASHBOARD_ROUTES.ORDERS} 
        element={
          <ProtectedRoute>
            <DashboardPageSidebar 
              currentPage="orders"
              userRole={user?.user_metadata?.is_artist ? 'artist' : 'user'}
            />
          </ProtectedRoute>
        } 
      />

      {/* Create Listing Routes */}
      {Object.entries(CREATE_ROUTES).map(([key, path]) => (
        <Route 
          key={key}
          path={path} 
          element={
            <ProtectedRoute>
              <DashboardPageSidebar currentPage={path.split('/').pop() as string} />
            </ProtectedRoute>
          } 
        />
      ))}

      {/* Leads Management Routes */}
      {Object.entries(LEADS_ROUTES).map(([key, path]) => (
        <Route 
          key={key}
          path={path} 
          element={
            <ProtectedRoute>
              <DashboardPageSidebar currentPage={path.split('/').pop() as string} />
            </ProtectedRoute>
          } 
        />
      ))}

      {/* Business Management CRM Routes */}
      {Object.entries(BUSINESS_ROUTES).map(([key, path]) => (
        <Route 
          key={key}
          path={path} 
          element={
            <ProtectedRoute>
              <DashboardPageSidebar currentPage={path.split('/').pop() as string} />
            </ProtectedRoute>
          } 
        />
      ))}

      {/* Public Routes */}
      <Route path={PUBLIC_ROUTES.HOME} element={<HomePage />} />
      <Route path={PUBLIC_ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path={PUBLIC_ROUTES.AUTH} element={<AuthPage />} />
      <Route path={PUBLIC_ROUTES.COMMUNITY} element={<CommunityPage />} />
      <Route path={PUBLIC_ROUTES.TALENT_MARKETPLACE} element={<TalentMarketplacePage />} />
      <Route path={PUBLIC_ROUTES.TALENT_DETAIL} element={
        <TalentDetailPage />
      } />
      <Route 
        path={PUBLIC_ROUTES.MARKETPLACE} 
        element={
          <AssetMarketplacePage 
            onAddToCart={onAddToCart}
            cartItemCount={cart.items.length}
          />
        } 
      />
      <Route path={PUBLIC_ROUTES.STUDIOS} element={<StudiosPage />} />
      <Route path={PUBLIC_ROUTES.INVESTORS} element={<InvestorsPage />} />
      <Route path={PUBLIC_ROUTES.TICKETS} element={<TicketsPage />} />
      <Route path={PUBLIC_ROUTES.LEGAL_SERVICES} element={<LegalServicesPage />} />
      <Route path={PUBLIC_ROUTES.PRODUCT_SERVICES} element={<ProductServicesPage />} />
      <Route path={PUBLIC_ROUTES.EDUCATION} element={<EducationPage />} />

      {/* Legacy Routes */}
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
              onProceedToCheckout={handleProceedToCheckout}
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

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate href="/" replace />} />
    </Routes>
  );
}

