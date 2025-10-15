import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Eye, 
  MessageSquare, 
  MapPin, 
  Star, 
  Scale, 
  Clock, 
  CheckCircle, 
  Edit, 
  BarChart3,
  DollarSign
} from 'lucide-react';
import { FavoritesButton } from './FavoritesButton';
import { UserProfileLink } from './UserProfileLink';

// Import the unified LegalService interface
import { LegalService } from './data/LegalDataService';

export interface LegalCardProps {
  lawyer: LegalService;
  isDashboardDarkMode?: boolean;
  onContact?: (lawyer: LegalService) => void;
  onCardClick?: (lawyerId: string) => void;
  viewMode?: 'grid' | 'list';
  adminActions?: {
    onEdit?: () => void;
    onAnalytics?: () => void;
  };
}

export function LegalCard({
  lawyer,
  isDashboardDarkMode = false,
  onContact,
  onCardClick,
  viewMode = 'grid',
  adminActions
}: LegalCardProps) {

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(lawyer.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
      viewMode === 'list' ? 'flex flex-row' : ''
    } ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      
      {/* Avatar/Profile Section */}
      {viewMode === 'list' && (
        <div className="w-32 flex-shrink-0 p-4 flex items-center justify-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
            <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Content Section */}
      <CardContent className={`${viewMode === 'list' ? 'flex-1' : ''} p-4 sm:p-6`}>
        
        {/* Header with Avatar (Grid Mode) and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {viewMode === 'grid' && (
              <Avatar className="w-12 h-12">
                <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 
                className={`font-semibold cursor-pointer hover:text-[#FF8D28] ${
                  isDashboardDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                onClick={handleCardClick}
              >
                {lawyer.name}
              </h3>
              <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {lawyer.firm}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FavoritesButton
              entityId={lawyer.id}
              entityType="lawyer"
              size="sm"
            />
            
            {/* Admin Actions */}
            {adminActions && lawyer.isOwner && (
              <div className="flex gap-1">
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
        </div>

        {/* Info Section */}
        <div className="space-y-3">
          
          {/* Location and Rating */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{lawyer.location}</span>
            </div>
            {lawyer.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{lawyer.rating.toFixed(1)}</span>
                {lawyer.totalReviews && (
                  <span>({lawyer.totalReviews} reviews)</span>
                )}
              </div>
            )}
          </div>

          {/* Status and Experience */}
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(lawyer.status)} text-xs`}>
              {lawyer.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {lawyer.experience} years
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Scale className="h-3 w-3 mr-1" />
              {lawyer.barAdmission}
            </Badge>
          </div>

          {/* Description */}
          <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
            {lawyer.description}
          </p>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1">
            {lawyer.specialization.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {lawyer.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lawyer.specialization.length - 3} more
              </Badge>
            )}
          </div>

          {/* Pricing and Availability */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              <span>${lawyer.hourlyRate}/hour</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-blue-600" />
              <span>{lawyer.availability}</span>
            </div>
          </div>

          {/* Admin Stats (for admin view) */}
          {lawyer.totalConsultations !== undefined && (
            <div className="grid grid-cols-2 gap-2 text-sm pt-3 border-t">
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 text-gray-500" />
                <span>{lawyer.totalConsultations} consultations</span>
              </div>
              {lawyer.totalEarnings !== undefined && (
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                  <span>${lawyer.totalEarnings}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCardClick}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            
            {onContact && (
              <Button 
                className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                onClick={() => onContact(lawyer)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

