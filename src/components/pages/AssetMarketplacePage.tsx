import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid, List, ShoppingCart, Plus, Check, X } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { FilterSidebar, FilterConfig, FilterState } from '../shared/FilterSidebar';
import { AssetSearchFilters } from '../shared/AssetSearchFilters';
import { UserProfileLink } from '../shared/UserProfileLink';
import { useAuth } from '@/components/providers/AuthProvider';
import { formatPriceINR } from '@/utils/currency';

interface Asset {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  artist: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
}

interface AssetMarketplacePageProps {
  onAddToCart?: (artworkId: string) => void;
  onRemoveFromCart?: (artworkId: string) => void;
  cartItemCount?: number;
  isDashboardDarkMode?: boolean;
}

export const AssetMarketplacePage: React.FC<AssetMarketplacePageProps> = ({
  onAddToCart,
  onRemoveFromCart,
  cartItemCount = 0,
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

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
        name: 'mediaType',
        type: 'select',
        options: [
          { value: 'image', label: 'Image' },
          { value: 'video', label: 'Video' },
          { value: 'audio', label: 'Audio' },
          { value: '3d_model', label: '3D Model' },
          { value: 'document', label: 'Document' }
        ]
      }
    ],
    moduleType: 'assets'
  };

  useEffect(() => {
    loadAssets();
  }, [filters]);

  // Fetch cart items on mount and when cart count changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user?.id || !onAddToCart) return;
      
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch(
          `http://localhost:5001/api/cart/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const cartItemIds = new Set(
            (data.cart?.items || []).map((item: any) => item.artwork_id?.toString())
          );
          setCartItems(cartItemIds);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [user?.id, onAddToCart, cartItemCount]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      // Build query parameters from filters
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        filters.category.forEach(cat => params.append('category', cat));
      }
      if (filters.location && filters.location !== 'all') {
        params.append('location', filters.location);
      }
      if (filters.priceRange) {
        params.append('min_price', filters.priceRange[0].toString());
        params.append('max_price', filters.priceRange[1].toString());
      }
      if (filters.sortBy) params.append('sort', filters.sortBy);
      params.append('status', 'active');
      params.append('limit', '50');
      
      const response = await fetch(`http://localhost:5001/api/assets?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        // Transform API data to match Asset interface
        const transformedAssets: Asset[] = data.map((asset: any) => ({
          id: asset.id.toString(),
          title: asset.title || 'Untitled Asset',
          description: asset.description || '',
          price: parseFloat(asset.price) || 0,
          category: asset.category || 'Digital Art',
          imageUrl: asset.preview_images?.[0] || asset.avatar_url || '',
          artist: {
            id: asset.user_id?.toString() || '',
            name: asset.display_name || asset.username || 'Unknown Artist',
            avatar: asset.avatar_url || ''
          },
          tags: asset.tags || []
        }));
        setAssets(transformedAssets);
      } else {
        console.error('Failed to fetch assets');
        setAssets([]);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (assetId: string) => {
    if (!onAddToCart) return;
    
    setAddingToCart(assetId);
    try {
      await onAddToCart(assetId);
      // Mark item as added to cart immediately
      setCartItems(prev => new Set(prev).add(assetId));
      
      // Also refresh cart items from server to ensure sync
      if (user?.id) {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await fetch(
            `http://localhost:5001/api/cart/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            const cartItemIds = new Set(
              (data.cart?.items || []).map((item: any) => item.artwork_id?.toString())
            );
            setCartItems(cartItemIds);
          }
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      // Reset adding state after a short delay to show feedback
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    }
  };

  const handleRemoveFromCart = async (assetId: string) => {
    if (!onRemoveFromCart) return;
    
    setAddingToCart(assetId);
    try {
      await onRemoveFromCart(assetId);
      // Remove item from cart immediately
      setCartItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(assetId);
        return newSet;
      });
      
      // Also refresh cart items from server to ensure sync
      if (user?.id) {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await fetch(
            `http://localhost:5001/api/cart/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            const cartItemIds = new Set(
              (data.cart?.items || []).map((item: any) => item.artwork_id?.toString())
            );
            setCartItems(cartItemIds);
          }
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      // Reset adding state after a short delay to show feedback
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    }
  };

  const handleCartToggle = async (assetId: string) => {
    if (cartItems.has(assetId)) {
      // Item is in cart, remove it
      await handleRemoveFromCart(assetId);
    } else {
      // Item is not in cart, add it
      await handleAddToCart(assetId);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !filters.searchTerm || (
      asset.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm?.toLowerCase() || ''))
    );
    
    // Main category matching - now handles arrays
    const matchesMainCategory = !Array.isArray(filters.category) || filters.category.length === 0 || 
      filters.category.some(category => asset.category.toLowerCase().includes(category.toLowerCase()));
    
    // Subcategory matching - now handles arrays
    const matchesSubcategory = !Array.isArray(filters.subcategory) || filters.subcategory.length === 0 ||
      filters.subcategory.some(subcategory => asset.tags.some(tag => tag.toLowerCase().includes(subcategory.toLowerCase())));
    
    const matchesPrice = asset.price >= filters.priceRange[0] && asset.price <= filters.priceRange[1];
    
    return matchesSearch && matchesMainCategory && matchesSubcategory && matchesPrice;
  });

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
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
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex-1">
              <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Asset Marketplace</h1>
              <p className="text-muted-foreground">
                Buy and sell digital assets, artworks, and creative resources from talented creators worldwide.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Button onClick={() => router.push('/dashboard/create-asset')} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                List Asset
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              {onAddToCart && (
                <Button className="relative w-full sm:w-auto bg-[#FF8D28] hover:bg-[#FF8D28]/90" onClick={() => router.push('/dashboard/cart')}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>

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
                <Card key={asset.id} className={`overflow-hidden hover:shadow-lg transition-shadow flex flex-col ${
                  viewMode === 'list' ? 'flex-row' : ''
                }`}>
                  <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full'} aspect-square overflow-hidden bg-gray-100`}>
                    <ImageWithFallback
                      src={asset.imageUrl || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : 'flex-1 flex flex-col'} p-4`}>
                    <div className="flex-1 flex flex-col">
                      <h3 className={`font-semibold mb-1 line-clamp-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`} title={asset.title}>
                        {asset.title}
                      </h3>
                      <p className={`text-sm mb-2 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        by <UserProfileLink 
                         userId={asset.artist.id}
                         userName={asset.artist.name}
                         prefix=""
                       />
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {asset.category}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 min-h-[24px] mb-3">
                        {asset.tags && asset.tags.length > 0 ? (
                          asset.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <div className="h-0"></div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t mt-auto">
                      <span className={`text-lg font-title text-[#FF8D28] ${isDashboardDarkMode ? 'text-[#FF8D28]' : ''}`}>
                        {formatPriceINR(asset.price, true)}
                      </span>
                      {(onAddToCart || onRemoveFromCart) && (
                        <Button 
                          size="sm" 
                          disabled={addingToCart === asset.id}
                          className={
                            cartItems.has(asset.id)
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                          }
                          onClick={() => handleCartToggle(asset.id)}
                        >
                          {cartItems.has(asset.id) ? (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              {addingToCart === asset.id ? 'Removing...' : 'Remove from Cart'}
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {addingToCart === asset.id ? 'Adding...' : 'Add to Cart'}
                            </>
                          )}
                        </Button>
                      )}
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
        </div>
      </div>
    </div>
  );
};

