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
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Award,
  Tag,
  Image as ImageIcon,
  FileText,
  Palette,
  Camera,
  Mic,
  Video,
  Monitor,
  Smartphone,
  Headphones
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';

export interface Product {
  id: string;
  name: string;
  type: 'Physical Product' | 'Digital Service' | 'Software' | 'Tool' | 'Equipment' | 'Artwork';
  category: string;
  price: number;
  originalPrice?: number;
  currency: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    business_name?: string;
  };
  description: string;
  images: string[];
  specifications?: { [key: string]: string };
  features: string[];
  shipping: {
    available: boolean;
    free_shipping: boolean;
    estimated_days: string;
    regions: string[];
  };
  stock_quantity: number;
  in_stock: boolean;
  rating: number;
  total_reviews: number;
  total_sales: number;
  tags: string[];
  warranty?: string;
  return_policy: string;
  digital_delivery?: boolean;
  license_type?: string;
  file_formats?: string[];
  created_at: string;
}

interface ProductDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  const loadProductDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleProduct: Product = {
        id: id || 'product1',
        name: 'Professional Art Tablet Pro X1',
        type: 'Equipment',
        category: 'Digital Art Tools',
        price: 899.99,
        originalPrice: 1099.99,
        currency: 'USD',
        seller: {
          id: 'seller1',
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          verified: true,
          business_name: 'Creative Tech Solutions'
        },
        description: 'Professional-grade digital art tablet designed for artists, designers, and creative professionals. Features advanced pressure sensitivity, tilt recognition, and seamless integration with all major design software. Perfect for digital painting, photo retouching, 3D modeling, and animation work.',
        images: [
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'
        ],
        specifications: {
          'Active Area': '13.3 x 8.5 inches',
          'Pressure Levels': '8192 levels',
          'Tilt Recognition': '±60 degrees',
          'Resolution': '5080 LPI',
          'Compatibility': 'Windows, macOS, Android',
          'Connectivity': 'USB-C, Wireless',
          'Battery Life': '10 hours',
          'Weight': '1.8 lbs'
        },
        features: [
          '8192 levels of pressure sensitivity',
          '±60° tilt recognition',
          'Battery-free stylus included',
          'Multi-touch gesture support',
          'Customizable express keys',
          'Wireless connectivity',
          'Cross-platform compatibility',
          '1-year manufacturer warranty'
        ],
        shipping: {
          available: true,
          free_shipping: true,
          estimated_days: '2-5 business days',
          regions: ['US', 'Canada', 'EU', 'UK', 'Australia']
        },
        stock_quantity: 47,
        in_stock: true,
        rating: 4.8,
        total_reviews: 156,
        total_sales: 892,
        tags: [
          'Digital Art',
          'Drawing Tablet',
          'Professional',
          'Wireless',
          'Pressure Sensitive',
          'Creative Tools'
        ],
        warranty: '1 year manufacturer warranty',
        return_policy: '30-day return policy. Items must be in original condition.',
        created_at: '2024-01-10'
      };

      setProduct(sampleProduct);
    } catch (error) {
      console.error('Error loading product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'Equipment': return <Monitor className="h-5 w-5" />;
      case 'Software': return <Smartphone className="h-5 w-5" />;
      case 'Digital Service': return <FileText className="h-5 w-5" />;
      case 'Artwork': return <Palette className="h-5 w-5" />;
      case 'Tool': return <Package className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const handlePurchase = () => {
    if (!user) {
      alert('Please sign in to purchase this product');
      return;
    }
    console.log('Purchasing product:', { product, quantity });
    // Handle purchase logic here
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }
    console.log('Adding to cart:', { product, quantity });
    // Handle add to cart logic here
  };

  const totalPrice = product ? product.price * quantity : 0;
  const savings = product && product.originalPrice ? (product.originalPrice - product.price) * quantity : 0;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Product not found</h2>
          <Button onClick={() => router.push('/product-services')}>
            Back to Products & Services
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
              onClick={() => router.push('/dashboard/product-services')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products & Services
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Images */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gray-50">
                  <ImageWithFallback
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-64 lg:h-96 object-contain"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-[#FF8D28] text-white">
                      {product.type}
                    </Badge>
                    {product.originalPrice && (
                      <Badge variant="destructive">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg p-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                            selectedImage === index ? 'border-[#FF8D28]' : 'border-gray-200'
                          }`}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* About Product */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#FF8D28]/10 rounded-lg">
                    {getProductIcon(product.type)}
                  </div>
                  <div>
                    <h2 className="font-title text-xl">Product Details</h2>
                    <p className="text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {product.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {product.total_reviews}
                    </div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {product.total_sales}
                    </div>
                    <div className="text-sm text-muted-foreground">Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {product.stock_quantity}
                    </div>
                    <div className="text-sm text-muted-foreground">In Stock</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-title text-lg mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-title text-lg mb-3">Product Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-[#FF8D28]/10">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            {product.specifications && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-title text-xl mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping & Returns */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">Shipping & Returns</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-title text-lg mb-3">Shipping Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {product.shipping.free_shipping ? 'Free Shipping' : 'Shipping Available'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Delivery: {product.shipping.estimated_days}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Ships to: {product.shipping.regions.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-title text-lg mb-3">Policies</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm">{product.return_policy}</span>
                      </div>
                      {product.warranty && (
                        <div className="flex items-start gap-2">
                          <Award className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{product.warranty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="font-title text-xl mb-2">{product.name}</h1>
                  <p className="text-muted-foreground mb-4">{product.category}</p>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.total_reviews} reviews)
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-title text-[#FF8D28]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-green-600">
                        You save ${savings.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-6">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                    <AvatarFallback>
                      {product.seller.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{product.seller.name}</span>
                      {product.seller.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.seller.business_name || 'Seller'}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quantity Selection */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quantity</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                        disabled={quantity >= product.stock_quantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Total Price</span>
                    <span className="font-title text-xl text-[#FF8D28]">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                    onClick={handlePurchase}
                    disabled={!product.in_stock}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {product.in_stock ? 'Buy Now' : 'Out of Stock'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 mx-auto mb-2" />
                  Secure payment & buyer protection
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

