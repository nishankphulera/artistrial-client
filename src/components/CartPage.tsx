import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

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
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, updated_at: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/cart/${userId}`,
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
    
    setUpdating(true);
    const updatedItems = cart.items.map(item =>
      item.artwork_id === artworkId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCart({ ...cart, items: updatedItems, total: newTotal });
    setUpdating(false);
  };

  const removeItem = async (artworkId: string) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/cart/${userId}/remove`,
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
      } else {
        console.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/cart/${userId}/clear`,
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
      } else {
        console.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleProceedToCheckout = () => {
    onProceedToCheckout(cart);
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
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
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Start exploring the marketplace to find amazing artworks</p>
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
                <Card key={item.artwork_id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <ImageWithFallback
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">by {item.artist_name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {item.media_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.artwork_id, item.quantity - 1)}
                            disabled={updating || item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.artwork_id, item.quantity + 1)}
                            disabled={updating}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
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
                    onClick={handleProceedToCheckout}
                    disabled={updating}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Checkout
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

