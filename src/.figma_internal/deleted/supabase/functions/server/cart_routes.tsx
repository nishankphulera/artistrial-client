// This file contains the missing cart routes for the server
import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

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

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

export function addCartRoutes(app: Hono) {
  // Get user's cart
  app.get('/make-server-f6985a91/cart/:userId', async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const userId = c.req.param('userId');
      
      // Check if user can access this cart (must be their own)
      if (userId !== user.id) {
        return c.json({ error: 'Cannot access another user\'s cart' }, 403);
      }

      // Get cart from storage
      const cartData = await kv.get(`cart:${userId}`);
      const cart: Cart = cartData || { items: [], total: 0, updated_at: new Date().toISOString() };
      
      return c.json({ cart });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return c.json({ error: 'Failed to fetch cart' }, 500);
    }
  });

  // Add item to cart
  app.post('/make-server-f6985a91/cart/:userId/add', async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const userId = c.req.param('userId');
      const { artworkId } = await c.req.json();
      
      // Check if user can modify this cart (must be their own)
      if (userId !== user.id) {
        return c.json({ error: 'Cannot modify another user\'s cart' }, 403);
      }

      if (!artworkId) {
        return c.json({ error: 'Artwork ID is required' }, 400);
      }

      // Get artwork details
      const artwork = await kv.get(`artwork:${artworkId}`);
      if (!artwork) {
        return c.json({ error: 'Artwork not found' }, 404);
      }

      if (!artwork.is_for_sale) {
        return c.json({ error: 'Artwork is not for sale' }, 400);
      }

      // Get existing cart
      const existingCart = await kv.get(`cart:${userId}`);
      const cart: Cart = existingCart || { items: [], total: 0, updated_at: new Date().toISOString() };

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.artwork_id === artworkId);
      
      if (existingItemIndex >= 0) {
        // Increase quantity
        cart.items[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        const cartItem: CartItem = {
          artwork_id: artworkId,
          title: artwork.title,
          artist_name: artwork.artist_name,
          artist_id: artwork.artist_id,
          price: artwork.price,
          image_url: artwork.image_url,
          media_type: artwork.category || 'Artwork',
          quantity: 1,
          added_at: new Date().toISOString()
        };
        cart.items.push(cartItem);
      }

      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cart.updated_at = new Date().toISOString();

      // Save cart
      await kv.set(`cart:${userId}`, cart);
      
      return c.json({ cart, message: 'Item added to cart successfully' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      return c.json({ error: 'Failed to add item to cart' }, 500);
    }
  });

  // Remove item from cart
  app.post('/make-server-f6985a91/cart/:userId/remove', async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const userId = c.req.param('userId');
      const { artworkId } = await c.req.json();
      
      // Check if user can modify this cart (must be their own)
      if (userId !== user.id) {
        return c.json({ error: 'Cannot modify another user\'s cart' }, 403);
      }

      if (!artworkId) {
        return c.json({ error: 'Artwork ID is required' }, 400);
      }

      // Get existing cart
      const existingCart = await kv.get(`cart:${userId}`);
      if (!existingCart) {
        return c.json({ error: 'Cart not found' }, 404);
      }

      const cart: Cart = existingCart;
      
      // Remove item from cart
      cart.items = cart.items.filter(item => item.artwork_id !== artworkId);
      
      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cart.updated_at = new Date().toISOString();

      // Save cart
      await kv.set(`cart:${userId}`, cart);
      
      return c.json({ cart, message: 'Item removed from cart successfully' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      return c.json({ error: 'Failed to remove item from cart' }, 500);
    }
  });

  // Clear entire cart
  app.post('/make-server-f6985a91/cart/:userId/clear', async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const userId = c.req.param('userId');
      
      // Check if user can modify this cart (must be their own)
      if (userId !== user.id) {
        return c.json({ error: 'Cannot modify another user\'s cart' }, 403);
      }

      // Clear cart
      const cart: Cart = {
        items: [],
        total: 0,
        updated_at: new Date().toISOString()
      };

      // Save empty cart
      await kv.set(`cart:${userId}`, cart);
      
      return c.json({ cart, message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      return c.json({ error: 'Failed to clear cart' }, 500);
    }
  });

  // Update item quantity in cart
  app.post('/make-server-f6985a91/cart/:userId/update', async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      
      if (authError || !user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const userId = c.req.param('userId');
      const { artworkId, quantity } = await c.req.json();
      
      // Check if user can modify this cart (must be their own)
      if (userId !== user.id) {
        return c.json({ error: 'Cannot modify another user\'s cart' }, 403);
      }

      if (!artworkId || quantity === undefined) {
        return c.json({ error: 'Artwork ID and quantity are required' }, 400);
      }

      if (quantity < 1) {
        return c.json({ error: 'Quantity must be at least 1' }, 400);
      }

      // Get existing cart
      const existingCart = await kv.get(`cart:${userId}`);
      if (!existingCart) {
        return c.json({ error: 'Cart not found' }, 404);
      }

      const cart: Cart = existingCart;
      
      // Find and update item
      const itemIndex = cart.items.findIndex(item => item.artwork_id === artworkId);
      if (itemIndex === -1) {
        return c.json({ error: 'Item not found in cart' }, 404);
      }

      cart.items[itemIndex].quantity = quantity;
      
      // Recalculate total
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      cart.updated_at = new Date().toISOString();

      // Save cart
      await kv.set(`cart:${userId}`, cart);
      
      return c.json({ cart, message: 'Cart updated successfully' });
    } catch (error) {
      console.error('Error updating cart:', error);
      return c.json({ error: 'Failed to update cart' }, 500);
    }
  });
}

