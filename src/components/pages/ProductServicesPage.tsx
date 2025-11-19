import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Briefcase, Clock, Calendar, User, Plus, Heart, Eye, Package, Wrench, Code, Palette, Camera, ShoppingBag, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { FavoritesButton } from '../shared/FavoritesButton';
import { RatingSystem } from '../shared/RatingSystem';
import { FilterSidebar, FilterConfig, FilterState } from '../shared/FilterSidebar';
import { UserProfileLink } from '../shared/UserProfileLink';
import { useAuth } from '../providers/AuthProvider';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ProductAndServicesListingForm } from '../forms/ProductAndServicesListingForm';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/utils/api';

// Mock data and functions until the data service is restored
const sampleProducts: ProductService[] = [
    {
      id: '1',
      title: 'Professional Logo Design',
      description: 'Custom logo design for your brand with multiple revisions and file formats',
      type: 'service',
      vendor: 'Sarah Chen',
      vendorAvatar: '/api/placeholder/150/150',
      price: 299,
      currency: 'USD',
      rating: 4.9,
      totalReviews: 127,
      images: ['/api/placeholder/400/300'],
      availability: 'Available',
      location: 'New York',
      deliveryTime: '3-5 days',
      userId: '1'
    },
    {
      id: '2',
      title: 'Web Design Template Pack',
      description: 'Premium web design templates for modern businesses',
      type: 'product',
      vendor: 'Design Studio Pro',
      vendorAvatar: '/api/placeholder/150/150',
      price: 99,
      currency: 'USD',
      rating: 4.7,
      totalReviews: 89,
      images: ['/api/placeholder/400/300'],
      availability: 'Available',
      deliveryTime: 'Instant Download',
      userId: '2'
    },
    {
      id: '3',
      title: 'Video Editing Service',
      description: 'Professional video editing for content creators and businesses',
      type: 'service',
      vendor: 'Mike Rodriguez',
      vendorAvatar: '/api/placeholder/150/150',
      price: 199,
      currency: 'USD',
      rating: 4.8,
      totalReviews: 156,
      images: ['/api/placeholder/400/300'],
      availability: 'Available',
      location: 'Los Angeles',
      deliveryTime: '2-3 days',
      userId: '3'
    }
  ];

// We'll fetch directly from API in the component

const productFilterConfig: FilterConfig = {
    categories: [
        { value: 'design', label: 'Design', icon: null },
        { value: 'development', label: 'Development', icon: null },
        { value: 'writing', label: 'Writing', icon: null },
        { value: 'marketing', label: 'Marketing', icon: null },
        { value: 'photography', label: 'Photography', icon: null },
        { value: 'video', label: 'Video', icon: null },
    ],
    locations: [
        { value: 'all', label: 'All Locations' },
        { value: 'new-york', label: 'New York' },
        { value: 'los-angeles', label: 'Los Angeles' },
        { value: 'chicago', label: 'Chicago' },
        { value: 'remote', label: 'Remote' },
    ],
    priceRange: { min: 0, max: 1000 },
    availability: true,
    rating: true,
    customFilters: [
        { name: 'deliveryTime', type: 'select', options: [
            { value: 'all', label: 'All' },
            { value: '1-day', label: '1 Day' },
            { value: '3-days', label: '3 Days' },
            { value: '1-week', label: '1 Week' },
        ]}
    ],
    moduleType: 'assets',
};


interface ProductService {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'service';
  vendor: string;
  vendorAvatar?: string;
  userId?: string;
  price: number;
  currency: string;
  rating: number;
  totalReviews: number;
  images: string[];
  availability: string;
  location?: string;
  deliveryTime?: string;
}

interface ProductFilters extends FilterState {
  type: 'all' | 'product' | 'service';
}

interface ProductServicesPageProps {
  isDashboardDarkMode?: boolean;
}

