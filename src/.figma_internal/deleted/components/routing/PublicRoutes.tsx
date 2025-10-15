import React from 'react';
// Route component no longer needed from 'next/navigation';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePageFixed';
import { AuthPage } from '../pages/AuthPage';
import { CommunityPage } from '../pages/CommunityPage';
import { TalentMarketplacePage } from '../pages/TalentMarketplacePage';
import { AssetMarketplacePage } from '../pages/AssetMarketplacePage';
import { StudiosPage } from '../pages/StudiosPage';
import { InvestorsPage } from '../pages/InvestorsPage';
import { TicketsPage } from '../pages/TicketsPage';
import { LegalServicesPage } from '../pages/LegalServicesPage';
import { ProductServicesPage } from '../pages/ProductServicesPage';
import { EducationPage } from '../pages/EducationPage';
import { PUBLIC_ROUTES } from '../../utils/routes';

interface PublicRoutesProps {
  onAddToCart: (artworkId: string) => void;
  cartItemCount: number;
}

export function PublicRoutes({ onAddToCart, cartItemCount }: PublicRoutesProps) {
  return (
    <React.Fragment>
      <Route path={PUBLIC_ROUTES.HOME} element={<HomePage />} />
      <Route path={PUBLIC_ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path={PUBLIC_ROUTES.AUTH} element={<AuthPage />} />
      <Route path={PUBLIC_ROUTES.COMMUNITY} element={<CommunityPage />} />
      <Route path={PUBLIC_ROUTES.TALENT_MARKETPLACE} element={<TalentMarketplacePage />} />
      <Route 
        path={PUBLIC_ROUTES.MARKETPLACE} 
        element={
          <AssetMarketplacePage 
            onAddToCart={onAddToCart}
            cartItemCount={cartItemCount}
          />
        } 
      />
      <Route path={PUBLIC_ROUTES.STUDIOS} element={<StudiosPage />} />
      <Route path={PUBLIC_ROUTES.INVESTORS} element={<InvestorsPage />} />
      <Route path={PUBLIC_ROUTES.TICKETS} element={<TicketsPage />} />
      <Route path={PUBLIC_ROUTES.LEGAL_SERVICES} element={<LegalServicesPage />} />
      <Route path={PUBLIC_ROUTES.PRODUCT_SERVICES} element={<ProductServicesPage />} />
      <Route path={PUBLIC_ROUTES.EDUCATION} element={<EducationPage />} />
    </React.Fragment>
  );
}

