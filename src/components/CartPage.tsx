import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, ShoppingCart, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { formatPriceINR } from '@/utils/currency';
import { apiUrl } from '@/utils/api';

interface CartItem {
  artwork_id: string;
  title: string;
  artist_name: string;
  artist_id: string;
  price: number;
  image_url: string;
  media_type: string;
  quantity: number;
  added_at: string;
}

interface Cart {
  items: CartItem[];
  total: number;
  updated_at: string;
}

interface CartPageProps {
  userId: string;
  onProceedToCheckout: (cart: Cart) => void;
  isDashboardDarkMode?: boolean;
}

export function CartPage({ userId, onProceedToCheckout, isDashboardDarkMode = false }: CartPageProps) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, updated_at: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [enrichedItems, setEnrichedItems] = useState<Map<string, { imageUrl: string; artistName: string; category?: string }>>(new Map());

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      // Check if we have a valid userId
      if (!userId) {
        console.error('No userId provided to fetchCart');
        setCart({ items: [], total: 0, updated_at: new Date().toISOString() });
        return;
      }
      
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found');
        setCart({ items: [], total: 0, updated_at: new Date().toISOString() });
        return;
      }

      console.log('Fetching cart for user:', userId);
      
      const response = await fetch(
        apiUrl(`cart/${userId}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Cart fetched successfully:', data);
        setCart(data.cart);
        
        // Enrich cart items with asset data if needed
        await enrichCartItems(data.cart.items);
      } else {
        console.error('Failed to fetch cart:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        // Initialize with empty cart if fetch fails
        setCart({ items: [], total: 0, updated_at: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Initialize with empty cart if fetch fails
      setCart({ items: [], total: 0, updated_at: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (artworkId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        apiUrl(`cart/${userId}/quantity`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ artworkId, quantity: newQuantity }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        await enrichCartItems(data.cart.items);
      } else {
        console.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (artworkId: string) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        apiUrl(`cart/${userId}/remove`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ artworkId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        await enrichCartItems(data.cart.items);
        toast.success('Removed from Cart', {
          description: 'The item has been removed from your cart.',
          duration: 3000,
          icon: '🗑️',
        });
      } else {
        console.error('Failed to remove item from cart');
        toast.error('Failed to Remove', {
          description: 'Could not remove item from cart. Please try again.',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Error', {
        description: 'An error occurred while removing the item. Please try again.',
        duration: 4000,
      });
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        apiUrl(`cart/${userId}/clear`),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        setEnrichedItems(new Map());
      } else {
        console.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const enrichCartItems = async (items: CartItem[]) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const enriched = new Map<string, { imageUrl: string; artistName: string; category?: string }>();

    for (const item of items) {
      // Only fetch if image_url is missing or empty
      if (!item.image_url || item.image_url.trim() === '') {
        try {
          const response = await fetch(
            apiUrl(`assets/${item.artwork_id}`),
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const asset = await response.json();
            const imageUrl = asset.preview_images?.[0] || asset.avatar_url || '';
            const artistName = asset.display_name || asset.username || item.artist_name || 'Unknown Artist';
            const category = asset.category || 'Digital Art';
            
            enriched.set(item.artwork_id, { imageUrl, artistName, category });
          }
        } catch (error) {
          console.error(`Error fetching asset ${item.artwork_id}:`, error);
        }
      } else {
        // Use existing data
        enriched.set(item.artwork_id, {
          imageUrl: item.image_url,
          artistName: item.artist_name || 'Unknown Artist',
        });
      }
    }

    setEnrichedItems(enriched);
  };

  // Use INR formatting utility
  const formatPrice = (price: number) => formatPriceINR(price, true);

  const getItemImage = (item: CartItem): string => {
    const enriched = enrichedItems.get(item.artwork_id);
    return enriched?.imageUrl || item.image_url || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop';
  };

  const getItemArtistName = (item: CartItem): string => {
    const enriched = enrichedItems.get(item.artwork_id);
    return enriched?.artistName || item.artist_name || 'Unknown Artist';
  };

  const getItemCategory = (item: CartItem): string | null => {
    const enriched = enrichedItems.get(item.artwork_id);
    // Only show category if it's meaningful (not file format like png, jpg)
    const category = enriched?.category;
    if (category && !['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(category.toLowerCase())) {
      return category;
    }
    return null;
  };

  const handleAddAddress = () => {
    // Store cart data in sessionStorage for address page
    sessionStorage.setItem('cartData', JSON.stringify(cart));
    sessionStorage.setItem('cartUserId', userId);
    router.push('/dashboard/cart/address');
  };

  if (loading) {
    return (
      <div className={`h-full w-full ${isDashboardDarkMode ? 'bg-[#171717] text-white' : 'bg-gray-50'} p-6`}>
        <div className="w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${isDashboardDarkMode ? 'bg-[#171717] text-white' : 'bg-gray-50'} p-6`}>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>Shopping Cart</h1>
          {cart.items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              disabled={updating}
            >
              Clear Cart
            </Button>
          )}
        </div>

        {cart.items.length === 0 ? (
          /* Empty Cart State */
          <Card className={`text-center py-16 ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent>
              <ShoppingCart className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h3>
              <p className={`mb-6 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start exploring the marketplace to find amazing artworks</p>
              <Button>
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.artwork_id} className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 flex-shrink-0 aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <ImageWithFallback
                          src={getItemImage(item)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold truncate ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                        <p className={`text-sm mb-2 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          by {getItemArtistName(item)}
                        </p>
                        {getItemCategory(item) && (
                          <Badge variant="secondary" className="text-xs">
                            {getItemCategory(item)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className={`text-sm font-medium ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                            Quantity
                          </div>
                          <div className={`font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.quantity}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatPrice(item.price)} each
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.artwork_id)}
                          disabled={updating}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
                      <span>{formatPrice(cart.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Processing Fee</span>
                      <span>{formatPrice(cart.total * 0.03)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(cart.total * 1.03)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleAddAddress}
                    disabled={updating || cart.items.length === 0}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    <p>Secure checkout with 256-bit SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

