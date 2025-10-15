import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Star, 
  MessageSquare, 
  Share2, 
  Heart, 
  DollarSign,
  TrendingUp,
  Building,
  Globe,
  Users,
  Calendar,
  CheckCircle,
  Target,
  Briefcase,
  Award,
  PieChart,
  Zap
} from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { Investor, Project } from '../shared/InvestorCard';

interface InvestorDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
  type?: 'investor' | 'project';
}

export const InvestorDetailPage: React.FC<InvestorDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false,
  type = 'investor'
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    if (type === 'investor') {
      loadInvestorDetails();
    } else {
      loadProjectDetails();
    }
  }, [id, type]);

  const loadInvestorDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleInvestor: Investor = {
        id: id || 'investor1',
        name: 'David Chen',
        company: 'Creative Ventures Capital',
        type: 'VC Fund',
        location: 'San Francisco, CA',
        investmentRange: '$50K - $2M',
        focus: [
          'Digital Art',
          'NFT Platforms',
          'Creative Tools',
          'Art Marketplaces',
          'VR/AR Art',
          'Blockchain Art'
        ],
        portfolio: [
          'ArtBlocks',
          'SuperRare',
          'Foundation',
          'AsyncArt',
          'KnownOrigin'
        ],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        description: 'Experienced investor focusing on the intersection of art, technology, and blockchain. I have been actively investing in creative platforms and digital art initiatives for over 8 years, with a particular interest in emerging artists and innovative art technologies.',
        previousInvestments: 47,
        totalFunding: '$125M',
        stage: 'All Stages',
        isActive: true,
        rating: 4.8,
        total_reviews: 23,
        contact_info: {
          email: 'david@creativevc.com',
          linkedin: 'davidchen-cvc',
          website: 'creativeventures.com'
        }
      };

      setInvestor(sampleInvestor);
    } catch (error) {
      console.error('Error loading investor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleProject: Project = {
        id: id || 'project1',
        title: 'ArtFlow - AI-Powered Art Creation Platform',
        company: 'ArtFlow Technologies',
        creator_name: 'Sarah Kim',
        creator_id: 'creator123',
        stage: 'Series A',
        funding_goal: 2000000,
        funding_raised: 1250000,
        investor_count: 15,
        category: 'Art Technology',
        description: 'Revolutionary AI-powered platform that democratizes art creation by enabling users to generate, modify, and collaborate on digital artworks using cutting-edge machine learning algorithms.',
        images: [
          'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=800&h=400&fit=crop'
        ],
        deadline: '2024-06-30',
        minimum_investment: 10000,
        expected_returns: '3-5x in 5 years',
        equity_offered: '15%',
        location: 'New York, NY'
      };

      setProject(sampleProject);
    } catch (error) {
      console.error('Error loading project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (!user) {
      alert('Please sign in to connect');
      return;
    }
    console.log('Connecting with investor:', investor);
    // Handle connect logic here
  };

  const handleInvest = () => {
    if (!user) {
      alert('Please sign in to invest');
      return;
    }
    console.log('Investing in project:', project);
    // Handle investment logic here
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading {type} details...</div>
        </div>
      </div>
    );
  }

  if (type === 'investor' && !investor) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Investor not found</h2>
          <Button onClick={() => router.push('/investors')}>
            Back to Investors
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'project' && !project) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Project not found</h2>
          <Button onClick={() => router.push('/investors')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  // Investor Detail View
  if (type === 'investor' && investor) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
        
        {/* Header - Only show if not in dashboard context */}
        {!isInDashboard && (
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${isInDashboard ? 'p-4 sm:p-6 lg:p-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
          {/* Dashboard Back Button */}
          {isInDashboard && (
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/investors')}
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Investors
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-20 w-20 ring-2 ring-border">
                      <AvatarImage src={investor.avatar} alt={investor.name} />
                      <AvatarFallback>
                        {investor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="font-title text-2xl">{investor.name}</h1>
                        {investor.isActive && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-lg mb-2">{investor.company}</p>
                      <Badge variant="outline">{investor.type}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {investor.previousInvestments}
                      </div>
                      <div className="text-sm text-muted-foreground">Investments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {investor.totalFunding}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Managed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {investor.rating?.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {investor.total_reviews}
                      </div>
                      <div className="text-sm text-muted-foreground">Reviews</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-title text-lg mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {investor.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-title text-lg mb-3">Investment Focus</h3>
                      <div className="flex flex-wrap gap-2">
                        {investor.focus.map((area, index) => (
                          <Badge key={index} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-title text-lg mb-3">Portfolio Companies</h3>
                      <div className="space-y-2">
                        {investor.portfolio.slice(0, 5).map((company, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{company}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Criteria */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-title text-xl mb-4">Investment Criteria</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Investment Range</div>
                          <div className="text-sm text-muted-foreground">{investor.investmentRange}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Stage Focus</div>
                          <div className="text-sm text-muted-foreground">{investor.stage}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm text-muted-foreground">{investor.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Status</div>
                          <div className="text-sm text-muted-foreground">
                            {investor.isActive ? 'Actively Investing' : 'Not Currently Active'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{investor.rating?.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({investor.total_reviews} reviews)
                      </span>
                    </div>

                    <Badge
                      variant={investor.isActive ? "default" : "secondary"}
                      className="mb-6"
                    >
                      {investor.isActive ? 'Actively Investing' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Investment Range</span>
                      </div>
                      <span className="font-medium text-[#FF8D28]">{investor.investmentRange}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Managed</span>
                      </div>
                      <span className="font-medium">{investor.totalFunding}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                      onClick={handleConnect}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Connect with {investor.name.split(' ')[0]}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Briefcase className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Project Detail View
  if (type === 'project' && project) {
    const fundingProgress = (project.funding_raised / project.funding_goal) * 100;
    
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
        
        {/* Header - Only show if not in dashboard context */}
        {!isInDashboard && (
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${isInDashboard ? 'p-4 sm:p-6 lg:p-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
          {/* Dashboard Back Button */}
          {isInDashboard && (
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/investors')}
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <Card className="overflow-hidden">
                <ImageWithFallback
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-64 lg:h-80 object-cover"
                />
              </Card>

              {/* About Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline">{project.category}</Badge>
                    <Badge variant="secondary">{project.stage}</Badge>
                  </div>
                  
                  <h1 className="font-title text-2xl mb-2">{project.title}</h1>
                  <p className="text-muted-foreground text-lg mb-6">{project.company}</p>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        ${project.funding_raised.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Raised</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        ${project.funding_goal.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Goal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {project.investor_count}
                      </div>
                      <div className="text-sm text-muted-foreground">Investors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {fundingProgress.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Images */}
              {project.images.length > 1 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-title text-xl mb-4">Project Gallery</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {project.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-video overflow-hidden rounded-lg">
                          <ImageWithFallback
                            src={image}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Investment Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h2 className="font-title text-xl mb-4">Investment Opportunity</h2>
                    
                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Funding Progress</span>
                        <span>{fundingProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={fundingProgress} className="h-3" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Min Investment</span>
                      </div>
                      <span className="font-title text-lg text-[#FF8D28]">
                        ${project.minimum_investment?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Expected Returns</span>
                      </div>
                      <span className="font-medium text-green-600">{project.expected_returns}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Equity Offered</span>
                      </div>
                      <span className="font-medium">{project.equity_offered}</span>
                    </div>

                    {project.deadline && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Deadline</span>
                        </div>
                        <span className="font-medium">
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                      onClick={handleInvest}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Invest Now
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Founder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

