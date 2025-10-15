// This file has been removed as it's not used in the application.
// Exploration functionality is integrated into individual marketplace pages.

interface Artwork {
  id: string;
  title: string;
  artist_name: string;
  artist_id: string;
  thumbnail_url: string;
  media_type: 'image' | 'video' | 'audio' | 'mixed';
  price?: number;
  currency: string;
  tags: string[];
  likes_count: number;
  views_count: number;
  created_at: string;
  is_liked?: boolean;
}

const MEDIA_TYPES = [
  { value: 'image', label: 'Images', icon: Grid },
  { value: 'video', label: 'Videos', icon: Play },
  { value: 'audio', label: 'Audio', icon: Volume2 },
  { value: 'mixed', label: 'Mixed Media', icon: Eye }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' }
];

const PRICE_RANGES = [
  { value: 'free', label: 'Free', min: 0, max: 0 },
  { value: 'under_100', label: 'Under $100', min: 0, max: 100 },
  { value: '100_500', label: '$100 - $500', min: 100, max: 500 },
  { value: '500_1000', label: '$500 - $1000', min: 500, max: 1000 },
  { value: 'over_1000', label: 'Over $1000', min: 1000, max: null }
];

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const supabase = useSupabase();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showForSaleOnly, setShowForSaleOnly] = useState(false);

  useEffect(() => {
    fetchArtworks();
  }, [searchQuery, selectedMediaTypes, selectedPriceRanges, sortBy, showForSaleOnly]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockArtworks: Artwork[] = [
        {
          id: '1',
          title: 'Digital Landscape #1',
          artist_name: 'Sarah Chen',
          artist_id: 'artist_1',
          thumbnail_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
          media_type: 'image',
          price: 299,
          currency: 'USD',
          tags: ['digital', 'landscape', 'nature'],
          likes_count: 45,
          views_count: 1200,
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          title: 'Urban Symphony',
          artist_name: 'Marcus Rivera',
          artist_id: 'artist_2',
          thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          media_type: 'video',
          price: 450,
          currency: 'USD',
          tags: ['urban', 'city', 'timelapse'],
          likes_count: 78,
          views_count: 890,
          created_at: '2024-01-14T00:00:00Z'
        },
        {
          id: '3',
          title: 'Ambient Waves',
          artist_name: 'Emma Thompson',
          artist_id: 'artist_3',
          thumbnail_url: 'https://images.unsplash.com/photo-1534759926787-89fa332a58e4?w=400',
          media_type: 'audio',
          price: 199,
          currency: 'USD',
          tags: ['ambient', 'relaxing', 'nature'],
          likes_count: 32,
          views_count: 567,
          created_at: '2024-01-13T00:00:00Z'
        },
        {
          id: '4',
          title: 'Abstract Emotions',
          artist_name: 'David Kim',
          artist_id: 'artist_4',
          thumbnail_url: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400',
          media_type: 'image',
          price: 350,
          currency: 'USD',
          tags: ['abstract', 'colorful', 'emotion'],
          likes_count: 56,
          views_count: 923,
          created_at: '2024-01-12T00:00:00Z'
        },
        {
          id: '5',
          title: 'Street Photography Collection',
          artist_name: 'Lisa Anderson',
          artist_id: 'artist_5',
          thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
          media_type: 'image',
          currency: 'USD',
          tags: ['photography', 'street', 'black-white'],
          likes_count: 89,
          views_count: 1456,
          created_at: '2024-01-11T00:00:00Z'
        },
        {
          id: '6',
          title: 'Interactive Installation',
          artist_name: 'Alex Chen',
          artist_id: 'artist_6',
          thumbnail_url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
          media_type: 'mixed',
          price: 1200,
          currency: 'USD',
          tags: ['installation', 'interactive', 'technology'],
          likes_count: 123,
          views_count: 2345,
          created_at: '2024-01-10T00:00:00Z'
        }
      ];

      // Apply filters
      let filtered = mockArtworks;

      if (searchQuery) {
        filtered = filtered.filter(artwork =>
          artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artwork.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artwork.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (selectedMediaTypes.length > 0) {
        filtered = filtered.filter(artwork => selectedMediaTypes.includes(artwork.media_type));
      }

      if (showForSaleOnly) {
        filtered = filtered.filter(artwork => artwork.price !== undefined);
      }

      if (selectedPriceRanges.length > 0) {
        filtered = filtered.filter(artwork => {
          if (!artwork.price) return selectedPriceRanges.includes('free');
          
          return selectedPriceRanges.some(range => {
            const priceRange = PRICE_RANGES.find(pr => pr.value === range);
            if (!priceRange) return false;
            
            if (priceRange.max === null) return artwork.price >= priceRange.min;
            if (priceRange.max === 0) return artwork.price === 0;
            return artwork.price >= priceRange.min && artwork.price <= priceRange.max;
          });
        });
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'price_low':
            return (a.price || 0) - (b.price || 0);
          case 'price_high':
            return (b.price || 0) - (a.price || 0);
          case 'popular':
            return b.likes_count - a.likes_count;
          case 'trending':
            return b.views_count - a.views_count;
          default:
            return 0;
        }
      });

      setArtworks(filtered);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMediaType = (mediaType: string) => {
    setSelectedMediaTypes(prev =>
      prev.includes(mediaType)
        ? prev.filter(type => type !== mediaType)
        : [...prev, mediaType]
    );
  };

  const togglePriceRange = (priceRange: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(priceRange)
        ? prev.filter(range => range !== priceRange)
        : [...prev, priceRange]
    );
  };

  const handleLike = async (artworkId: string) => {
    if (!user) return;
    
    // In a real app, this would make an API call to toggle like
    setArtworks(prev => prev.map(artwork => 
      artwork.id === artworkId 
        ? { 
            ...artwork, 
            is_liked: !artwork.is_liked,
            likes_count: artwork.is_liked ? artwork.likes_count - 1 : artwork.likes_count + 1
          }
        : artwork
    ));
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Media Type</h3>
        <div className="space-y-2">
          {MEDIA_TYPES.map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={type.value}
                checked={selectedMediaTypes.includes(type.value)}
                onCheckedChange={() => toggleMediaType(type.value)}
              />
              <Label htmlFor={type.value} className="flex items-center space-x-2">
                <type.icon className="w-4 h-4" />
                <span>{type.label}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map(range => (
            <div key={range.value} className="flex items-center space-x-2">
              <Checkbox
                id={range.value}
                checked={selectedPriceRanges.includes(range.value)}
                onCheckedChange={() => togglePriceRange(range.value)}
              />
              <Label htmlFor={range.value}>{range.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="forSaleOnly"
          checked={showForSaleOnly}
          onCheckedChange={setShowForSaleOnly}
        />
        <Label htmlFor="forSaleOnly">For sale only</Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Artworks</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search artworks, artists, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="mb-4">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-64 bg-gray-200 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} found
                  </p>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artworks.map((artwork) => (
                      <Card key={artwork.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                        <div className="relative h-64 overflow-hidden">
                          <ImageWithFallback
                            src={artwork.thumbnail_url}
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {artwork.media_type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 rounded-full p-3">
                                <Play className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                          {artwork.media_type === 'audio' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 rounded-full p-3">
                                <Volume2 className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                          <Badge className="absolute top-3 right-3 capitalize">
                            {artwork.media_type}
                          </Badge>
                          {user && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`absolute top-3 left-3 p-2 ${artwork.is_liked ? 'text-red-500' : 'text-white'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(artwork.id);
                              }}
                            >
                              <Heart className={`w-4 h-4 ${artwork.is_liked ? 'fill-current' : ''}`} />
                            </Button>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{artwork.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">by {artwork.artist_name}</p>
                          <div className="flex justify-between items-center mb-2">
                            {artwork.price ? (
                              <span className="font-semibold text-purple-600">
                                ${artwork.price}
                              </span>
                            ) : (
                              <span className="text-green-600 font-medium">Free</span>
                            )}
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {artwork.likes_count}
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {artwork.views_count}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {artwork.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {artworks.map((artwork) => (
                      <Card key={artwork.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <ImageWithFallback
                                src={artwork.thumbnail_url}
                                alt={artwork.title}
                                className="w-full h-full object-cover rounded"
                              />
                              {artwork.media_type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{artwork.title}</h3>
                                  <p className="text-sm text-gray-600">by {artwork.artist_name}</p>
                                </div>
                                <div className="text-right">
                                  {artwork.price ? (
                                    <span className="font-semibold text-purple-600">
                                      ${artwork.price}
                                    </span>
                                  ) : (
                                    <span className="text-green-600 font-medium">Free</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex flex-wrap gap-1">
                                  {artwork.tags.slice(0, 4).map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {artwork.likes_count}
                                  </span>
                                  <span className="flex items-center">
                                    <Eye className="w-3 h-3 mr-1" />
                                    {artwork.views_count}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {artworks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