export function ProductServicesPage({ isDashboardDarkMode = false }: ProductServicesPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductService | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 1000],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest',
    type: 'all'
  });

  // Purchase form state
  const [purchaseForm, setPurchaseForm] = useState({
    quantity: 1,
    customizations: '',
    deliveryPreference: 'standard',
    notes: ''
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters from filters
      const params = new URLSearchParams();
      
      // Use search endpoint if there's a search term
      const endpoint = filters.searchTerm 
        ? apiUrl('product-services/search')
        : apiUrl('product-services');
      
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        // Use first category for now (API supports single category)
        params.append('category', filters.category[0]);
      }
      if (filters.location && filters.location !== 'all') {
        params.append('location', filters.location);
      }
      if (filters.type && filters.type !== 'all') {
        // Map type to format: 'product' -> 'physical' or 'digital', 'service' -> 'service'
        const format = filters.type === 'service' ? 'service' : (filters.type === 'product' ? 'digital' : filters.type);
        params.append('format', format);
      }
      if (filters.priceRange) {
        params.append('min_price', filters.priceRange[0].toString());
        params.append('max_price', filters.priceRange[1].toString());
      }
      if (filters.sortBy) params.append('sort', filters.sortBy);
      params.append('status', 'active');
      params.append('limit', '50');

      const response = await fetch(`${endpoint}?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        // Ensure products is always an array
        let productsArray = Array.isArray(data) ? data : (data.products || data.data || []);
        
        // Normalize API data to match ProductService interface
        productsArray = productsArray.map((product: any) => ({
          ...product,
          vendor: product.vendor || product.display_name || product.username || 'Vendor',
          vendorAvatar: product.vendorAvatar || product.avatar_url,
          price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
          rating: product.rating || 0,
          totalReviews: product.totalReviews || product.total_reviews || 0,
          images: product.images || [],
          availability: product.availability || product.status || 'Available',
        }));
        
        // Apply additional client-side filtering for categories, subcategories, etc.
        let filteredProducts = applyClientSideFilters(productsArray, filters);
        
        // Apply sorting
        filteredProducts = applySorting(filteredProducts, filters.sortBy);
        
        setProducts(filteredProducts);
      } else {
        console.error('Failed to fetch products');
        // Fallback to sample data if API fails
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to sample data if API fails
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  // Apply additional client-side filtering
  const applyClientSideFilters = (products: ProductService[], filters: ProductFilters): ProductService[] => {
    return products.filter((product) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          product.title?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.vendor?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter (if not already filtered by API)
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        // Check if product has a category field and matches
        const productCategory = (product as any).category?.toLowerCase();
        if (productCategory) {
          const matchesCategory = filters.category.some(cat => 
            productCategory.includes(cat.toLowerCase())
          );
          if (!matchesCategory) return false;
        }
      }

      // Location filter (already handled by API, but double-check)
      if (filters.location && filters.location !== 'all') {
        if (!product.location?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Price range filter (already handled by API, but double-check)
      if (filters.priceRange) {
        const price = product.price || 0;
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }
      }

      // Availability filter
      if (filters.availability && filters.availability !== 'all') {
        const productAvailability = (product.availability || '').toLowerCase();
        if (productAvailability !== filters.availability.toLowerCase()) {
          return false;
        }
      }

      // Type filter (already handled by API via format)
      if (filters.type && filters.type !== 'all') {
        if (product.type !== filters.type) {
          return false;
        }
      }

      return true;
    });
  };

  // Apply sorting to filtered products
  const applySorting = (products: ProductService[], sortBy: string): ProductService[] => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => {
          const dateA = new Date((a as any).created_at || 0).getTime();
          const dateB = new Date((b as any).created_at || 0).getTime();
          return dateA - dateB;
        });
      case 'price_low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
        return sorted.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
      case 'newest':
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date((a as any).created_at || 0).getTime();
          const dateB = new Date((b as any).created_at || 0).getTime();
          return dateB - dateA;
        });
    }
  };

  const handlePurchaseProduct = (product: ProductService) => {
    if (!user) {
      alert('Please sign in to purchase products');
      return;
    }
    setSelectedProduct(product);
    setShowPurchaseDialog(true);
  };

  const handleSubmitPurchase = async () => {
    if (!selectedProduct || !user) return;

    try {
      // Simulate purchase API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Purchase completed successfully!');
      setShowPurchaseDialog(false);
      setPurchaseForm({
        quantity: 1,
        customizations: '',
        deliveryPreference: 'standard',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting purchase:', error);
      alert('Failed to complete purchase');
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Limited': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Out of Stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'product' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  };

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {/* Filter Sidebar */}
        <FilterSidebar
          config={productFilterConfig}
          filters={filters}
          onFiltersChange={(newFilters) => setFilters(newFilters as ProductFilters)}
          resultCount={products.length}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex-1">
              <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Products & Services</h1>
              <p className="text-muted-foreground">
                Discover creative products, digital assets, and professional services. 
                From templates and tools to custom solutions and courses.
              </p>
            </div>
            {user && (
              <Button onClick={() => setShowCreateListing(true)} className="flex items-center gap-2 w-full lg:w-auto">
                <Plus className="h-4 w-4" />
                List Product/Service
              </Button>
            )}
          </div>

          {/* Search and Quick Filters */}
          <div className={`${isDashboardDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 sm:p-6 mb-6 lg:mb-8 space-y-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              {/* Type Filter */}
              <div className="sm:col-span-1 lg:col-span-2">
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="sm:col-span-1 lg:col-span-2">
                <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {productFilterConfig.locations?.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Input */}
              <div className="sm:col-span-2 lg:col-span-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products, services, or providers..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.searchTerm || filters.type !== 'all' || filters.location !== 'all') && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {filters.searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {filters.searchTerm}
                      <button onClick={() => setFilters({...filters, searchTerm: ''})} className="ml-1 hover:bg-gray-200 rounded">
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.type !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      Type: {filters.type}
                      <button onClick={() => setFilters({...filters, type: 'all'})} className="ml-1 hover:bg-gray-200 rounded">
                        ×
                      </button>
                    </Badge>
                  )}
                  {filters.location !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      Location: {filters.location}
                      <button onClick={() => setFilters({...filters, location: 'all'})} className="ml-1 hover:bg-gray-200 rounded">
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${products.length} results found`}
            </div>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className={`animate-pulse ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className={`text-center py-12 ${isDashboardDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border`}>
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-title text-lg mb-2">No products or services found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              {user && (
                <Button onClick={() => setShowCreateListing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  List Your Product/Service
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className={`group hover:shadow-lg transition-shadow ${isDashboardDarkMode ? 'bg-gray-900 border-gray-700 hover:bg-gray-800' : 'bg-white hover:shadow-xl'}`}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={getTypeColor(product.type)}>
                        {product.type === 'product' ? <Package className="h-3 w-3 mr-1" /> : <Wrench className="h-3 w-3 mr-1" />}
                        {product.type}
                      </Badge>
                      <Badge className={getAvailabilityColor(product.availability)}>
                        {product.availability}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <FavoritesButton entityId={product.id} entityType="asset" />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-title text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {product.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/profile/${product.userId}`) }} className="flex items-center gap-2 cursor-pointer hover:text-orange-600 transition-colors">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={product.vendorAvatar || (product as any).avatar_url} alt={product.vendor || (product as any).display_name || 'Vendor'} />
                          <AvatarFallback>{(product.vendor || (product as any).display_name || (product as any).username || 'V')?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{product.vendor || (product as any).display_name || (product as any).username || 'Vendor'}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.totalReviews} reviews)
                      </span>
                      {product.location && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {product.location}
                          </div>
                        </>
                      )}
                    </div>

                    {product.deliveryTime && (
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        {product.deliveryTime}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold">
                        ${product.price}
                        <span className="text-sm text-muted-foreground ml-1">{product.currency}</span>
                      </div>
                      <Button 
                        onClick={() => handlePurchaseProduct(product)}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {product.type === 'product' ? 'Buy Now' : 'Order Service'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {products.length > 0 && products.length % 9 === 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" onClick={loadProducts}>
                Load More Results
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Listing Dialog */}
      {showCreateListing && (
        <Dialog open={showCreateListing} onOpenChange={setShowCreateListing}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-title">List New Product or Service</DialogTitle>
              <DialogDescription>
                Create a new listing to showcase your products or services to the Artistrial community.
              </DialogDescription>
            </DialogHeader>
            <ProductAndServicesListingForm
              onSuccess={() => {
                setShowCreateListing(false);
                loadProducts();
              }}
              onCancel={() => setShowCreateListing(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Purchase Dialog */}
      {showPurchaseDialog && selectedProduct && (
        <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-title">
                {selectedProduct.type === 'product' ? 'Purchase Product' : 'Order Service'}
              </DialogTitle>
              <DialogDescription>
                {selectedProduct.title} by {selectedProduct.vendor}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <ImageWithFallback
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-title text-lg">{selectedProduct.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{selectedProduct.rating} ({selectedProduct.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={purchaseForm.quantity}
                    onChange={(e) => setPurchaseForm({...purchaseForm, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery">Delivery Preference</Label>
                  <Select value={purchaseForm.deliveryPreference} onValueChange={(value) => setPurchaseForm({...purchaseForm, deliveryPreference: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Delivery</SelectItem>
                      <SelectItem value="express">Express Delivery</SelectItem>
                      <SelectItem value="pickup">Pickup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="customizations">Special Requests / Customizations</Label>
                <Textarea
                  id="customizations"
                  placeholder="Any special requirements or customizations..."
                  value={purchaseForm.customizations}
                  onChange={(e) => setPurchaseForm({...purchaseForm, customizations: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  value={purchaseForm.notes}
                  onChange={(e) => setPurchaseForm({...purchaseForm, notes: e.target.value})}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg">
                  <span>Total:</span>
                  <span className="font-bold">
                    ${(selectedProduct.price * purchaseForm.quantity).toFixed(2)} {selectedProduct.currency}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitPurchase} className="bg-orange-600 hover:bg-orange-700 text-white">
                  {selectedProduct.type === 'product' ? 'Complete Purchase' : 'Place Order'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

