import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

interface FavoritesButtonProps {
  entityId: string;
  entityType: 'talent' | 'asset' | 'studio' | 'legal_service' | 'event' | 'project' | 'legal_resource' | 'ticket';
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  variant?: 'default' | 'ghost' | 'outline';
}

export function FavoritesButton({
  entityId,
  entityType,
  size = 'md',
  showCount = false,
  variant = 'ghost'
}: FavoritesButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isServerAvailable, setIsServerAvailable] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Disabled Supabase requests
  // useEffect(() => {
  //   if (user && isServerAvailable) {
  //     checkFavoriteStatus();
  //   }
  //   if (isServerAvailable) {
  //     loadFavoriteCount();
  //   }
  // }, [user, entityId, isServerAvailable]);

  // Retry logic - attempt to reconnect after failures
  useEffect(() => {
    if (!isServerAvailable && retryCount < 3) {
      const retryTimer = setTimeout(() => {
        setIsServerAvailable(true);
        setRetryCount(prev => prev + 1);
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff: 1s, 2s, 4s

      return () => clearTimeout(retryTimer);
    }
  }, [isServerAvailable, retryCount]);

  const checkFavoriteStatus = async () => {
    if (!user || !isServerAvailable) return;

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          controller.abort();
        }
      }, 5000); // 5 second timeout

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/favorites/check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            entity_id: entityId,
            entity_type: entityType
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.is_favorited);
        setIsServerAvailable(true);
        setRetryCount(0); // Reset retry count on success
      } else {
        // Server responded but with error
        setIsFavorited(false);
        if (response.status >= 500) {
          setIsServerAvailable(false);
        }
      }
    } catch (error) {
      // Network error or timeout - disable server-dependent features
      setIsFavorited(false);
      setIsServerAvailable(false);
    }
  };

  const loadFavoriteCount = async () => {
    if (!isServerAvailable) {
      setFavoriteCount(0);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          controller.abort();
        }
      }, 5000); // 5 second timeout

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/favorites/count/${entityType}/${entityId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setFavoriteCount(data.count);
        setIsServerAvailable(true);
        setRetryCount(0); // Reset retry count on success
      } else {
        setFavoriteCount(0);
        if (response.status >= 500) {
          setIsServerAvailable(false);
        }
      }
    } catch (error) {
      // Network error or timeout - disable server-dependent features
      setFavoriteCount(0);
      setIsServerAvailable(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please sign in to add favorites');
      return;
    }

    // Disabled Supabase requests - just update UI locally
    setIsFavorited(!isFavorited);
    if (!isFavorited) {
      setFavoriteCount(prev => prev + 1);
    } else {
      setFavoriteCount(prev => Math.max(0, prev - 1));
    }
    return;
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'sm';
      case 'lg': return 'lg';
      default: return 'default';
    }
  };

  return (
    <Button
      variant={variant}
      size={getButtonSize()}
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 ${isFavorited ? 'text-red-500' : ''} ${
        !isServerAvailable ? 'opacity-75' : ''
      }`}
      title={!isServerAvailable ? 'Favorites temporarily unavailable' : undefined}
    >
      <Heart
        className={`${getIconSize()} ${
          isFavorited ? 'fill-red-500 text-red-500' : ''
        }`}
      />
      {showCount && favoriteCount > 0 && (
        <span className="text-sm">{favoriteCount}</span>
      )}
      {!showCount && size === 'lg' && (
        <span>{isFavorited ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
}

