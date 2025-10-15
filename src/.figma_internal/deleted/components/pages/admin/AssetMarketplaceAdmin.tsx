import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Grid, 
  List, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  ShoppingCart,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { AssetSearchFilters } from '../../shared/AssetSearchFilters';
import { UserProfileLink } from '../../shared/UserProfileLink';

import { fetchMarketplaceAssets, mockCategories, mockTags } from '../../shared/MarketplaceData';
import type { Asset } from '../../shared/MarketplaceData';
import { useAuth } from '../../providers/AuthProvider';

interface AssetMarketplaceAdminProps {
  onAddToCart?: (artworkId: string) => void;
  cartItemCount?: number;
  isDashboardDarkMode?: boolean;
}

interface AdminStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
}

export const AssetMarketplaceAdmin: React.FC<AssetMarketplaceAdminProps> = ({
  onAddToCart,
  cartItemCount,
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-assets');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 1000],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  const filterConfig: FilterConfig = {
    categories: [
      { value: 'digital_art', label: 'Digital Art', icon: null },
      { value: 'photography', label: 'Photography', icon: null },
      { value: 'illustrations', label: 'Illustrations', icon: null },
      { value: 'graphics', label: 'Graphics & Design', icon: null },
      { value: 'templates', label: 'Templates', icon: null },
      { value: 'three_d', label: '3D Models', icon: null },
    ],
    priceRange: { min: 0, max: 1000 },
    availability: true,
    rating: true,
    customFilters: [
      {
        name: 'status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending Approval' },
          { value: 'sold', label: 'Sold' },
          { value: 'inactive', label: 'Inactive' }
        ]
      },
      {
        name: 'performance',
        type: 'select',
        options: [
          { value: 'high', label: 'High Performance' },
          { value: 'medium', label: 'Medium Performance' },
          { value: 'low', label: 'Low Performance' }
        ]
      }
    ],
    moduleType: 'assets'
  };

  useEffect(() => {
    loadData();
  }, [filters, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load assets with admin view enabled
      const filterParams = {
        search: filters.searchTerm,
        category: Array.isArray(filters.category) && filters.category.length > 0 ? filters.category[0] : undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: filters.sortBy
      };
      
      const assetsData = await fetchMarketplaceAssets(filterParams, true, user?.id);
      setAssets(assetsData);
      
      // Mock admin stats
      setAdminStats({
        totalListings: assetsData.length,
        activeListings: assetsData.filter(a => a.status === 'active').length,
        totalViews: assetsData.reduce((sum, a) => sum + a.views, 0),
        totalSales: assetsData.reduce((sum, a) => sum + (a.sales || 0), 0),
        totalRevenue: assetsData.reduce((sum, a) => sum + (a.revenue || 0), 0),
        conversionRate: 3.2,
      });
    } catch (error) {
      console.error('Error loading admin marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = (assetId: string) => {
    router.push(`/dashboard/edit-asset/${assetId}`);
  };

  const handleDeleteAsset = (assetId: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    }
  };

  const handleViewAnalytics = (assetId: string) => {
    router.push(`/dashboard/analytics/asset/${assetId}`);
  };

  const filteredAssets = assets.filter(asset => {
    // Tab filtering
    let tabMatch = true;
    switch (activeTab) {
      case 'my-listings':
        tabMatch = asset.artist.id === user?.id;
        break;
      case 'active':
        tabMatch = asset.status === 'active';
        break;
      case 'pending':
        tabMatch = asset.status === 'pending';
        break;
      case 'sold':
        tabMatch = asset.status === 'sold';
        break;
    }

    if (!tabMatch) return false;

    // Apply all other filters (same as public page)
    const matchesSearch = !filters.searchTerm || 
      asset.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    
    const matchesMainCategory = !Array.isArray(filters.category) || filters.category.length === 0 || 
      filters.category.some(category => asset.category.toLowerCase().includes(category.toLowerCase()));
    
    const matchesSubcategory = !Array.isArray(filters.subcategory) || filters.subcategory.length === 0 ||
      filters.subcategory.some(subcategory => asset.tags.some(tag => tag.toLowerCase().includes(subcategory.toLowerCase())));
    
    const matchesPrice = asset.price >= filters.priceRange[0] && asset.price <= filters.priceRange[1];
    
    return matchesSearch && matchesMainCategory && matchesSubcategory && matchesPrice;
  });

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Stats Section */}
      <div className="p-4 sm:p-6 lg:p-8">

        {/* Admin Stats Dashboard */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Listings</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalListings}
                    </p>
                  </div>
                  <BarChart3 className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.activeListings}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Views</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <Eye className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sales</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalSales}
                    </p>
                  </div>
                  <ShoppingCart className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</p>
                    <p className="text-2xl font-title text-[#FF8D28]">
                      ${adminStats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-[#FF8D28]" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversion</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.conversionRate}%
                    </p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className={`grid w-full max-w-2xl grid-cols-5 ${isDashboardDarkMode ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="all-assets">All Assets</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area with Filter Sidebar */}
      <div className="flex h-full">
        {/* Filter Sidebar */}
        <FilterSidebar
          config={filterConfig}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredAssets.length}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value={activeTab} className="space-y-6 mt-0">

              {/* Search and Category Section */}
              <AssetSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                isDarkMode={isDashboardDarkMode}
                resultCount={filteredAssets.length}
              />

              {/* Asset Grid/List */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square bg-gray-200 animate-pulse"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6" :
                  "space-y-4"
                }>
                  {filteredAssets.map((asset) => (
                    <Card key={asset.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}>
                      <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}>
                        <ImageWithFallback
                          src={asset.imageUrl || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-4`}>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>{asset.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditAsset(asset.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewAnalytics(asset.id)}>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteAsset(asset.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">by <UserProfileLink 
                             userId={asset.artist.id}
                             userName={asset.artist.name}
                             prefix=""
                           /></p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {asset.category}
                            </Badge>
                            <Badge 
                              variant={asset.status === 'active' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {asset.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {asset.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-lg font-title text-[#FF8D28]">
                              ${asset.price}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Eye className="h-3 w-3" />
                              {asset.views || 0}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredAssets.length === 0 && (
                <div className="text-center py-16">
                  <div className={`text-6xl mb-4 ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>🎨</div>
                  <h3 className={`text-lg font-title mb-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No assets found
                  </h3>
                  <p className={`${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                    Try adjusting your search criteria or browse different categories.
                  </p>
                  <Button onClick={() => setFilters({
                    searchTerm: '',
                    category: [],
                    subcategory: [],
                    location: 'all',
                    priceRange: [0, 1000],
                    availability: 'all',
                    minRating: 0,
                    sortBy: 'newest'
                  })}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

