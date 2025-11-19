// Unified Data Management System for Artistrial Marketplace
// This file exports all marketplace data services and provides a centralized interface

// Import for dynamic access in helper functions
import { useTalentData, talentFilterConfig } from './TalentDataService';
import { useStudioData, studioFilterConfig } from './StudioDataService';
import { useInvestorData, investorFilterConfig } from './InvestorDataService';
import { useEducationData, educationFilterConfig } from './EducationDataService';
import { useLegalData, legalFilterConfig } from './LegalDataService';
import { useProductData, productFilterConfig } from './ProductDataService';
import { useTicketData, ticketFilterConfig } from './TicketDataService';
import { fetchMarketplaceAssets } from '../MarketplaceData';

// Individual Data Services
export * from './TalentDataService';
export * from './StudioDataService';
export * from './InvestorDataService';
export * from './EducationDataService';
export * from './LegalDataService';
export * from './ProductDataService';
export * from './TicketDataService';

// Re-export the existing MarketplaceData for assets
export * from '../MarketplaceData';

// Common Types
export interface BaseDataContext {
  context: 'public' | 'admin';
  userId?: string;
  activeTab?: string;
}

export interface BaseFilters {
  searchTerm: string;
  category: string[];
  subcategory: string[];
  location: string;
  priceRange: [number, number];
  availability: string;
  minRating: number;
  sortBy: string;
}

// Common tab configurations for admin views
export const commonAdminTabs = {
  talent: [
    { value: 'all-talents', label: 'All Talents' },
    { value: 'my-profiles', label: 'My Profiles' },
    { value: 'bookings', label: 'Booking Requests' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ],
  studios: [
    { value: 'all-studios', label: 'All Studios' },
    { value: 'my-studios', label: 'My Studios' },
    { value: 'bookings', label: 'Booking Requests' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ],
  investors: [
    { value: 'all-investors', label: 'All Investors' },
    { value: 'my-profiles', label: 'My Profiles' },
    { value: 'applications', label: 'Investment Applications' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ],
  education: [
    { value: 'all-courses', label: 'All Courses' },
    { value: 'my-courses', label: 'My Courses' },
    { value: 'enrollments', label: 'Student Enrollments' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ],
  legal: [
    { value: 'all-lawyers', label: 'All Lawyers' },
    { value: 'my-profiles', label: 'My Profiles' },
    { value: 'consultations', label: 'Consultation Requests' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ],
  products: [
    { value: 'all-listings', label: 'All Listings' },
    { value: 'my-listings', label: 'My Listings' },
    { value: 'products', label: 'Products' },
    { value: 'services', label: 'Services' },
    { value: 'orders', label: 'Orders' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
  ],
  tickets: [
    { value: 'all-events', label: 'All Events' },
    { value: 'my-events', label: 'My Events' },
    { value: 'purchases', label: 'Ticket Purchases' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold-out', label: 'Sold Out' },
  ],
  assets: [
    { value: 'all-assets', label: 'All Assets' },
    { value: 'my-assets', label: 'My Assets' },
    { value: 'purchases', label: 'Purchases' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
  ],
};

// Common sort options
export const commonSortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

// Helper function to get the appropriate data service hook
export const getDataServiceHook = (moduleType: string) => {
  switch (moduleType) {
    case 'talent':
      return useTalentData;
    case 'studios':
      return useStudioData;
    case 'investors':
      return useInvestorData;
    case 'education':
      return useEducationData;
    case 'legal':
      return useLegalData;
    case 'products':
      return useProductData;
    case 'tickets':
      return useTicketData;
    case 'assets':
      return fetchMarketplaceAssets;
    default:
      throw new Error(`Unknown module type: ${moduleType}`);
  }
};

// Helper function to get filter configuration
export const getFilterConfig = (moduleType: string) => {
  switch (moduleType) {
    case 'talent':
      return talentFilterConfig;
    case 'studios':
      return studioFilterConfig;
    case 'investors':
      return investorFilterConfig;
    case 'education':
      return educationFilterConfig;
    case 'legal':
      return legalFilterConfig;
    case 'products':
      return productFilterConfig;
    case 'tickets':
      return ticketFilterConfig;
    default:
      throw new Error(`Unknown module type: ${moduleType}`);
  }
};

/**
 * 🎯 **UNIFIED DATA MANAGEMENT BENEFITS:**
 * 
 * ✅ **Consistent Data**: All marketplace modules use the same data source
 * ✅ **Unified Filtering**: Identical filter logic across public and admin views
 * ✅ **Tab Management**: Proper admin tab filtering (My Listings, Active, Pending, etc.)
 * ✅ **User Ownership**: Accurate user ownership detection across all modules
 * ✅ **API Fallback**: Graceful fallback to mock data when API is unavailable
 * ✅ **Type Safety**: Full TypeScript support for all data types
 * ✅ **Scalable**: Easy to add new marketplace modules or modify existing ones
 * 
 * 📊 **DATA CONSISTENCY GUARANTEE:**
 * - Public pages and admin pages will always show the same base data
 * - Admin tabs will filter from the same dataset as public views
 * - User ownership is determined consistently across all contexts
 * - No more 3 vs 2 listing discrepancies between public and admin views
 */

