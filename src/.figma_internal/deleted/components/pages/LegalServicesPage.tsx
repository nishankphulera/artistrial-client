import React, { useState, useEffect } from 'react';
import { Search, Scale, FileText, Shield, Users, Star, Clock, DollarSign, CheckCircle, Upload, Download, MessageCircle, Plus, Eye } from 'lucide-react';
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
import { FavoritesButton } from '../shared/FavoritesButton';
import { RatingSystem } from '../shared/RatingSystem';
import { SearchFilters, FilterConfig, FilterState } from '../shared/SearchFilters';
import { UserProfileLink } from '../shared/UserProfileLink';
import { useAuth } from '../providers/AuthProvider';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface LegalService {
  id: string;
  name: string;
  firm: string;
  specializations: string[];
  experience: number;
  location: string;
  hourly_rate: number;
  rating?: number;
  total_reviews?: number;
  total_cases: number;
  success_rate: number;
  avatar: string;
  description: string;
  is_verified: boolean;
  response_time: string;
  languages: string[];
  service_types: string[];
  availability: 'Available' | 'Busy' | 'Limited';
  consultation_fee?: number;
}

interface LegalResource {
  id: string;
  title: string;
  type: 'Contract Template' | 'Legal Guide' | 'FAQ' | 'Checklist' | 'Form';
  category: string;
  description: string;
  price: number;
  download_count: number;
  rating?: number;
  last_updated: string;
  preview: string;
  file_size?: string;
  pages?: number;
  format: string;
}

interface ServiceRequest {
  serviceType: string;
  urgency: string;
  budget: string;
  description: string;
  documents: File[];
  consultationType: string;
}

interface LegalServicesPageProps {
  isDashboardDarkMode?: boolean;
}

