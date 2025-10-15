// This file has been removed as it's not used in the application.
// ProfilePageFixed.tsx is used instead for profile functionality.

interface ServiceModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description?: string;
  portfolio?: any[];
}

export const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  const isOwnProfile = targetUserId === user?.id;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [listings, setListings] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('access_token') || publicAnonKey;
        
        // First try to get the profile from the backend
        console.log('Fetching profile for user:', targetUserId);
        console.log('Current user:', user?.id);
        console.log('Is own profile:', isOwnProfile);
        
        let response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/profiles/${targetUserId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        console.log('Profile response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Profile data received:', data);
          setProfileData(data.profile);
          setListings(data.listings);
          setReviews(data.reviews);
        } else if (response.status === 404) {
          // Profile not found - try to find user data from artworks/listings
          console.log('Profile not found (404), checking for user in artworks...');
          const errorText = await response.text();
          console.log('404 response text:', errorText);
          
          // Fetch artworks to see if we can find user info
          const artworksResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/artworks`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          let foundUserInfo = null;
          let artworksData = null;
          if (artworksResponse.ok) {
            artworksData = await artworksResponse.json();
            const userArtwork = artworksData.artworks?.find(
              (artwork: any) => artwork.artist_id === targetUserId
            );
            
            if (userArtwork) {
              foundUserInfo = {
                id: userArtwork.artist_id,
                username: userArtwork.artist_name?.toLowerCase().replace(/\s+/g, '') || 'user',
                full_name: userArtwork.artist_name || 'Unknown User',
                bio: '',
                avatar_url: '',
                website: '',
                location: '',
                phone: '',
                email: '',
                followers_count: 0,
                following_count: 0,
                is_verified: false,
                joined_date: new Date().toISOString().split('T')[0],
                overall_rating: 0,
                total_reviews: 0,
                total_listings: artworksData.artworks?.filter((a: any) => a.artist_id === targetUserId).length || 0,
                response_rate: 100,
                response_time: '< 2 hours'
              };
            }
          }

          // If it's the current user's own profile and no data found, create default
          if (isOwnProfile && user && !foundUserInfo) {
            foundUserInfo = {
              id: user.id,
              username: user.email?.split('@')[0] || 'user',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              bio: '',
              avatar_url: user.user_metadata?.avatar_url || '',
              website: '',
              location: '',
              phone: '',
              email: user.email || '',
              followers_count: 0,
              following_count: 0,
              is_verified: false,
              joined_date: new Date().toISOString().split('T')[0],
              overall_rating: 0,
              total_reviews: 0,
              total_listings: 0,
              response_rate: 100,
              response_time: '< 2 hours'
            };
          }

          if (foundUserInfo) {
            setProfileData(foundUserInfo);
            // Set empty listings for now - could be enhanced to fetch actual user listings
            setListings({
              artworks: artworksResponse.ok && artworksData.artworks ? 
                artworksData.artworks.filter((artwork: any) => artwork.artist_id === targetUserId) : [],
              talents: [],
              studios: [],
              events: [],
              investments: [],
              legalServices: []
            });
            setReviews([]);
          } else {
            // User not found anywhere
            setProfileData(null);
          }
        } else {
          const errorText = await response.text();
          console.error('Error response:', response.status, errorText);
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [targetUserId, isOwnProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-title text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate service modules based on profile type and actual listings
  const generateServiceModules = () => {
    if (!listings || !profileData) return [];

    const profileType = profileData.profile_type || 'Artist';
    let modules = [];

    // Show different services based on profile type
    switch (profileType) {
      case 'Artist':
        modules = [
          {
            id: 'artworks',
            name: 'Asset Marketplace',
            icon: <Grid className="h-4 w-4" />,
            enabled: listings.artworks?.length > 0,
            description: 'Digital assets, artwork, and design resources',
            portfolio: listings.artworks?.map((artwork: any) => ({
              id: artwork.id,
              title: artwork.title,
              image: artwork.image_url,
              price: artwork.price
            })) || []
          },
          {
            id: 'talents',
            name: 'Custom Commissions',
            icon: <Palette className="h-4 w-4" />,
            enabled: listings.talents?.length > 0,
            description: 'Custom artwork and design services',
            portfolio: listings.talents?.map((talent: any) => ({
              id: talent.id,
              title: talent.profession || talent.name,
              image: talent.image_url || talent.portfolio_images?.[0],
              hourlyRate: talent.hourlyRate
            })) || []
          }
        ];
        break;

      case 'Venue':
        modules = [
          {
            id: 'studios',
            name: 'Studio Rental',
            icon: <Building className="h-4 w-4" />,
            enabled: listings.studios?.length > 0,
            description: 'Professional studio spaces for rent',
            portfolio: listings.studios?.map((studio: any) => ({
              id: studio.id,
              title: studio.name,
              image: studio.images?.[0] || studio.image_url,
              hourlyRate: studio.hourly_rate
            })) || []
          },
          {
            id: 'events',
            name: 'Events & Workshops',
            icon: <Calendar className="h-4 w-4" />,
            enabled: listings.events?.length > 0,
            description: 'Hosted workshops, events, and experiences',
            portfolio: listings.events?.map((event: any) => ({
              id: event.id,
              title: event.title,
              image: event.image_url,
              date: event.date,
              price: event.price
            })) || []
          }
        ];
        break;

      case 'Investor':
        modules = [
          {
            id: 'investments',
            name: 'Investment Opportunities',
            icon: <DollarSign className="h-4 w-4" />,
            enabled: listings.investments?.length > 0,
            description: 'Investment and funding opportunities',
            portfolio: listings.investments?.map((investment: any) => ({
              id: investment.id,
              title: investment.title,
              image: investment.image_url,
              amount: investment.target_amount
            })) || []
          }
        ];
        break;

      case 'Legal':
        modules = [
          {
            id: 'legalServices',
            name: 'Legal Services',
            icon: <Briefcase className="h-4 w-4" />,
            enabled: listings.legalServices?.length > 0,
            description: 'Legal consultation and services',
            portfolio: listings.legalServices?.map((service: any) => ({
              id: service.id,
              title: service.service_type,
              description: service.description,
              hourlyRate: service.hourly_rate
            })) || []
          }
        ];
        break;

      default:
        // Show all for backward compatibility
        modules = [
          {
            id: 'artworks',
            name: 'Asset Marketplace',
            icon: <Grid className="h-4 w-4" />,
            enabled: listings.artworks?.length > 0,
            description: 'Digital assets, artwork, and design resources',
            portfolio: listings.artworks?.map((artwork: any) => ({
              id: artwork.id,
              title: artwork.title,
              image: artwork.image_url,
              price: artwork.price
            })) || []
          }
        ];
    }

    return modules;
  };

  const serviceModules = generateServiceModules();
  const enabledServices = serviceModules.filter(service => service.enabled);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Column - Avatar and Basic Info */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                  <AvatarFallback className="text-3xl">
                    {profileData.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Service Badges */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Active Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {enabledServices.length > 0 ? enabledServices.map((service) => (
                      <Badge key={service.id} variant="secondary" className="text-xs">
                        <span className="mr-1">{service.icon}</span>
                        {service.name.split(' ')[0]}
                      </Badge>
                    )) : (
                      <Badge variant="outline" className="text-xs">No services yet</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Center Column - Profile Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-title text-gray-900 flex items-center gap-3 mb-2">
                      {profileData.full_name}
                      {profileData.is_verified && (
                        <Badge variant="default" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </h1>
                    <p className="text-gray-600 mb-2">@{profileData.username}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {profileData.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profileData.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {profileData.overall_rating.toFixed(1)} ({profileData.total_reviews} reviews)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <Link href="/profile-settings">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button size="sm">
                          <User className="w-4 h-4 mr-2" />
                          Follow
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{profileData.bio || 'No bio available yet.'}</p>
                
                {/* Profile Type Specific Info */}
                {profileData.profile_type && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 font-title">{profileData.profile_type} Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {profileData.profile_type === 'Artist' && profileData.specialties?.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">Specialties:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profileData.specialties.map((specialty: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">{specialty}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {profileData.profile_type === 'Venue' && (
                        <>
                          {profileData.venue_capacity && (
                            <div>
                              <span className="font-medium text-gray-700">Capacity:</span>
                              <span className="ml-2">{profileData.venue_capacity} people</span>
                            </div>
                          )}
                          {profileData.venue_amenities?.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">Amenities:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profileData.venue_amenities.map((amenity: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {profileData.profile_type === 'Investor' && (
                        <>
                          {profileData.investment_range && (
                            <div>
                              <span className="font-medium text-gray-700">Investment Range:</span>
                              <span className="ml-2">
                                ${profileData.investment_range.min?.toLocaleString()} - ${profileData.investment_range.max?.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {profileData.investment_focus?.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">Focus Areas:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profileData.investment_focus.map((focus: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">{focus}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {profileData.profile_type === 'Legal' && (
                        <>
                          {profileData.legal_specialization?.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">Specialization:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profileData.legal_specialization.map((spec: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">{spec}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {profileData.bar_admission?.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">Bar Admission:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {profileData.bar_admission.map((bar: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">{bar}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{profileData.response_rate}%</div>
                    <div className="text-gray-600">Response Rate</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{profileData.response_time}</div>
                    <div className="text-gray-600">Response Time</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{profileData.followers_count.toLocaleString()}</div>
                    <div className="text-gray-600">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{profileData.total_listings || 0}</div>
                    <div className="text-gray-600">Total Listings</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Services Summary */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {enabledServices.length > 0 ? (
                      <div className="space-y-4">
                        {enabledServices.map((service) => (
                          <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                              {service.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-gray-600">{service.description}</p>
                              <div className="mt-2 text-sm text-gray-500">
                                {service.portfolio?.length || 0} items available
                              </div>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No active services yet</p>
                        {isOwnProfile && (
                          <p className="text-sm mt-2">Start by uploading content or creating listings</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact & Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profileData.email && !isOwnProfile && (
                      <div className="text-sm">
                        <span className="font-medium">Email:</span>
                        <br />
                        <a href={`mailto:${profileData.email}`} className="text-blue-600 hover:underline">
                          {profileData.email}
                        </a>
                      </div>
                    )}
                    {profileData.phone && !isOwnProfile && (
                      <div className="text-sm">
                        <span className="font-medium">Phone:</span>
                        <br />
                        <a href={`tel:${profileData.phone}`} className="text-blue-600 hover:underline">
                          {profileData.phone}
                        </a>
                      </div>
                    )}
                    {profileData.website && (
                      <div className="text-sm">
                        <span className="font-medium">Website:</span>
                        <br />
                        <a 
                          href={profileData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {profileData.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {(!profileData.email && !profileData.phone && !profileData.website) && (
                      <div className="text-sm text-gray-500">
                        No contact information available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {!isOwnProfile && enabledServices.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full">Send Message</Button>
                      <Button variant="outline" className="w-full">Book Service</Button>
                      <Button variant="outline" className="w-full">Request Quote</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="mt-6">
            {enabledServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceModules.map((service) => (
                  <Card key={service.id} className={service.enabled ? '' : 'opacity-50'}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {service.icon}
                        {service.name}
                        {service.enabled && <Badge variant="default" className="text-xs">Active</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                      
                      {service.enabled ? (
                        <>
                          <div className="text-sm text-gray-500 mb-4">
                            {service.portfolio?.length || 0} items available
                          </div>
                          <Button size="sm" className="w-full">
                            {service.id === 'artworks' ? 'Browse Assets' :
                             service.id === 'talents' ? 'Book Service' : 
                             service.id === 'studios' ? 'Book Studio' :
                             service.id === 'events' ? 'View Events' : 'Learn More'}
                          </Button>
                        </>
                      ) : (
                        <Badge variant="secondary">Not Available</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Services Available</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "Start offering services by uploading content or creating listings in our marketplace"
                    : "This user hasn't set up any services yet"
                  }
                </p>
              </div>
            )}
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-6">
            {enabledServices.some(service => service.portfolio && service.portfolio.length > 0) ? (
              <div className="space-y-8">
                {enabledServices.filter(service => service.portfolio && service.portfolio.length > 0).map((service) => (
                  <div key={service.id}>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      {service.icon}
                      {service.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {service.portfolio?.map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                          <div className="relative h-48 overflow-hidden">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                            <div className="flex justify-between items-center text-sm">
                              {item.price && (
                                <span className="font-semibold text-green-600">${item.price}</span>
                              )}
                              {item.hourlyRate && (
                                <span className="font-semibold text-green-600">${item.hourlyRate}/hr</span>
                              )}
                              {item.date && (
                                <span className="text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Items</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "Start building your portfolio by uploading your work"
                    : "This user hasn't uploaded any portfolio items yet"
                  }
                </p>
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Review Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{profileData.overall_rating.toFixed(1)}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(profileData.overall_rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{profileData.total_reviews} total reviews</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-2">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.reviewer_avatar || review.user_avatar} />
                            <AvatarFallback>
                              {(review.reviewer_name || review.user_name)?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{review.reviewer_name || review.user_name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  {review.service_type && (
                                    <Badge variant="outline" className="text-xs">
                                      {review.service_type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at || review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile 
                      ? "Start providing services to receive your first review"
                      : "This user hasn't received any reviews yet"
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

