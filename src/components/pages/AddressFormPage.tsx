'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { formatPriceINR, convertUSDToINR } from '@/utils/currency';
import { apiUrl } from '@/utils/api';

interface Address {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CartItem {
  artwork_id: string;
  title: string;
  artist_name: string;
  price: number;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function AddressFormPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [enrichedItems, setEnrichedItems] = useState<Map<string, { imageUrl: string; artistName: string }>>(new Map());
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const enrichCartItems = async (items: CartItem[]) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const enriched = new Map<string, { imageUrl: string; artistName: string }>();

    for (const item of items) {
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
          
          enriched.set(item.artwork_id, { imageUrl, artistName });
        }
      } catch (error) {
        console.error(`Error fetching asset ${item.artwork_id}:`, error);
        // Use existing data
        enriched.set(item.artwork_id, {
          imageUrl: '',
          artistName: item.artist_name || 'Unknown Artist',
        });
      }
    }

    setEnrichedItems(enriched);
  };

  const getItemImage = (item: CartItem): string => {
    const enriched = enrichedItems.get(item.artwork_id);
    return enriched?.imageUrl || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop';
  };

  const getItemArtistName = (item: CartItem): string => {
    const enriched = enrichedItems.get(item.artwork_id);
    return enriched?.artistName || item.artist_name || 'Unknown Artist';
  };

  useEffect(() => {
    // Load cart data from sessionStorage
    const cartData = sessionStorage.getItem('cartData');
    const cartUserId = sessionStorage.getItem('cartUserId');

    if (!cartData || !cartUserId) {
      router.push('/dashboard/cart');
      return;
    }

    try {
      const parsedCart = JSON.parse(cartData);
      setCart(parsedCart);
      setLoading(false);
      
      // Enrich cart items with asset data
      enrichCartItems(parsedCart.items);
    } catch (error) {
      console.error('Error parsing cart data:', error);
      router.push('/dashboard/cart');
    }

    // Load Razorpay script
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        return; // Already loaded
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded');
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
      };
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, [router]);

  const handleInputChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAddress = (): boolean => {
    return !!(
      address.fullName &&
      address.phoneNumber &&
      address.addressLine1 &&
      address.city &&
      address.state &&
      address.zipCode &&
      address.country
    );
  };

  // Use INR formatting utility (prices are already in USD from cart)
  const formatPrice = (price: number) => formatPriceINR(price, true);

  const handleProceedToCheckout = async () => {
    if (!validateAddress()) {
      toast.error('Validation Error', {
        description: 'Please fill in all required address fields.',
        duration: 4000,
      });
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Empty Cart', {
        description: 'Your cart is empty. Please add items before checkout.',
        duration: 4000,
      });
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Sign In Required', {
          description: 'Please sign in to proceed with checkout.',
          duration: 4000,
        });
        router.push('/auth');
        setProcessing(false);
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Processing...', {
        description: 'Creating your order and opening payment gateway...',
      });

      // Convert USD to INR and calculate total amount (in paise for Razorpay)
      const totalInUSD = cart.total * 1.03; // Add 3% processing fee
      const totalInINR = convertUSDToINR(totalInUSD);
      const totalAmount = Math.round(totalInINR * 100); // Convert to paise for Razorpay

      // Create order on backend first
      const orderResponse = await fetch(
        apiUrl(`cart/${user?.id}/create-order`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.items,
            address: address,
            totalAmount: totalInINR, // Send amount in INR
          }),
        }
      );

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        toast.dismiss(loadingToast);
        toast.error('Order Creation Failed', {
          description: errorData.error || 'Failed to create order. Please try again.',
          duration: 5000,
        });
        setProcessing(false);
        return;
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.orderId || orderData.id;
      const razorpayOrderId = orderData.razorpayOrderId;

      if (!razorpayOrderId) {
        toast.dismiss(loadingToast);
        toast.error('Payment Error', {
          description: 'Failed to initialize payment. Please try again.',
          duration: 5000,
        });
        setProcessing(false);
        return;
      }

      toast.dismiss(loadingToast);

      // Initialize Razorpay
      const razorpayKey = orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
      
      const options = {
        key: razorpayKey,
        amount: totalAmount,
        currency: 'INR',
        name: 'Artistrial',
        description: `Order for ${cart.items.length} item(s)`,
        order_id: razorpayOrderId, // Use Razorpay order ID
        handler: async function (response: any) {
          try {
            // Show verifying payment toast
            const verifyingToast = toast.loading('Verifying Payment', {
              description: 'Please wait while we verify your payment...',
            });

            // Verify payment on backend
            const verifyResponse = await fetch(
              apiUrl(`cart/${user?.id}/verify-payment`),
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: orderId,
                  address: address,
                }),
              }
            );

            toast.dismiss(verifyingToast);

            if (verifyResponse.ok) {
              // Clear cart from sessionStorage
              sessionStorage.removeItem('cartData');
              sessionStorage.removeItem('cartUserId');
              
              toast.success('Payment Successful!', {
                description: 'Your order has been placed successfully. Redirecting...',
                duration: 3000,
                icon: '✅',
              });
              
              // Redirect to success page or orders page after a short delay
              setTimeout(() => {
                router.push(`/dashboard/orders?payment=success&orderId=${orderId}`);
              }, 1500);
            } else {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(errorData.error || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast.error('Payment Verification Failed', {
              description: error.message || 'Please contact support if the amount was deducted.',
              duration: 6000,
            });
            setProcessing(false);
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phoneNumber,
          email: user?.email || '',
        },
        theme: {
          color: '#FF8D28',
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment Cancelled', {
              description: 'You closed the payment window. You can try again when ready.',
              duration: 4000,
            });
            setProcessing(false);
          }
        }
      };

      // Wait for Razorpay script to load if not already loaded
      if (!window.Razorpay) {
        // Wait for script to load
        const scriptLoaded = await new Promise<boolean>((resolve) => {
          const checkRazorpay = setInterval(() => {
            if (window.Razorpay) {
              clearInterval(checkRazorpay);
              resolve(true);
            }
          }, 100);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkRazorpay);
            resolve(false);
          }, 10000);
        });

        if (!scriptLoaded) {
          toast.error('Payment Gateway Error', {
            description: 'Razorpay script failed to load. Please refresh the page and try again.',
            duration: 6000,
          });
          setProcessing(false);
          return;
        }
      }

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response);
        toast.error('Payment Failed', {
          description: response.error?.description || 'Your payment could not be processed. Please try again.',
          duration: 5000,
        });
        setProcessing(false);
      });

      // Open Razorpay checkout
      razorpay.open();
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Checkout Failed', {
        description: error.message || 'Failed to proceed with checkout. Please try again.',
        duration: 5000,
      });
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#171717] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/cart')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={address.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={address.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={address.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="Street address, P.O. Box"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={address.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={address.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="ZIP Code"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={address.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Cart Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.artwork_id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="w-16 h-16 flex-shrink-0 aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <ImageWithFallback
                          src={getItemImage(item)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs mt-0.5 dark:text-gray-400">
                          by {getItemArtistName(item)}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs dark:text-gray-400">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-semibold dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="dark:text-gray-300">Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
                    <span className="dark:text-white">{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="dark:text-gray-300">Processing Fee</span>
                    <span className="dark:text-white">{formatPrice(cart.total * 0.03)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="dark:text-white">Total</span>
                      <span className="dark:text-white">{formatPrice(cart.total * 1.03)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleProceedToCheckout}
                  disabled={processing || !validateAddress()}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {processing ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <p>Secure payment via Razorpay</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

