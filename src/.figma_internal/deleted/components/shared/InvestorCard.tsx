import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { TrendingUp, DollarSign, Building, Globe, Star, Eye, MessageCircle, Users, Edit, BarChart3 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FavoritesButton } from './FavoritesButton';
import { UserProfileLink } from './UserProfileLink';

// NEW: Import the unified InvestorProfile interface
import { InvestorProfile } from './data/InvestorDataService';

// Legacy interfaces for backward compatibility
export interface Investor {
  id: string;
  name: string;
  company: string;
  type: 'Angel Investor' | 'VC Fund' | 'Art Fund' | 'Private Investor' | 'Corporate';
  location: string;
  investmentRange: string;
  focus: string[];
  portfolio: string[];
  avatar: string;
  description: string;
  previousInvestments: number;
  totalFunding: string;
  stage: 'Seed' | 'Series A' | 'Series B' | 'Growth' | 'All Stages';
  isActive: boolean;
  contact_info?: any;
  rating?: number;
  total_reviews?: number;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  creator_name: string;
  creator_id?: string;
  stage: string;
  funding_goal: number;
  funding_raised: number;
  investor_count: number;
  category: string;
  description: string;
  images: string[];
  deadline?: string;
  minimum_investment?: number;
  expected_returns?: string;
  equity_offered?: string;
  location: string;
}

// NEW: Updated props to support both old and new interfaces
export interface InvestorCardProps {
  // Legacy props for backward compatibility
  investor?: Investor;
  project?: Project;
  type?: 'investor' | 'project';
  
  // NEW: Direct InvestorProfile support (modern usage)
  investorProfile?: InvestorProfile;
  
  isDashboardDarkMode?: boolean;
  onConnect?: (investor: Investor) => void;
  onInvest?: (project: Project) => void;
  onCardClick?: (id: string) => void;
  viewMode?: 'grid' | 'list';
  adminActions?: {
    onEdit?: () => void;
    onAnalytics?: () => void;
  };
}

export function InvestorCard({
  investor,
  project,
  type,
  investorProfile,
  isDashboardDarkMode = false,
  onConnect,
  onInvest,
  onCardClick,
  viewMode = 'grid',
  adminActions
}: InvestorCardProps) {
  const router = useRouter();

  // NEW: Support both old investor prop and new investorProfile prop
  const currentInvestor = investorProfile || investor;
  const currentType = investorProfile ? 'investor' : type;

  const handleCardClick = () => {
    if (onCardClick && currentInvestor) {
      onCardClick(currentInvestor.id);
    } else if (currentInvestor) {
      // Navigate to public investor detail page
      router.push(`/investors/${currentInvestor.id}`);
    }
  };

  // NEW: Handle modern InvestorProfile interface
  if (currentType === 'investor' && currentInvestor) {
    const formattedInvestor = investorProfile ? {
      ...investorProfile,
      // Map new interface to old interface fields for display
      company: investorProfile.type,
      investmentRange: `${(investorProfile.minimumInvestment / 1000)}K - ${(investorProfile.maximumInvestment / 1000)}K`,
      description: investorProfile.bio,
      previousInvestments: investorProfile.totalInvestments,
      totalFunding: `${investorProfile.successfulExits} exits`,
      stage: investorProfile.investmentStage.join(', '),
      isActive: investorProfile.status === 'active',
      total_reviews: investorProfile.totalReviews
    } : currentInvestor;

    return (
      <Card 
        className={`hover:shadow-lg transition-shadow cursor-pointer ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={formattedInvestor.avatar} alt={formattedInvestor.name} />
                <AvatarFallback>{formattedInvestor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg hover:text-[#FF8D28]">
                  {formattedInvestor.name}
                </CardTitle>
                <p className="text-muted-foreground">{formattedInvestor.company || formattedInvestor.type}</p>
                <Badge variant="outline" className="mt-1">{formattedInvestor.type}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoritesButton
                entityId={formattedInvestor.id}
                entityType="investor"
                size="sm"
              />
              <Badge variant={formattedInvestor.isActive ? 'default' : 'secondary'}>
                {formattedInvestor.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {/* Admin Actions */}
              {adminActions && formattedInvestor.isOwner && (
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
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Rating */}
            {formattedInvestor.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{formattedInvestor.rating.toFixed(1)} ({formattedInvestor.total_reviews || 0} reviews)</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                <span>{formattedInvestor.investmentRange}</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                <span>{formattedInvestor.totalFunding}</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-purple-600" />
                <span>{formattedInvestor.previousInvestments} investments</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-600" />
                <span>{formattedInvestor.location}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {formattedInvestor.description}
            </p>

            {/* Focus Areas */}
            <div>
              <p className="text-sm font-medium mb-2">Investment Focus</p>
              <div className="flex flex-wrap gap-1">
                {formattedInvestor.focus.slice(0, 4).map((area, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
                {formattedInvestor.focus.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{formattedInvestor.focus.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              {onConnect && (
                <Button 
                  className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnect(formattedInvestor as Investor);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'project' && project) {
    return (
      <Card className={`hover:shadow-lg transition-shadow ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="relative">
          <ImageWithFallback 
            src={project.images[0] || '/api/placeholder/400/300'} 
            alt={project.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <FavoritesButton
              entityId={project.id}
              entityType="project"
              size="sm"
              variant="outline"
            />
            <Badge variant="secondary">
              {project.stage}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4">
            <Badge variant="outline" className="bg-white/90">
              {project.category}
            </Badge>
          </div>
        </div>
        
        <CardHeader>
          <CardTitle 
            className="text-lg cursor-pointer hover:text-[#FF8D28]"
            onClick={() => onCardClick?.(project.id)}
          >
            {project.title}
          </CardTitle>
          <p className="text-muted-foreground">{project.company}</p>
          <p className="text-sm text-muted-foreground">
            <UserProfileLink 
              userId={project.creator_id || project.id}
              userName={project.creator_name}
            />
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Funding Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Funding Progress</span>
                <span>{((project.funding_raised / project.funding_goal) * 100).toFixed(0)}%</span>
              </div>
              <Progress 
                value={(project.funding_raised / project.funding_goal) * 100} 
                className="h-2"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Raised</p>
                <p className="font-medium">${project.funding_raised.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Goal</p>
                <p className="font-medium">${project.funding_goal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Investors</p>
                <p className="font-medium">{project.investor_count}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Min. Investment</p>
                <p className="font-medium">${project.minimum_investment?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>

            {/* Key Info */}
            {project.expected_returns && (
              <div className="text-sm">
                <span className="text-muted-foreground">Expected Returns: </span>
                <span className="font-medium text-green-600">{project.expected_returns}</span>
              </div>
            )}



            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onCardClick?.(project.id)}
              >
                Learn More
              </Button>
              {onInvest && (
                <Button 
                  className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                  onClick={() => onInvest(project)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Invest
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

