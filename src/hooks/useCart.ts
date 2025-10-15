import { useState } from 'react';
import { projectId } from '../utils/supabase/info';

interface CartItem {
  id: string;
  // Add other cart item properties as needed
}

interface Cart {
  items: CartItem[];
  total: number;
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = async (artworkId: string, user: any) => {
    if (!user) {
      alert('Please sign in to add items to cart');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found for cart operation');
        alert('Please sign in to add items to cart');
        return;
      }

      // First, initialize sample data if needed (ensure artworks exist)
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/init-sample-data`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        console.log('Sample data initialization attempted');
      } catch (initError) {
        console.log('Sample data initialization failed or already exists:', initError);
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/cart/${user.id}/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ artworkId }),
        }
      );

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Server returned non-JSON response. Content-Type:', contentType);
        const responseText = await response.text();
        console.error('Response text:', responseText);
        throw new Error('Server returned non-JSON response');
      }

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        console.log('Added to cart successfully');
        alert('Item added to cart successfully!');
      } else {
        let errorMessage = 'Failed to add to cart';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          const responseText = await response.text();
          console.error('Error response text:', responseText);
        }
        console.error('Cart add failed:', response.status, errorMessage);
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      
      // Check if it's a specific JSON parsing error
      if (error.message.includes('Unexpected') && error.message.includes('JSON')) {
        alert('Server is not responding correctly. Please try again later.');
      } else if (error.message.includes('non-JSON response')) {
        alert('Server error occurred. Please check if you are signed in and try again.');
      } else if (error.message.includes('Failed to fetch')) {
        alert('Unable to connect to server. Please check your connection and try again.');
      } else {
        alert('Failed to add to cart. Please check your connection and try again.');
      }
    }
  };

  const handleProceedToCheckout = (cartData: Cart) => {
    setCart(cartData);
    setShowCheckout(true);
  };

  const handlePaymentComplete = () => {
    setShowCheckout(false);
    setCart({ items: [], total: 0 });
    // Navigate to orders page or show success message
    window.location.href = `/orders`;
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  return {
    cart,
    showCheckout,
    handleAddToCart,
    handleProceedToCheckout,
    handlePaymentComplete,
    handleBackToCart,
  };
}