export function LegalServicesPage({ isDashboardDarkMode = false }: LegalServicesPageProps) {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState<LegalService[]>([]);
  const [resources, setResources] = useState<LegalResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('lawyers');
  const [selectedLawyer, setSelectedLawyer] = useState<LegalService | null>(null);
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  const [lawyerFilters, setLawyerFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    location: 'all',
    priceRange: [100, 1000],
    availability: 'all',
    minRating: 0,
    sortBy: 'rating'
  });

  const [resourceFilters, setResourceFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    location: 'all',
    priceRange: [0, 100],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  // Service request state
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest>({
    serviceType: '',
    urgency: '',
    budget: '',
    description: '',
    documents: [],
    consultationType: ''
  });

  const lawyerFilterConfig: FilterConfig = {
    categories: [
      { value: 'Intellectual Property', label: 'Intellectual Property' },
      { value: 'Entertainment Law', label: 'Entertainment Law' },
      { value: 'Contract Law', label: 'Contract Law' },
      { value: 'Digital Rights', label: 'Digital Rights' },
      { value: 'Business Law', label: 'Business Law' },
      { value: 'Copyright Law', label: 'Copyright Law' },
      { value: 'Employment Law', label: 'Employment Law' }
    ],
    locations: [
      { value: 'New York', label: 'New York' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'San Francisco', label: 'San Francisco' },
      { value: 'Chicago', label: 'Chicago' },
      { value: 'Austin', label: 'Austin' },
      { value: 'Remote', label: 'Remote Consultation' }
    ],
    priceRange: { min: 100, max: 1000 },
    availability: true,
    rating: true
  };

  const resourceFilterConfig: FilterConfig = {
    categories: [
      { value: 'Contracts', label: 'Contracts' },
      { value: 'Intellectual Property', label: 'Intellectual Property' },
      { value: 'Digital Rights', label: 'Digital Rights' },
      { value: 'Copyright', label: 'Copyright' },
      { value: 'Photography', label: 'Photography' },
      { value: 'Business Formation', label: 'Business Formation' },
      { value: 'Employment', label: 'Employment' }
    ],
    priceRange: { min: 0, max: 100 }
  };

  useEffect(() => {
    if (activeTab === 'lawyers') {
      loadLawyers();
    } else if (activeTab === 'resources') {
      loadResources();
    }
    loadSampleData();
  }, [activeTab, lawyerFilters, resourceFilters]);

  const loadSampleData = () => {
    const sampleLawyers = [
      {
        id: 'law1',
        name: 'Emily Richardson',
        firm: 'Creative Law Partners',
        specializations: ['Intellectual Property', 'Copyright Law', 'Trademark', 'Licensing'],
        experience: 12,
        location: 'New York, NY',
        hourly_rate: 450,
        rating: 4.9,
        total_reviews: 67,
        total_cases: 234,
        success_rate: 96,
        avatar: '/api/placeholder/150/150',
        description: 'Specialized in protecting creative works and intellectual property for artists, musicians, and content creators.',
        is_verified: true,
        response_time: '< 2 hours',
        languages: ['English', 'Spanish'],
        service_types: ['Legal Consultation', 'Contract Review', 'Copyright Registration', 'Trademark Filing'],
        availability: 'Available',
        consultation_fee: 200
      },
      {
        id: 'law2',
        name: 'Michael Chen',
        firm: 'Digital Rights Legal',
        specializations: ['Digital Rights', 'NFT Law', 'Platform Agreements', 'Privacy Law'],
        experience: 8,
        location: 'San Francisco, CA',
        hourly_rate: 375,
        rating: 4.8,
        total_reviews: 43,
        total_cases: 187,
        success_rate: 94,
        avatar: '/api/placeholder/150/150',
        description: 'Expert in digital media law, blockchain technology, and emerging creative technologies legal frameworks.',
        is_verified: true,
        response_time: '< 4 hours',
        languages: ['English', 'Mandarin'],
        service_types: ['Digital Rights Consultation', 'NFT Legal Review', 'Platform Terms', 'Privacy Compliance'],
        availability: 'Available',
        consultation_fee: 175
      },
      {
        id: 'law3',
        name: 'Sarah Martinez',
        firm: 'Entertainment Law Group',
        specializations: ['Entertainment Law', 'Contract Negotiation', 'Artist Representation', 'Music Law'],
        experience: 15,
        location: 'Los Angeles, CA',
        hourly_rate: 525,
        rating: 4.9,
        total_reviews: 89,
        total_cases: 342,
        success_rate: 98,
        avatar: '/api/placeholder/150/150',
        description: 'Represents artists, musicians, and entertainment industry professionals in contract negotiations and disputes.',
        is_verified: true,
        response_time: '< 1 hour',
        languages: ['English', 'Spanish'],
        service_types: ['Artist Representation', 'Contract Negotiation', 'Entertainment Disputes', 'Music Licensing'],
        availability: 'Busy',
        consultation_fee: 250
      }
    ];

    const sampleResources = [
      {
        id: 'res1',
        title: 'Artist Commission Agreement Template',
        type: 'Contract Template',
        category: 'Contracts',
        description: 'Comprehensive template for commissioned artwork including payment terms, usage rights, and delivery requirements.',
        price: 29,
        download_count: 1250,
        rating: 4.8,
        last_updated: '2024-01-15',
        preview: 'This agreement covers commissioned artwork terms, intellectual property rights, payment schedules...',
        file_size: '2.3 MB',
        pages: 8,
        format: 'PDF + DOCX'
      },
      {
        id: 'res2',
        title: 'Copyright Protection for Digital Artists',
        type: 'Legal Guide',
        category: 'Intellectual Property',
        description: 'Complete guide to understanding and protecting your digital artwork from unauthorized use.',
        price: 0,
        download_count: 3420,
        rating: 4.9,
        last_updated: '2024-01-20',
        preview: 'Learn how to register copyrights, understand fair use, and protect your digital creations...',
        file_size: '5.1 MB',
        pages: 24,
        format: 'PDF'
      },
      {
        id: 'res3',
        title: 'NFT Legal Compliance Checklist',
        type: 'Checklist',
        category: 'Digital Rights',
        description: 'Essential checklist for legal compliance when creating and selling NFTs.',
        price: 15,
        download_count: 890,
        rating: 4.7,
        last_updated: '2024-02-01',
        preview: 'Ensure your NFT project complies with current regulations and best practices...',
        file_size: '1.2 MB',
        pages: 4,
        format: 'PDF + Checklist'
      }
    ];

    setLawyers(sampleLawyers);
    setResources(sampleResources);
  };

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (lawyerFilters.searchTerm) params.append('q', lawyerFilters.searchTerm);
      if (lawyerFilters.category !== 'all') params.append('specialization', lawyerFilters.category);
      if (lawyerFilters.location !== 'all') params.append('location', lawyerFilters.location);
      if (lawyerFilters.availability !== 'all') params.append('availability', lawyerFilters.availability);
      if (lawyerFilters.sortBy) params.append('sort', lawyerFilters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/legal-services?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.services.length > 0) {
          setLawyers(data.services);
        }
      }
    } catch (error) {
      console.error('Error loading lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      // API call would go here
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (lawyerId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/reviews/legal_service/${lawyerId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleScheduleConsultation = (lawyer: LegalService) => {
    if (!user) {
      alert('Please sign in to schedule a consultation');
      return;
    }
    setSelectedLawyer(lawyer);
    setShowConsultationDialog(true);
    loadReviews(lawyer.id);
  };

  const handleSubmitServiceRequest = async () => {
    if (!selectedLawyer || !user) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/legal-requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            lawyer_id: selectedLawyer.id,
            client_id: user.id,
            ...serviceRequest
          }),
        }
      );

      if (response.ok) {
        alert('Service request submitted successfully!');
        setShowRequestDialog(false);
        setServiceRequest({
          serviceType: '',
          urgency: '',
          budget: '',
          description: '',
          documents: [],
          consultationType: ''
        });
      } else {
        alert('Failed to submit service request');
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      alert('Failed to submit service request');
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    if (specialty.includes('Copyright') || specialty.includes('Intellectual Property')) return <Shield className="h-4 w-4" />;
    if (specialty.includes('Contract')) return <FileText className="h-4 w-4" />;
    if (specialty.includes('Entertainment')) return <Users className="h-4 w-4" />;
    return <Scale className="h-4 w-4" />;
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = !lawyerFilters.searchTerm || 
      lawyer.name.toLowerCase().includes(lawyerFilters.searchTerm.toLowerCase()) ||
      lawyer.firm.toLowerCase().includes(lawyerFilters.searchTerm.toLowerCase()) ||
      lawyer.specializations.some(s => s.toLowerCase().includes(lawyerFilters.searchTerm.toLowerCase()));
    
    const matchesSpecialty = lawyerFilters.category === 'all' || 
      lawyer.specializations.some(s => s.includes(lawyerFilters.category));
    const matchesLocation = lawyerFilters.location === 'all' || lawyer.location.includes(lawyerFilters.location);
    const matchesAvailability = lawyerFilters.availability === 'all' || 
      lawyer.availability.toLowerCase() === lawyerFilters.availability.toLowerCase();
    const matchesRating = (lawyer.rating || 0) >= lawyerFilters.minRating;
    const matchesPrice = lawyer.hourly_rate >= lawyerFilters.priceRange[0] && 
      lawyer.hourly_rate <= lawyerFilters.priceRange[1];
    
    return matchesSearch && matchesSpecialty && matchesLocation && 
           matchesAvailability && matchesRating && matchesPrice;
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !resourceFilters.searchTerm || 
      resource.title.toLowerCase().includes(resourceFilters.searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(resourceFilters.searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(resourceFilters.searchTerm.toLowerCase());
    
    const matchesCategory = resourceFilters.category === 'all' || resource.category === resourceFilters.category;
    const matchesPrice = resource.price >= resourceFilters.priceRange[0] && 
      resource.price <= resourceFilters.priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} py-4 sm:py-6 lg:py-8`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Legal Services</h1>
            <p className="text-muted-foreground">
              Connect with legal professionals specializing in creative industries, or access legal resources and templates for artists and creators.
            </p>
          </div>
          {user && (
            <Button onClick={() => setShowRequestDialog(true)} className="flex items-center gap-2 w-full lg:w-auto">
              <Plus className="h-4 w-4" />
              Request Service
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 lg:mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lawyers">Find Lawyers</TabsTrigger>
            <TabsTrigger value="resources">Legal Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="lawyers" className="space-y-6">
            {/* Search and Filters */}
            <SearchFilters
              config={lawyerFilterConfig}
              filters={lawyerFilters}
              onFiltersChange={setLawyerFilters}
              placeholder="Search lawyers, firms, or specialties..."
              resultCount={filteredLawyers.length}
            />

            {/* Lawyers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {filteredLawyers.map((lawyer) => (
                <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                          <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <UserProfileLink 
                              userId={lawyer.id}
                              userName={lawyer.name}
                              prefix=""
                              className="font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors"
                            />
                            {lawyer.is_verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </CardTitle>
                          <p className="text-muted-foreground">{lawyer.firm}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {lawyer.rating && (
                              <>
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{lawyer.rating.toFixed(1)} ({lawyer.total_reviews || 0})</span>
                              </>
                            )}
                            <span className="text-muted-foreground text-sm">• {lawyer.experience} years exp.</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FavoritesButton
                          entityId={lawyer.id}
                          entityType="legal_service"
                          size="sm"
                        />
                        <div className="text-right">
                          <p className="font-medium">${lawyer.hourly_rate}/hr</p>
                          <Badge variant={
                            lawyer.availability === 'Available' ? 'default' :
                            lawyer.availability === 'Busy' ? 'secondary' : 'destructive'
                          }>
                            {lawyer.availability}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{lawyer.total_cases}</p>
                          <p className="text-muted-foreground">Cases</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{lawyer.success_rate}%</p>
                          <p className="text-muted-foreground">Success</p>
                        </div>
                        <div className="text-center flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-1 text-green-600" />
                          <div>
                            <p className="font-medium text-green-600">{lawyer.response_time}</p>
                            <p className="text-muted-foreground">Response</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lawyer.description}
                      </p>

                      {/* Specialties */}
                      <div>
                        <p className="text-sm font-medium mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.specializations.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                              {getSpecialtyIcon(specialty)}
                              {specialty}
                            </Badge>
                          ))}
                          {lawyer.specializations.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{lawyer.specializations.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Service Types */}
                      <div>
                        <p className="text-sm font-medium mb-2">Services</p>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.service_types?.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {lawyer.service_types && lawyer.service_types.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lawyer.service_types.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedLawyer(lawyer);
                            loadReviews(lawyer.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handleScheduleConsultation(lawyer)}
                          disabled={lawyer.availability === 'Unavailable'}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Consult
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* Search and Filters */}
            <SearchFilters
              config={resourceFilterConfig}
              filters={resourceFilters}
              onFiltersChange={setResourceFilters}
              placeholder="Search legal resources..."
              resultCount={filteredResources.length}
            />

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">{resource.type}</Badge>
                        <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{resource.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FavoritesButton
                          entityId={resource.id}
                          entityType="legal_service"
                          size="sm"
                        />
                        <div className="text-right">
                          {resource.price === 0 ? (
                            <Badge variant="default">Free</Badge>
                          ) : (
                            <p className="font-medium">${resource.price}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>

                      {/* File Info */}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>{resource.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{resource.file_size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pages:</span>
                          <span>{resource.pages}</span>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                        <p className="text-sm line-clamp-2">{resource.preview}</p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        {resource.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            <span>{resource.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="text-muted-foreground">
                          {resource.download_count} downloads
                        </div>
                      </div>

                      {/* Last Updated */}
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(resource.last_updated).toLocaleDateString()}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedResource(resource)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          {resource.price === 0 ? 'Free' : `$${resource.price}`}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Loading and Empty States */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}

        {/* Empty States */}
        {!loading && activeTab === 'lawyers' && filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <Scale className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No lawyers found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => setLawyerFilters({
                searchTerm: '',
                category: 'all',
                location: 'all',
                priceRange: [100, 1000],
                availability: 'all',
                minRating: 0,
                sortBy: 'rating'
              })}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {!loading && activeTab === 'resources' && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No legal resources found matching your search.</p>
            <Button 
              variant="outline" 
              onClick={() => setResourceFilters({
                searchTerm: '',
                category: 'all',
                location: 'all',
                priceRange: [0, 100],
                availability: 'all',
                minRating: 0,
                sortBy: 'newest'
              })}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Lawyer Profile Dialog */}
        {selectedLawyer && !showConsultationDialog && (
          <Dialog 
            open={!!selectedLawyer} 
            onOpenChange={() => setSelectedLawyer(null)}
          >
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedLawyer.avatar} alt={selectedLawyer.name} />
                    <AvatarFallback>{selectedLawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="flex items-center gap-2">
                      {selectedLawyer.name}
                      {selectedLawyer.is_verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </h2>
                    <p className="text-muted-foreground">{selectedLawyer.firm}</p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  View this legal professional's profile, specializations, experience, and consultation options.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">About</h3>
                    <p className="text-muted-foreground mb-4">{selectedLawyer.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Scale className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedLawyer.experience} years experience
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        ${selectedLawyer.hourly_rate}/hour
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        Response time: {selectedLawyer.response_time}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Specializations</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedLawyer.specializations.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {getSpecialtyIcon(specialty)}
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="font-medium mb-3">Services</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedLawyer.service_types?.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-medium mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLawyer.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <RatingSystem
                  entityId={selectedLawyer.id}
                  entityType="legal_service"
                  averageRating={selectedLawyer.rating || 0}
                  totalReviews={selectedLawyer.total_reviews || 0}
                  reviews={reviews}
                  canReview={!!user && user.id !== selectedLawyer.id}
                />

                <div className="flex gap-4 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => handleScheduleConsultation(selectedLawyer)}
                    disabled={selectedLawyer.availability === 'Unavailable'}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {selectedLawyer.consultation_fee ? `Schedule Consultation ($${selectedLawyer.consultation_fee})` : 'Schedule Consultation'}
                  </Button>
                  <FavoritesButton
                    entityId={selectedLawyer.id}
                    entityType="legal_service"
                    size="lg"
                    variant="outline"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Consultation Dialog */}
        <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Consultation with {selectedLawyer?.name}</DialogTitle>
              <DialogDescription>
                Provide details about your legal needs to schedule a consultation with this legal professional.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Consultation Type</Label>
                  <Select 
                    value={serviceRequest.consultationType} 
                    onValueChange={(value) => setServiceRequest({...serviceRequest, consultationType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">Initial Consultation</SelectItem>
                      <SelectItem value="contract_review">Contract Review</SelectItem>
                      <SelectItem value="legal_advice">Legal Advice</SelectItem>
                      <SelectItem value="document_drafting">Document Drafting</SelectItem>
                      <SelectItem value="dispute">Dispute Resolution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Urgency</Label>
                  <Select 
                    value={serviceRequest.urgency} 
                    onValueChange={(value) => setServiceRequest({...serviceRequest, urgency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Within 2 weeks</SelectItem>
                      <SelectItem value="medium">Medium - Within 1 week</SelectItem>
                      <SelectItem value="high">High - Within 3 days</SelectItem>
                      <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Budget Range</Label>
                <Input 
                  placeholder="e.g., $500 - $2000"
                  value={serviceRequest.budget}
                  onChange={(e) => setServiceRequest({...serviceRequest, budget: e.target.value})}
                />
              </div>

              <div>
                <Label>Case Description</Label>
                <Textarea 
                  placeholder="Describe your legal needs, situation, and specific questions..."
                  value={serviceRequest.description}
                  onChange={(e) => setServiceRequest({...serviceRequest, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label>Supporting Documents (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload contracts, emails, or other relevant documents
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX up to 10MB each
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSubmitServiceRequest}
                  className="flex-1"
                  disabled={!serviceRequest.consultationType || !serviceRequest.description}
                >
                  Submit Request
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowConsultationDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Resource Preview Dialog */}
        {selectedResource && (
          <Dialog 
            open={!!selectedResource} 
            onOpenChange={() => setSelectedResource(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedResource.title}</DialogTitle>
                <DialogDescription>
                  Preview and purchase this legal resource document or template.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{selectedResource.type}</Badge>
                  <span className="font-medium">
                    {selectedResource.price === 0 ? 'Free' : `$${selectedResource.price}`}
                  </span>
                </div>

                <p className="text-muted-foreground">{selectedResource.description}</p>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Preview</h4>
                  <p className="text-sm">{selectedResource.preview}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span>{selectedResource.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{selectedResource.file_size}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pages:</span>
                      <span>{selectedResource.pages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span>{selectedResource.download_count}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {selectedResource.price === 0 ? 'Download Free' : `Purchase for $${selectedResource.price}`}
                  </Button>
                  <FavoritesButton
                    entityId={selectedResource.id}
                    entityType="legal_service"
                    size="lg"
                    variant="outline"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

