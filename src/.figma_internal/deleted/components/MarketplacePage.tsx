// This file has been removed as it's not used in the application.
// AssetMarketplacePage.tsx is used instead for marketplace functionality.

interface Artwork {
  id: string;
  title: string;
  artist_name: string;
  artist_id: string;
  price: number;
  image_url: string;
  media_type: string;
  category: string;
  is_for_sale: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
}

interface MarketplacePageProps {
  onAddToCart: (artworkId: string) => void;
  cartItemCount: number;
}

export default function MarketplacePage({ onAddToCart, cartItemCount }: MarketplacePageProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMarketplaceItems();
  }, [searchQuery, selectedCategory, selectedMediaType, sortBy]);

  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        for_sale: 'true',
        q: searchQuery,
        sort: sortBy,
        limit: '50'
      });

      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedMediaType && selectedMediaType !== 'all') params.append('media_type', selectedMediaType);

      console.log('Fetching artworks from:', `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/artworks?${params}`);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/artworks?${params}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      let filteredArtworks = data.artworks || [];

      // Apply price filter
      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        filteredArtworks = filteredArtworks.filter(artwork => {
          if (max) {
            return artwork.price >= min && artwork.price <= max;
          }
          return artwork.price >= min;
        });
      }

      setArtworks(filteredArtworks);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      // Set empty array on error to show empty state
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (artwork: Artwork) => {
    onAddToCart(artwork.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const categories = [
    'Digital Art', 'Photography', 'Painting', 'Sculpture', 'Mixed Media',
    'NFT', 'Illustration', 'Abstract', 'Portrait', 'Landscape'
  ];

  const mediaTypes = [
    'image', 'video', 'audio', '3d_model', 'animation'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600 mt-2">Discover and purchase unique artworks from talented artists</p>
          </div>
          <div className="flex items-center gap-4">
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
            <Button className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {mediaTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1000</SelectItem>
                  <SelectItem value="1000">$1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-600">
          {loading ? 'Loading...' : `${artworks.length} items found`}
        </div>

        {/* Artwork Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" :
            "space-y-4"
          }>
            {artworks.map((artwork) => (
              <Card key={artwork.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}>
                <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}>
                  <ImageWithFallback
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-4`}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {artwork.artist_name}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {artwork.media_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {artwork.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {artwork.views_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {artwork.likes_count}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        {formatPrice(artwork.price)}
                      </span>
                      <Button 
                        onClick={() => handleAddToCart(artwork)}
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && artworks.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No artworks found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}

