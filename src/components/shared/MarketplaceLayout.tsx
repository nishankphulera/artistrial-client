import React from 'react';
import { FilterSidebar, FilterConfig, FilterState } from './FilterSidebar';

interface MarketplaceLayoutProps {
  filterConfig: FilterConfig;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount?: number;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  searchAndCategoryContent?: React.ReactNode;
}

export function MarketplaceLayout({
  filterConfig,
  filters,
  onFiltersChange,
  resultCount,
  children,
  headerContent,
  searchAndCategoryContent
}: MarketplaceLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar - Fixed */}
        <div className="flex-shrink-0 bg-white border-r border-gray-200">
          <FilterSidebar
            config={filterConfig}
            filters={filters}
            onFiltersChange={onFiltersChange}
            resultCount={resultCount}
          />
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Section */}
          {headerContent && (
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
              {headerContent}
            </div>
          )}

          {/* Search and Category Section */}
          {searchAndCategoryContent && (
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
              {searchAndCategoryContent}
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

