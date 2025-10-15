import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  ArrowLeft, 
  Star, 
  MessageSquare, 
  Share2, 
  Heart, 
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Scale,
  FileText,
  Shield,
  Award,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Building,
  GraduationCap
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';

export interface LegalService {
  id: string;
  firm_name: string;
  lawyer_name: string;
  specialization: string[];
  practice_areas: string[];
  experience_years: number;
  location: string;
  hourly_rate: number;
  consultation_fee: number;
  avatar: string;
  firm_logo?: string;
  description: string;
  credentials: string[];
  bar_admissions: string[];
  languages: string[];
  availability: 'Available' | 'Busy' | 'By Appointment';
  rating: number;
  total_reviews: number;
  successful_cases: number;
  education: string[];
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
  services_offered: {
    name: string;
    description: string;
    price_range: string;
  }[];
  isVerified: boolean;
}

interface LegalDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
}

export const LegalDetailPage: React.FC<LegalDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [legalService, setLegalService] = useState<LegalService | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    loadLegalServiceDetails();
  }, [id]);

  const loadLegalServiceDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleLegalService: LegalService = {
        id: id || 'legal1',
        firm_name: 'Creative Arts Legal Group',
        lawyer_name: 'Jennifer Martinez, Esq.',
        specialization: [
          'Intellectual Property',
          'Entertainment Law',
          'Contract Law',
          'Copyright & Trademark'
        ],
        practice_areas: [
          'Artist Contracts',
          'Gallery Agreements',
          'Licensing Deals',
          'Copyright Registration',
          'Trademark Filing',
          'Royalty Disputes'
        ],
        experience_years: 12,
        location: 'Los Angeles, CA',
        hourly_rate: 450,
        consultation_fee: 150,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        firm_logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
        description: 'Specialized legal counsel for artists, galleries, and creative professionals. With over 12 years of experience in entertainment and intellectual property law, I help clients navigate complex legal challenges in the art world while protecting their creative assets and business interests.',
        credentials: [
          'J.D. Harvard Law School',
          'Licensed in CA, NY, FL',
          'American Bar Association Member',
          'Entertainment Law Section Chair'
        ],
        bar_admissions: ['California', 'New York', 'Federal Courts'],
        languages: ['English', 'Spanish', 'French'],
        availability: 'Available',
        rating: 4.9,
        total_reviews: 47,
        successful_cases: 180,
        education: [
          'J.D., Harvard Law School, magna cum laude',
          'B.A. Art History, UCLA, summa cum laude'
        ],
        contact_info: {
          phone: '+1 (555) 123-4567',
          email: 'j.martinez@creativeartslaw.com',
          website: 'creativeartslaw.com'
        },
        services_offered: [
          {
            name: 'Contract Review & Drafting',
            description: 'Comprehensive review and drafting of artist agreements, gallery contracts, and licensing deals',
            price_range: '$300 - $800'
          },
          {
            name: 'Intellectual Property Protection',
            description: 'Copyright registration, trademark filing, and IP portfolio management',
            price_range: '$500 - $1,500'
          },
          {
            name: 'Business Formation',
            description: 'Entity formation for creative businesses, including LLC and corporation setup',
            price_range: '$800 - $2,000'
          },
          {
            name: 'Dispute Resolution',
            description: 'Mediation, arbitration, and litigation services for creative industry disputes',
            price_range: '$400 - $600/hr'
          }
        ],
        isVerified: true
      };

      setLegalService(sampleLegalService);
    } catch (error) {
      console.error('Error loading legal service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultation = () => {
    if (!user) {
      alert('Please sign in to schedule a consultation');
      return;
    }
    console.log('Scheduling consultation with:', legalService);
    // Handle consultation booking logic here
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-50';
      case 'By Appointment': return 'text-yellow-600 bg-yellow-50';
      case 'Busy': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading legal service details...</div>
        </div>
      </div>
    );
  }

  if (!legalService) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Legal service not found</h2>
          <Button onClick={() => router.push('/legal-services')}>
            Back to Legal Services
          </Button>
        </div>
      </div>
    );
  }

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
              onClick={() => router.push('/dashboard/legal-services')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Legal Services
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20 ring-2 ring-border">
                    <AvatarImage src={legalService.avatar} alt={legalService.lawyer_name} />
                    <AvatarFallback>
                      {legalService.lawyer_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="font-title text-2xl">{legalService.lawyer_name}</h1>
                      {legalService.isVerified && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-lg mb-2">{legalService.firm_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{legalService.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        {legalService.experience_years} years experience
                      </Badge>
                      <Badge variant="outline" className={getAvailabilityColor(legalService.availability)}>
                        {legalService.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {legalService.experience_years}
                    </div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {legalService.successful_cases}+
                    </div>
                    <div className="text-sm text-muted-foreground">Successful Cases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {legalService.rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-title text-primary">
                      {legalService.total_reviews}
                    </div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-title text-lg mb-3">About</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {legalService.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-title text-lg mb-3">Specialization</h3>
                    <div className="flex flex-wrap gap-2">
                      {legalService.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Scale className="h-3 w-3" />
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-title text-lg mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {legalService.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Offered */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">Services Offered</h2>
                <div className="space-y-4">
                  {legalService.services_offered.map((service, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <span className="text-sm font-title text-[#FF8D28]">{service.price_range}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Practice Areas */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-title text-xl mb-4">Practice Areas</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {legalService.practice_areas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credentials & Education */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-title text-lg mb-3">Education & Credentials</h3>
                    <div className="space-y-2">
                      {legalService.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{edu}</span>
                        </div>
                      ))}
                      {legalService.credentials.map((cred, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Award className="h-4 w-4 text-purple-500 mt-0.5" />
                          <span className="text-sm">{cred}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-title text-lg mb-3">Bar Admissions</h3>
                    <div className="space-y-2">
                      {legalService.bar_admissions.map((admission, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{admission}</span>
                        </div>
                      ))}
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
                    <span className="font-medium">{legalService.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({legalService.total_reviews} reviews)
                    </span>
                  </div>

                  <Badge
                    variant={legalService.availability === "Available" ? "default" : "secondary"}
                    className="mb-6"
                  >
                    {legalService.availability}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Hourly Rate</span>
                    </div>
                    <span className="font-title text-lg text-[#FF8D28]">${legalService.hourly_rate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Consultation</span>
                    </div>
                    <span className="font-title text-lg text-[#FF8D28]">${legalService.consultation_fee}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-title text-lg">Contact Information</h3>
                  <div className="space-y-2">
                    {legalService.contact_info.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{legalService.contact_info.phone}</span>
                      </div>
                    )}
                    {legalService.contact_info.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{legalService.contact_info.email}</span>
                      </div>
                    )}
                    {legalService.contact_info.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{legalService.contact_info.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                    onClick={handleConsultation}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

