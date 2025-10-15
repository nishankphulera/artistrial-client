import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Heart, Eye, ShoppingCart, Edit, BarChart3 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Asset {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  tags: string[];
  artist: {
    id: string;
    name: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

interface AssetCardProps {
  asset: Asset;
  isAdminView?: boolean;
  currentUserId?: string;
  onAddToCart?: (assetId: string) => void;
  onLike?: (assetId: string) => void;
  onEdit?: (assetId: string) => void;
  onViewAnalytics?: (assetId: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isAdminView = false,
  currentUserId,
  onAddToCart,
  onLike,
  onEdit,
  onViewAnalytics,
}) => {
  const isOwner = currentUserId === asset.artist.id;

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
      <div className="relative overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={asset.imageUrl || `https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop`}
          alt={asset.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {isAdminView && isOwner && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(asset.id);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewAnalytics?.(asset.id);
                }}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </>
          )}
          {!isAdminView && (
            <Button
              variant="secondary"
              size="sm"
              className={`h-8 w-8 p-0 bg-white/90 hover:bg-white ${
                asset.isLiked ? 'text-red-500' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(asset.id);
              }}
            >
              <Heart className={`h-4 w-4 ${asset.isLiked ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
        <Badge className="absolute bottom-3 left-3 bg-black/70 text-white">
          {asset.category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-title text-lg mb-1 line-clamp-1">{asset.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{asset.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <ImageWithFallback
            src={asset.artist.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
            alt={asset.artist.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-600">{asset.artist.name}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {asset.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{asset.views}</span>
            </div>
            {!isAdminView && (
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{asset.likes}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-title text-xl text-[#FF8D28]">
              ${asset.price}
            </span>
            {!isAdminView && onAddToCart && !isOwner && (
              <Button
                size="sm"
                className="bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(asset.id);
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            )}
            {isAdminView && isOwner && (
              <Badge variant="outline" className="text-xs">
                Your Listing
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

