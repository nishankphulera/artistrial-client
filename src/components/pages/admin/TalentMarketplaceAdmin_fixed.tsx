// This file was used temporarily and is now replaced in the main file
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  Grid, 
  List, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Users,
  Edit,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  Search,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  Video,
  Palette,
  Music,
  FileText,
  Mic
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { FavoritesButton } from '../../shared/FavoritesButton';
import { TalentCard } from '../../shared/TalentCard';
import { useAuth } from '../../providers/AuthProvider';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface TalentProfile {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
  experience: string;
  avatar: string;
  availability: 'Available' | 'Busy' | 'Booked';
  portfolio: string[];
  bio: string;
  totalReviews: number;
  totalProjects: number;
  responseTime: string;
  earnings: number;
  status: 'active' | 'pending' | 'paused';
  isOwner?: boolean;
  featuredImage?: string;
}

interface BookingRequest {
  id: string;
  clientName: string;
  clientAvatar: string;
  projectTitle: string;
  budget: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  message: string;
}

interface AdminStats {
  totalTalents: number;
  myProfile: boolean;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
}

interface TalentMarketplaceAdminProps {
  isDashboardDarkMode?: boolean;
}

export const TalentMarketplaceAdmin: React.FC<TalentMarketplaceAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-talents');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 200],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  // Dashboard talent detail navigation handler
  const handleTalentClick = (talentId: string) => {
    console.log('🚀 Admin Dashboard - navigating to talent detail:', talentId);
    router.push(`/dashboard/talent/${talentId}`);
  };

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock admin stats
      setAdminStats({
        totalTalents: 1250,
        myProfile: true,
        totalBookings: 12,
        totalEarnings: 5400,
        averageRating: 4.9,
        responseRate: 98,
      });

      // Mock talent profiles with admin features
      const mockTalents: TalentProfile[] = [
        {
          id: 'talent1',
          name: 'Sarah Johnson',
          profession: 'Portrait Photographer',
          location: 'New York, NY',
          rating: 4.9,
          hourlyRate: 85,
          skills: ['Portrait Photography', 'Studio Lighting', 'Adobe Lightroom', 'Professional Headshots'],
          experience: '8 years',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          availability: 'Available',
          portfolio: [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=200&fit=crop',
          ],
          bio: 'Professional portrait photographer with 8 years of experience specializing in executive headshots and artistic portraits.',
          totalReviews: 23,
          totalProjects: 156,
          responseTime: '2 hours',
          earnings: 13200,
          status: 'active',
          isOwner: user?.id === 'talent1',
          featuredImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop',
        },
        {
          id: 'talent2',
          name: 'Marcus Chen',
          profession: 'Video Editing Specialist',
          location: 'Los Angeles, CA',
          rating: 4.8,
          hourlyRate: 75,
          skills: ['After Effects', 'Premiere Pro', 'Motion Graphics', 'Color Grading'],
          experience: '6 years',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          availability: 'Busy',
          portfolio: [
            'https://images.unsplash.com/photo-1574169208507-84376144848b?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
          ],
          bio: 'Creative video editing specialist focusing on post-production and motion graphics for commercial projects.',
          totalReviews: 18,
          totalProjects: 89,
          responseTime: '4 hours',
          earnings: 8900,
          status: 'active',
          isOwner: false,
          featuredImage: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=300&fit=crop',
        }
      ];

      setTalents(mockTalents);
    } catch (error) {
      console.error('Error loading admin talent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    router.push('/dashboard/create-talent');
  };

  const handleEditProfile = (talentId: string) => {
    router.push(`/dashboard/edit-talent-profile/${talentId}`);
  };

  const handleViewAnalytics = (talentId: string) => {
    router.push(`/dashboard/analytics/talent/${talentId}`);
  };

  const filteredTalents = talents.filter(talent => {
    // Tab filtering
    let tabMatch = true;
    switch (activeTab) {
      case 'my-profiles':
        tabMatch = !!talent.isOwner;
        break;
      case 'active':
        tabMatch = talent.status === 'active';
        break;
      case 'pending':
        tabMatch = talent.status === 'pending';
        break;
    }

    if (!tabMatch) return false;

    // Apply all other filters (same as public page)
    const matchesSearch = !filters.searchTerm || 
      talent.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      talent.profession.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      talent.skills?.some(skill => skill.toLowerCase().includes(filters.searchTerm?.toLowerCase() || ''));

    return matchesSearch;
  });

  const showFilterSidebar = activeTab === 'all-talents' || activeTab === 'active' || activeTab === 'pending';

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex-1">
            <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Talent Management</h1>
            <p className="text-muted-foreground">
              Manage your talent profiles, bookings, and track your performance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Button onClick={handleCreateProfile} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className={`grid w-full max-w-3xl grid-cols-5 ${isDashboardDarkMode ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="all-talents">All Talents</TabsTrigger>
            <TabsTrigger value="my-profiles">My Profiles</TabsTrigger>
            <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">
          {/* All Talents Tab */}
          {(activeTab === 'all-talents' || activeTab === 'active' || activeTab === 'pending' || activeTab === 'my-profiles') && (
            <div className="space-y-6 mt-0">
              {/* Search Section */}
              <div className={`${isDashboardDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 sm:p-6 mb-6 space-y-4`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                  {/* Search Input */}
                  <div className="sm:col-span-1 lg:col-span-6">
                    <Input
                      placeholder="Search talents..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                      className="w-full"
                    />
                  </div>

                  {/* Results Count */}
                  <div className="sm:col-span-1 lg:col-span-6 flex items-center justify-end">
                    <span className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {filteredTalents.length} talents found
                    </span>
                  </div>
                </div>
              </div>

              {/* Talent Cards Grid/List - This is the critical section! */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTalents.map((talent) => (
                    <TalentCard
                      key={talent.id}
                      talent={talent}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleTalentClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTalents.map((talent) => (
                    <TalentCard
                      key={talent.id}
                      talent={talent}
                      isDashboardDarkMode={isDashboardDarkMode}
                      onCardClick={handleTalentClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
