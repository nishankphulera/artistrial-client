import { useState } from 'react';
import { toast } from 'sonner';
import { apiUrl } from '@/utils/api';

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
      toast.error('Sign In Required', {
        description: 'Please sign in to add items to your cart.',
        duration: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found for cart operation');
        toast.error('Sign In Required', {
          description: 'Please sign in to add items to your cart.',
          duration: 3000,
        });
        return;
      }

      // Check if item already exists in cart before making API call
      try {
        const cartResponse = await fetch(
          apiUrl(`cart/${user.id}`),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          const existingItem = cartData.cart?.items?.find(
            (item: any) => item.artwork_id?.toString() === artworkId.toString()
          );

          if (existingItem) {
            toast.warning('Already in Cart', {
              description: 'This asset is already in your cart. Each asset can only be added once.',
              duration: 4000,
              icon: '🛒',
            });
            return;
          }
        }
      } catch (checkError) {
        // If check fails, continue with the add request - backend will handle duplicate check
        console.log('Could not check cart before adding:', checkError);
      }

      const response = await fetch(
        apiUrl(`cart/${user.id}/add`),
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
        toast.success('Added to Cart!', {
          description: 'The asset has been successfully added to your cart.',
          duration: 3000,
          icon: '✅',
        });
      } else {
        let errorMessage = 'Failed to add to cart';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
          
          // Check if it's a duplicate error
          if (errorMessage.includes('already in your cart') || errorMessage.includes('already exists')) {
            toast.warning('Already in Cart', {
              description: errorMessage,
              duration: 4000,
              icon: '🛒',
            });
            return;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          const responseText = await response.text();
          console.error('Error response text:', responseText);
        }
        console.error('Cart add failed:', response.status, errorMessage);
        toast.error('Failed to Add', {
          description: errorMessage,
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      
      // Check if it's a specific JSON parsing error
      if (error.message.includes('Unexpected') && error.message.includes('JSON')) {
        toast.error('Server Error', {
          description: 'Server is not responding correctly. Please try again later.',
          duration: 4000,
        });
      } else if (error.message.includes('non-JSON response')) {
        toast.error('Server Error', {
          description: 'Server error occurred. Please check if you are signed in and try again.',
          duration: 4000,
        });
      } else if (error.message.includes('Failed to fetch')) {
        toast.error('Connection Error', {
          description: 'Unable to connect to server. Please check your connection and try again.',
          duration: 4000,
        });
      } else {
        toast.error('Failed to Add', {
          description: 'Failed to add to cart. Please check your connection and try again.',
          duration: 4000,
        });
      }
    }
  };

  const handleRemoveFromCart = async (artworkId: string, user: any) => {
    if (!user) {
      toast.error('Sign In Required', {
        description: 'Please sign in to remove items from your cart.',
        duration: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found for cart operation');
        toast.error('Sign In Required', {
          description: 'Please sign in to remove items from your cart.',
          duration: 3000,
        });
        return;
      }

      const response = await fetch(
        apiUrl(`cart/${user.id}/remove`),
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
        console.log('Removed from cart successfully');
        toast.success('Removed from Cart', {
          description: 'The asset has been removed from your cart.',
          duration: 3000,
          icon: '🗑️',
        });
      } else {
        let errorMessage = 'Failed to remove from cart';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        console.error('Cart remove failed:', response.status, errorMessage);
        toast.error('Failed to Remove', {
          description: errorMessage,
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      
      if (error.message.includes('Failed to fetch')) {
        toast.error('Connection Error', {
          description: 'Unable to connect to server. Please check your connection and try again.',
          duration: 4000,
        });
      } else {
        toast.error('Failed to Remove', {
          description: 'Failed to remove from cart. Please check your connection and try again.',
          duration: 4000,
        });
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
    handleRemoveFromCart,
    handleProceedToCheckout,
    handlePaymentComplete,
    handleBackToCart,
  };
}