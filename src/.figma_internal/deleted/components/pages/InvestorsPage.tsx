import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, Users, Building, Globe, Calendar, ArrowUpRight, Plus, MessageCircle, Eye, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { FavoritesButton } from '../shared/FavoritesButton';
import { SearchFilters, FilterConfig, FilterState } from '../shared/SearchFilters';
import { InvestorSearchFilters } from '../shared/InvestorSearchFilters';
import { InvestorCard } from '../shared/InvestorCard';
import { UserProfileLink } from '../shared/UserProfileLink';
import { useAuth } from '../providers/AuthProvider';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FilterSidebar, FilterConfig as FilterSidebarConfig } from '../shared/FilterSidebar';
import {
  useInvestorData,
  InvestorProfile,
  InvestorFilters,
  investorFilterConfig
} from '../shared/data/InvestorDataService';

interface Investor {
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

interface Project {
  id: string;
  title: string;
  company: string;
  creator_name: string;
  stage: string;
  funding_goal: number;
  funding_raised: number;
  investor_count: number;
  category: string;
  description: string;
  pitch_deck?: string;
  business_plan?: string;
  financial_projections?: string;
  team_info?: string;
  images: string[];
  deadline?: string;
  minimum_investment?: number;
  expected_returns?: string;
  equity_offered?: string;
  location: string;
}

interface InvestorsPageProps {
  isDashboardDarkMode?: boolean;
}

export function InvestorsPage({ isDashboardDarkMode = false }: InvestorsPageProps) {
  const { user } = useAuth();
  const { fetchInvestorProfiles } = useInvestorData();
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('investors');

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  
  const [investorFilters, setInvestorFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [1000, 10000000],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  const [projectFilters, setProjectFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    location: 'all',
    priceRange: [10000, 5000000],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  // Messaging state
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const filterConfig: FilterSidebarConfig = investorFilterConfig;

  const projectFilterConfig: FilterConfig = {
    categories: [
      { value: 'Digital Art', label: 'Digital Art' },
      { value: 'Photography', label: 'Photography' },
      { value: 'Music', label: 'Music' },
      { value: 'Film', label: 'Film & Video' },
      { value: 'Gaming', label: 'Gaming' },
      { value: 'Technology', label: 'Art Technology' },
      { value: 'Education', label: 'Art Education' },
      { value: 'Marketplace', label: 'Art Marketplace' }
    ],
    locations: [
      { value: 'San Francisco', label: 'San Francisco' },
      { value: 'New York', label: 'New York' },
      { value: 'London', label: 'London' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'Remote', label: 'Remote' }
    ],
    priceRange: { min: 10000, max: 5000000 },
    customFilters: [
      {
        name: 'stage',
        options: [
          { value: 'Pre-Seed', label: 'Pre-Seed' },
          { value: 'Seed', label: 'Seed' },
          { value: 'Series A', label: 'Series A' },
          { value: 'Series B', label: 'Series B' }
        ]
      }
    ]
  };

  useEffect(() => {
    if (activeTab === 'investors') {
      loadInvestors();
    } else {
      loadProjects();
    }
  }, [activeTab, investorFilters, projectFilters]);

  const loadInvestors = async () => {
    try {
      setLoading(true);
      
      // Convert FilterState to InvestorFilters
      const investorFiltersConverted: InvestorFilters = {
        searchTerm: investorFilters.searchTerm,
        category: Array.isArray(investorFilters.category) ? investorFilters.category : [],
        subcategory: Array.isArray(investorFilters.subcategory) ? investorFilters.subcategory : [],
        location: investorFilters.location,
        priceRange: investorFilters.priceRange,
        availability: investorFilters.availability,
        minRating: investorFilters.minRating,
        sortBy: investorFilters.sortBy,
      };

      // Use the unified data service
      const data = await fetchInvestorProfiles(investorFiltersConverted, {
        context: 'public',
        userId: user?.id,
      });

      setInvestors(data);
    } catch (error) {
      console.error('Error loading investors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (projectFilters.searchTerm) params.append('q', projectFilters.searchTerm);
      if (projectFilters.category !== 'all') params.append('category', projectFilters.category);
      if (projectFilters.sortBy) params.append('sort', projectFilters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/projects?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.projects.length > 0) {
          setProjects(data.projects);
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectInvestor = (investor: InvestorProfile) => {
    if (!user) {
      alert('Please sign in to connect with investors');
      return;
    }
    // Navigate to direct messaging or profile page instead of popup
    window.location.href = `/profile/${investor.id}`;
  };

  // Investors are already filtered by the data service
  const filteredInvestors = investors;

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !projectFilters.searchTerm || 
      project.title.toLowerCase().includes(projectFilters.searchTerm.toLowerCase()) ||
      project.company.toLowerCase().includes(projectFilters.searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(projectFilters.searchTerm.toLowerCase());
    
    const matchesCategory = projectFilters.category === 'all' || project.category === projectFilters.category;
    const matchesLocation = projectFilters.location === 'all' || project.location.includes(projectFilters.location);
    const matchesPrice = project.funding_goal >= projectFilters.priceRange[0] && 
      project.funding_goal <= projectFilters.priceRange[1];
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {/* Filter Sidebar - only show for investors tab */}
        {activeTab === 'investors' && (
          <FilterSidebar
            config={filterConfig}
            filters={investorFilters}
            onFiltersChange={setInvestorFilters}
            resultCount={filteredInvestors.length}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide ${activeTab !== 'investors' ? 'w-full' : ''}`}>
          {/* Header */}
          <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Investors Connect</h1>
              <p className="text-muted-foreground">
                Connect with investors interested in creative industries, or discover investment opportunities in innovative art and media companies.
              </p>
            </div>
            {user && (
              <Button onClick={() => setShowCreateProject(true)} className="flex items-center gap-2 w-full lg:w-auto">
                <Plus className="h-4 w-4" />
                Post Project
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 lg:mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="investors">Find Investors</TabsTrigger>
              <TabsTrigger value="projects">Investment Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="investors" className="space-y-6">
              {/* Search and Category Section */}
              <InvestorSearchFilters
                filters={investorFilters}
                onFiltersChange={setInvestorFilters}
                isDarkMode={isDashboardDarkMode}
                resultCount={filteredInvestors.length}
              />

              {/* Investors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredInvestors.map((investor) => (
                  <InvestorCard
                    key={investor.id}
                    investorProfile={investor}
                    isDashboardDarkMode={isDashboardDarkMode}
                    onCardClick={() => window.location.href = `/investors/${investor.id}`}
                    onConnect={() => handleConnectInvestor(investor)}
                  />
                ))}
              </div>

              {/* Empty state */}
              {filteredInvestors.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No investors found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {/* Search and Filters */}
              <SearchFilters
                config={projectFilterConfig}
                filters={projectFilters}
                onFiltersChange={setProjectFilters}
                placeholder="Search projects, companies, or categories..."
                resultCount={filteredProjects.length}
              />

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback 
                        src={project.images[0]} 
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
                      <CardTitle className="text-lg">{project.title}</CardTitle>
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
                            onClick={() => setSelectedProject(project)}
                          >
                            Learn More
                          </Button>
                          <Button className="flex-1">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Invest
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty state for projects */}
              {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No investment opportunities found matching your search.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setProjectFilters({
                      searchTerm: '',
                      category: 'all',
                      location: 'all',
                      priceRange: [10000, 5000000],
                      availability: 'all',
                      minRating: 0,
                      sortBy: 'newest'
                    })}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Loading States */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}

          {/* Create Project Dialog */}
          <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post Investment Opportunity</DialogTitle>
                <DialogDescription>
                  Share your project with potential investors.
                </DialogDescription>
              </DialogHeader>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Project creation form would go here...
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

