import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Calendar, Clock, MapPin, Users, Star, Eye, Ticket, Edit, BarChart3, DollarSign } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FavoritesButton } from './FavoritesButton';
import { UserProfileLink } from './UserProfileLink';

// Import the unified TicketListing interface
import { TicketListing } from './data/TicketDataService';

export interface TicketCardProps {
  ticket: TicketListing;
  isDashboardDarkMode?: boolean;
  onBook?: (ticket: TicketListing) => void;
  onCardClick?: (ticketId: string) => void;
  viewMode?: 'grid' | 'list';
  adminActions?: {
    onEdit?: () => void;
    onAnalytics?: () => void;
  };
}

export function TicketCard({
  ticket,
  isDashboardDarkMode = false,
  onBook,
  onCardClick,
  viewMode = 'grid',
  adminActions
}: TicketCardProps) {

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(ticket.id);
    }
  };

  const getEventIcon = (type: string) => {
    const icons = {
      'Workshop': '🎨',
      'Exhibition': '🖼️',
      'Conference': '🎤',
      'Concert': '🎵',
      'Screening': '🎬',
      'Festival': '🎪',
      'Music Events': '🎵',
      'Art Events': '🎨',
      'Film & Video': '🎬',
      'Networking': '☕',
      'Performance': '🎭'
    };
    return icons[type] || '🎫';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAvailabilityStatus = (sold: number, capacity: number) => {
    const percentage = (sold / capacity) * 100;
    if (percentage >= 100) return { status: 'Sold Out', color: 'destructive' };
    if (percentage >= 90) return { status: 'Almost Full', color: 'secondary' };
    if (percentage >= 70) return { status: 'Filling Fast', color: 'default' };
    return { status: 'Available', color: 'default' };
  };

  const availability = getAvailabilityStatus(ticket.sales || 0, ticket.totalTickets);

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${ 
      viewMode === 'list' ? 'flex flex-row' : ''
    } ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      
      {/* Image Section */}
      <div 
        className={`${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'} relative cursor-pointer`}
        onClick={handleCardClick}
      >
        <ImageWithFallback
          src={ticket.images?.[0] || '/api/placeholder/400/300'}
          alt={ticket.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          {ticket.featured && (
            <Badge variant="default">Featured</Badge>
          )}
          <Badge variant="outline" className="bg-white/90 flex items-center gap-1">
            <span>{getEventIcon(ticket.category)}</span>
            {ticket.category}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          <FavoritesButton
            entityId={ticket.id}
            entityType="event"
            size="sm"
            variant="outline"
          />
          <Badge variant={availability.color as any}>
            {availability.status}
          </Badge>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black/80 text-white">
            {ticket.ticketPrice > 0 ? `$${ticket.ticketPrice}` : 'Free'}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle 
                className={`text-lg line-clamp-2 cursor-pointer hover:text-[#FF8D28] ${
                  isDashboardDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                onClick={handleCardClick}
              >
                {ticket.title}
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                <UserProfileLink 
                  userId={ticket.organizerId || ticket.id}
                  userName={ticket.organizer || 'Event Organizer'}
                  prefix=""
                />
              </p>
            </div>
            
            {/* Admin Actions */}
            {adminActions && ticket.isOwner && (
              <div className="flex gap-1 ml-2">
                {adminActions.onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      adminActions.onEdit!();
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {adminActions.onAnalytics && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      adminActions.onAnalytics!();
                    }}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Date and Time */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(ticket.eventDate)} • {ticket.eventTime}</span>
            </div>

            {/* Venue and Location */}
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{ticket.venue}, {ticket.location}</span>
            </div>

            {/* Rating and Capacity */}
            <div className="flex items-center justify-between text-sm">
              {ticket.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{ticket.rating.toFixed(1)}</span>
                  {ticket.totalReviews && (
                    <span className="text-gray-500 ml-1">({ticket.totalReviews} reviews)</span>
                  )}
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>{ticket.sales || 0}/{ticket.totalTickets}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <Progress 
              value={((ticket.sales || 0) / ticket.totalTickets) * 100} 
              className="h-2"
            />

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {ticket.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {ticket.tags?.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {(ticket.tags?.length || 0) > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(ticket.tags?.length || 0) - 3} more
                </Badge>
              )}
            </div>

            {/* Admin Stats (for admin view) */}
            {ticket.earnings !== undefined && (
              <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                  <span>${ticket.earnings || 0}</span>
                </div>
                <div className="flex items-center">
                  <Ticket className="h-3 w-3 mr-1 text-blue-600" />
                  <span>{ticket.sales || 0} sold</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCardClick}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              
              {onBook && availability.status !== 'Sold Out' && (
                <Button 
                  className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                  onClick={() => onBook(ticket)}
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  Book
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

