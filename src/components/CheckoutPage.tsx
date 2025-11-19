import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
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
}

interface Cart {
  items: CartItem[];
  total: number;
}

interface CheckoutPageProps {
  cart: Cart;
  userId: string;
  onPaymentComplete: (orderId: string) => void;
  onBack: () => void;
}

interface PaymentForm {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function CheckoutPage({ cart, userId, onPaymentComplete, onBack }: CheckoutPageProps) {
  const [loading, setLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  const processingFee = cart.total * 0.03;
  const totalAmount = cart.total + processingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setPaymentForm(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else if (field === 'cardNumber') {
      setPaymentForm(prev => ({ ...prev, cardNumber: formatCardNumber(value) }));
    } else if (field === 'expiryDate') {
      setPaymentForm(prev => ({ ...prev, expiryDate: formatExpiryDate(value) }));
    } else if (field === 'cvv') {
      const numericValue = value.replace(/[^0-9]/gi, '').substring(0, 4);
      setPaymentForm(prev => ({ ...prev, cvv: numericValue }));
    } else {
      setPaymentForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const { email, cardNumber, expiryDate, cvv, cardholderName, billingAddress } = paymentForm;
    
    return (
      email &&
      cardNumber.replace(/\s/g, '').length >= 13 &&
      expiryDate.length === 5 &&
      cvv.length >= 3 &&
      cardholderName &&
      billingAddress.line1 &&
      billingAddress.city &&
      billingAddress.state &&
      billingAddress.zipCode
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required. Please sign in.');
      }

      // Checkout cart and create order
      const checkoutResponse = await fetch(
        apiUrl(`cart/${userId}/checkout`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethod: 'card',
            transactionId: `txn_${Date.now()}`
          }),
        }
      );

      // Check if response is JSON before parsing
      const contentType = checkoutResponse.headers.get('content-type');
      if (!checkoutResponse.ok) {
        let errorMessage = 'Failed to complete checkout';
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await checkoutResponse.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            // If error response is not JSON, use default message
          }
        } else {
          const text = await checkoutResponse.text();
          console.error('Non-JSON error response from checkout endpoint:', text.substring(0, 200));
          errorMessage = 'Checkout service is not available. Please try again later or contact support.';
        }
        throw new Error(errorMessage);
      }

      if (!contentType || !contentType.includes('application/json')) {
        const text = await checkoutResponse.text();
        console.error('Non-JSON response from checkout endpoint:', text.substring(0, 200));
        throw new Error('Checkout service is not available. Please try again later or contact support.');
      }

      const checkoutData = await checkoutResponse.json();
      
      // Use the first order ID for the callback, or create a summary if multiple orders
      const orderId = checkoutData.data?.orderIds?.[0] || checkoutData.data?.orderIds?.join(',') || 'unknown';
      onPaymentComplete(orderId.toString());
      
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={paymentForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={paymentForm.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentForm.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Billing Address</h3>
                    
                    <div>
                      <Label htmlFor="line1">Address Line 1</Label>
                      <Input
                        id="line1"
                        placeholder="123 Main Street"
                        value={paymentForm.billingAddress.line1}
                        onChange={(e) => handleInputChange('billingAddress.line1', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                      <Input
                        id="line2"
                        placeholder="Apt, suite, etc."
                        value={paymentForm.billingAddress.line2}
                        onChange={(e) => handleInputChange('billingAddress.line2', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={paymentForm.billingAddress.city}
                          onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={paymentForm.billingAddress.state}
                          onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="12345"
                        value={paymentForm.billingAddress.zipCode}
                        onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !validateForm()}
                    >
                      {loading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Payment {formatPrice(totalAmount)}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="text-sm text-gray-500 text-center">
              <p className="flex items-center justify-center">
                <Lock className="w-4 h-4 mr-1" />
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.artwork_id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <ImageWithFallback
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                      <p className="text-sm text-gray-600">by {item.artist_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.media_type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee (3%)</span>
                    <span>{formatPrice(processingFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">Digital Content Delivery</p>
                    <p>Digital artworks will be available for download immediately after payment confirmation. You'll receive download links via email.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

