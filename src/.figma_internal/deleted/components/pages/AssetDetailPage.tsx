import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  ArrowLeft, 
  Star, 
  MessageSquare, 
  Share2, 
  Heart, 
  DollarSign,
  Download,
  Eye,
  ShoppingCart,
  Tag,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Calendar,
  User,
  CheckCircle,
  Shield
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';

export interface Asset {
  id: string;
  title: string;
  type: 'Image' | 'Video' | 'Audio' | 'Document' | '3D Model' | 'Template' | 'Font';
  category: string;
  price: number;
  license: 'Standard' | 'Extended' | 'Exclusive' | 'Royalty-Free';
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  images: string[];
  previewUrl?: string;
  fileSize: string;
  fileFormat: string;
  dimensions?: string;
  duration?: string;
  downloads: number;
  rating: number;
  totalReviews: number;
  tags: string[];
  createdAt: string;
  isExclusive: boolean;
  commercialUse: boolean;
}

interface AssetDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
}

export const AssetDetailPage: React.FC<AssetDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    loadAssetDetails();
  }, [id]);

  const loadAssetDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleAsset: Asset = {
        id: id || 'asset1',
        title: 'Abstract Digital Art Collection',
        type: 'Image',
        category: 'Digital Art',
        price: 29.99,
        license: 'Extended',
        creator: {
          id: 'creator1',
          name: 'Elena Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          verified: true
        },
        description: 'A stunning collection of abstract digital artworks featuring vibrant colors and geometric patterns. Perfect for modern design projects, presentations, web design, and creative campaigns. Each piece is carefully crafted with attention to composition and color harmony.',
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&h=600&fit=crop'
        ],
        previewUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=900&fit=crop',
        fileSize: '15.8 MB',
        fileFormat: 'PSD, PNG, JPG',
        dimensions: '4000 × 3000 px',
        downloads: 1247,
        rating: 4.7,
        totalReviews: 89,
        tags: [
          'Abstract',
          'Digital Art',
          'Geometric',
          'Modern',
          'Colorful',
          'Design',
          'Pattern',
          'Contemporary'
        ],
        createdAt: '2024-01-15',
        isExclusive: false,
        commercialUse: true
      };

      setAsset(sampleAsset);
    } catch (error) {
      console.error('Error loading asset details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Image': return <ImageIcon className="h-5 w-5" />;
      case 'Video': return <Video className="h-5 w-5" />;
      case 'Audio': return <Music className="h-5 w-5" />;
      case 'Document': return <FileText className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const getLicenseColor = (license: string) => {
    switch (license) {
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Extended': return 'bg-green-100 text-green-800';
      case 'Exclusive': return 'bg-purple-100 text-purple-800';
      case 'Royalty-Free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePurchase = () => {
    if (!user) {
      alert('Please sign in to purchase this asset');
      return;
    }
    console.log('Purchasing asset:', asset);
    // Handle purchase logic here
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }
    console.log('Adding to cart:', asset);
    // Handle add to cart logic here
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading asset details...</div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Asset not found</h2>
          <Button onClick={() => router.push('/asset-marketplace')}>
            Back to Asset Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      
      {/* Header - Only show if not in dashboard context */}
      {!isInDashboard && (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${isInDashboard ? 'p-4 sm:p-6 lg:p-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {/* Dashboard Back Button */}
        {isInDashboard && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/asset-marketplace')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Asset Marketplace
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image/Preview */}
            <Card className="overflow-hidden">
              <div className="relative bg-gray-100">
                <ImageWithFallback
                  src={asset.previewUrl || asset.images[0]}
                  alt={asset.title}
                  className="w-full h-64 lg:h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getLicenseColor(asset.license)}>
                    {asset.license} License
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF8D28]/10 rounded-lg">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div>
                    <h2 className="font-title text-xl">About This Asset</h2>
                    <p className="text-muted-foreground">{asset.type} • {asset.category}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {asset.description}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {asset.downloads.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {asset.fileSize}
                    </div>
                    <div className="text-sm text-muted-foreground">File Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {asset.totalReviews}
                    </div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {asset.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-title text-lg mb-3">File Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Format: {asset.fileFormat}</span>
                      </div>
                      {asset.dimensions && (
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Dimensions: {asset.dimensions}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Created: {new Date(asset.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-title text-lg mb-3">Usage Rights</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{asset.license} License</span>
                      </div>
                      {asset.commercialUse && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Commercial Use Allowed</span>
                        </div>
                      )}
                      {asset.isExclusive && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Exclusive Content</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-title text-lg mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-[#FF8D28]/10">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Images */}
            {asset.images.length > 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-title text-xl mb-4">More Previews</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {asset.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src={image}
                          alt={`Asset preview ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="font-title text-2xl mb-2">{asset.title}</h1>
                  <p className="text-muted-foreground mb-4">{asset.type} • {asset.category}</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{asset.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({asset.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <span className="text-3xl font-title text-[#FF8D28]">${asset.price}</span>
                    <div className="text-sm text-muted-foreground">{asset.license} License</div>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-6">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={asset.creator.avatar} alt={asset.creator.name} />
                    <AvatarFallback>
                      {asset.creator.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{asset.creator.name}</span>
                      {asset.creator.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Creator</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                    onClick={handlePurchase}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Buy & Download
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Creator
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 mx-auto mb-2" />
                  Secure payment & instant download
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

