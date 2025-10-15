import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  Grid, 
  List, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Package,
  Edit,
  Star,
  MapPin,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle,
  ShoppingCart,
  Wrench
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { ProductSearchFilters } from '../../shared/ProductSearchFilters';
import { AdminHeader } from '../../shared/AdminHeader';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useAuth } from '../../providers/AuthProvider';
import {
  useProductData,
  ProductService,
  ProductFilters,
  productFilterConfig
} from '../../shared/data/ProductDataService';

interface AdminStats {
  totalListings: number;
  myListings: number;
  totalSales: number;
  totalRevenue: number;
  averagePrice: number;
  conversionRate: number;
}

interface ProductServicesAdminProps {
  isDashboardDarkMode?: boolean;
}

export const ProductServicesAdmin: React.FC<ProductServicesAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchProductServices } = useProductData();
  const [items, setItems] = useState<ProductService[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-items');

  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 500],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Use the unified data service
      const data = await fetchProductServices(filters, {
        context: 'admin',
        userId: user?.id,
        activeTab: activeTab,
      });

      setItems(data);

      // Calculate admin stats from the loaded data
      const myListings = data.filter(item => item.isOwner).length;
      setAdminStats({
        totalListings: data.length,
        myListings: myListings,
        totalSales: data.reduce((sum, item) => sum + (item.sales || 0), 0),
        totalRevenue: data
          .filter(item => item.isOwner)
          .reduce((sum, item) => sum + (item.earnings || 0), 0),
        averagePrice: data.length > 0
          ? data.reduce((sum, item) => sum + (item.price || 0), 0) / data.length
          : 0,
        conversionRate: data.length > 0
          ? (data.reduce((sum, item) => sum + (item.sales || 0), 0) / data.reduce((sum, item) => sum + (item.totalReviews || 1), 0)) * 100
          : 0,
      });
    } catch (error) {
      console.error('Error loading admin product/service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = () => {
    router.push('/dashboard/create-product-services');
  };

  const handleEditListing = (itemId: string) => {
    router.push(`/dashboard/edit-product-service/${itemId}`);
  };

  const handleViewAnalytics = (itemId: string) => {
    router.push(`/dashboard/analytics/product-service/${itemId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'paused':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'product' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  };

  const showFilterSidebar = activeTab === 'all-items' || activeTab === 'products' || activeTab === 'services' || activeTab === 'active';

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminHeader
          title="Products & Services Management"
          description="Manage your product listings, services, and track sales performance."
          createButtonText="Create Listing"
          onCreateClick={handleCreateListing}
          createButtonIcon={<Plus className="w-4 h-4" />}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isDashboardDarkMode={isDashboardDarkMode}
        />

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
                  <Package className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>My Listings</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.myListings}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
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
                      ${(adminStats.totalRevenue / 1000).toFixed(1)}K
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
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Price</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${Math.round(adminStats.averagePrice)}
                    </p>
                  </div>
                  <Star className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversion</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.conversionRate.toFixed(1)}%
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
          <TabsList className={`grid w-full max-w-3xl grid-cols-5 ${isDashboardDarkMode ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="all-items">All Items</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area with Filter Sidebar */}
      <div className="flex h-full">
        {/* Filter Sidebar - disabled during migration */}
        {showFilterSidebar && (
          <div className="w-80 bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Filters temporarily disabled</p>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide ${!showFilterSidebar ? 'w-full' : ''}`}>
          {/* Search Section */}
          <div className={`${isDashboardDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 sm:p-6 mb-6 lg:mb-8`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products, services, or providers..."
                value={filters.searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({...filters, searchTerm: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${items.length} results found`}
              </span>
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className={`text-center py-12 ${isDashboardDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-title text-lg mb-2">No products or services found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'my-listings' 
                    ? "You haven't created any listings yet."
                    : "No listings match your current filters."
                  }
                </p>
                <Button onClick={handleCreateListing}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative ${
                      isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''
                    }`}
                  >
                    {/* Admin Action Menu */}
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditListing(item.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Listing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewAnalytics(item.id)}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="relative overflow-hidden">
                      <ImageWithFallback
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className={getTypeColor(item.type)}>
                          {item.type === 'product' ? <Package className="h-3 w-3 mr-1" /> : <Wrench className="h-3 w-3 mr-1" />}
                          {item.type}
                        </Badge>
                        {item.status && (
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-title text-lg line-clamp-2">{item.title}</h3>
                        
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.vendorAvatar} alt={item.vendor} />
                            <AvatarFallback>{item.vendor.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{item.vendor}</span>
                          {item.isOwner && (
                            <Badge variant="outline" className="text-xs">
                              Owner
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{item.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{item.totalReviews} reviews</span>
                          {item.location && (
                            <>
                              <span>•</span>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {item.location}
                              </div>
                            </>
                          )}
                        </div>

                        {item.deliveryTime && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.deliveryTime}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xl font-bold">
                            ${item.price}
                            <span className="text-sm text-muted-foreground ml-1">{item.currency}</span>
                          </div>
                          {item.isOwner && (
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Sales</div>
                              <div className="font-semibold">{item.sales || 0}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

