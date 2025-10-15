import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { ChevronDown, Users, Clock, MapPin, DollarSign, Plus, Send } from 'lucide-react';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { toast } from 'sonner';
import { CollaborationOverview } from '../CollaborationOverview';

interface CollaborationRequirement {
  id: string;
  collaborationId: string;
  role: string;
  quantityNeeded: number;
  quantityFilled: number;
  budget?: string;
  timing?: string;
  location?: string;
  skills?: string[];
  description?: string;
  status: 'open' | 'closed';
  applications?: Application[];
}

interface Collaboration {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
  requirements: CollaborationRequirement[];
}

interface Application {
  id: string;
  requirementId: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

interface CollaborationsPageProps {
  isDashboardDarkMode?: boolean;
}

export function CollaborationsPage({ isDashboardDarkMode = false }: CollaborationsPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'browse');
  const [openRequirements, setOpenRequirements] = useState<Set<string>>(new Set());
  const [applicationMessages, setApplicationMessages] = useState<Record<string, string>>({});
  const [showingApplicationForm, setShowingApplicationForm] = useState<string | null>(null);

  // Dummy collaboration data
  const dummyCollaborations: Collaboration[] = [
    {
      id: 'collab-1',
      title: 'Fashion Photography Campaign',
      description: 'Creating a high-end fashion photography series for a luxury brand launch. Looking for creative professionals to bring this vision to life.',
      creatorId: 'user-1',
      createdAt: '2024-12-01T10:00:00Z',
      status: 'active',
      requirements: [
        {
          id: 'req-1',
          collaborationId: 'collab-1',
          role: 'Fashion Photographer',
          quantityNeeded: 1,
          quantityFilled: 0,
          budget: '$2,000 - $3,500',
          timing: 'Next 2 weeks',
          location: 'New York City',
          skills: ['Fashion Photography', 'Studio Lighting', 'Post-Production'],
          description: 'Lead photographer for luxury fashion campaign. Must have experience with high-end fashion brands and studio work.',
          status: 'open',
          applications: [
            {
              id: 'app-1',
              requirementId: 'req-1',
              applicantId: 'user-2',
              applicantName: 'Sarah Chen',
              message: 'I have 5 years of experience in fashion photography and have worked with brands like Versace and Prada. My portfolio showcases luxury fashion work.',
              status: 'pending',
              appliedAt: '2024-12-02T14:30:00Z'
            }
          ]
        },
        {
          id: 'req-2',
          collaborationId: 'collab-1',
          role: 'Hair & Makeup Artist',
          quantityNeeded: 2,
          quantityFilled: 1,
          budget: '$800 - $1,200',
          timing: 'Next 2 weeks',
          location: 'New York City',
          skills: ['Fashion Makeup', 'Hair Styling', 'Editorial Work'],
          description: 'Creative makeup and hair styling for luxury fashion shoot.',
          status: 'open',
          applications: []
        }
      ]
    },
    {
      id: 'collab-2',
      title: 'Music Video Production',
      description: 'Indie music video project for an upcoming single. Seeking talented individuals for a creative and artistic music video.',
      creatorId: 'user-3',
      createdAt: '2024-11-28T15:20:00Z',
      status: 'active',
      requirements: [
        {
          id: 'req-3',
          collaborationId: 'collab-2',
          role: 'Video Editor',
          quantityNeeded: 1,
          quantityFilled: 0,
          budget: '$1,500 - $2,500',
          timing: 'January 2025',
          location: 'Remote',
          skills: ['Video Editing', 'Color Grading', 'Motion Graphics'],
          description: 'Post-production for indie music video. Creative editing and visual effects required.',
          status: 'open',
          applications: [
            {
              id: 'app-2',
              requirementId: 'req-3',
              applicantId: 'user-4',
              applicantName: 'Marcus Rodriguez',
              message: 'I specialize in music video editing and have worked with several indie artists. I can bring creative visual storytelling to your project.',
              status: 'pending',
              appliedAt: '2024-11-30T09:15:00Z'
            },
            {
              id: 'app-3',
              requirementId: 'req-3',
              applicantId: 'user-5',
              applicantName: 'Emma Thompson',
              message: 'Music video editor with 3+ years experience. I love working on indie projects and can provide motion graphics as well.',
              status: 'pending',
              appliedAt: '2024-12-01T11:45:00Z'
            }
          ]
        },
        {
          id: 'req-4',
          collaborationId: 'collab-2',
          role: 'Cinematographer',
          quantityNeeded: 1,
          quantityFilled: 1,
          budget: '$2,000 - $3,000',
          timing: 'December 2024',
          location: 'Los Angeles',
          skills: ['Cinematography', 'Camera Operation', 'Lighting'],
          description: 'Creative cinematography for indie music video.',
          status: 'closed',
          applications: []
        }
      ]
    },
    {
      id: 'collab-3',
      title: 'Art Gallery Exhibition',
      description: 'Collaborative art exhibition featuring emerging digital artists. Creating an immersive gallery experience.',
      creatorId: 'user-6',
      createdAt: '2024-11-25T12:00:00Z',
      status: 'active',
      requirements: [
        {
          id: 'req-5',
          collaborationId: 'collab-3',
          role: 'Digital Artist',
          quantityNeeded: 5,
          quantityFilled: 2,
          budget: '$500 - $1,000 per piece',
          timing: 'February 2025',
          location: 'Miami',
          skills: ['Digital Art', 'NFT Creation', 'Interactive Media'],
          description: 'Digital artworks for gallery exhibition. Looking for innovative and contemporary pieces.',
          status: 'open',
          applications: []
        },
        {
          id: 'req-6',
          collaborationId: 'collab-3',
          role: 'Curator',
          quantityNeeded: 1,
          quantityFilled: 0,
          budget: '$3,000 - $5,000',
          timing: 'January - March 2025',
          location: 'Miami',
          skills: ['Art Curation', 'Gallery Management', 'Art History'],
          description: 'Lead curator for digital art exhibition. Experience with contemporary art required.',
          status: 'open',
          applications: [
            {
              id: 'app-4',
              requirementId: 'req-6',
              applicantId: 'user-7',
              applicantName: 'Dr. Jennifer Adams',
              message: 'Art historian and curator with expertise in digital and contemporary art. I have curated 15+ exhibitions in major galleries.',
              status: 'pending',
              appliedAt: '2024-11-29T16:20:00Z'
            }
          ]
        }
      ]
    },
    {
      id: 'collab-4',
      title: 'Documentary Film Project',
      description: 'Environmental documentary about ocean conservation. Seeking passionate collaborators to tell an important story.',
      creatorId: 'user-8',
      createdAt: '2024-11-20T08:30:00Z',
      status: 'completed',
      requirements: [
        {
          id: 'req-7',
          collaborationId: 'collab-4',
          role: 'Sound Engineer',
          quantityNeeded: 1,
          quantityFilled: 1,
          budget: '$2,500 - $4,000',
          timing: 'Completed',
          location: 'Various',
          skills: ['Sound Recording', 'Audio Post-Production', 'Field Recording'],
          description: 'Professional sound recording and post-production for documentary.',
          status: 'closed',
          applications: []
        }
      ]
    },
    {
      id: 'collab-5',
      title: 'Brand Identity Design',
      description: 'Complete brand identity for sustainable fashion startup. Looking for creative minds to build a meaningful brand.',
      creatorId: 'user-9',
      createdAt: '2024-12-03T14:00:00Z',
      status: 'active',
      requirements: [
        {
          id: 'req-8',
          collaborationId: 'collab-5',
          role: 'Graphic Designer',
          quantityNeeded: 1,
          quantityFilled: 0,
          budget: '$3,000 - $5,000',
          timing: 'Next month',
          location: 'Remote',
          skills: ['Brand Design', 'Logo Design', 'Typography'],
          description: 'Complete brand identity including logo, typography, and visual guidelines.',
          status: 'open',
          applications: []
        },
        {
          id: 'req-9',
          collaborationId: 'collab-5',
          role: 'Web Designer',
          quantityNeeded: 1,
          quantityFilled: 0,
          budget: '$2,000 - $3,500',
          timing: 'Next month',
          location: 'Remote',
          skills: ['Web Design', 'UI/UX', 'Responsive Design'],
          description: 'E-commerce website design that aligns with the new brand identity.',
          status: 'open',
          applications: [
            {
              id: 'app-5',
              requirementId: 'req-9',
              applicantId: 'user-10',
              applicantName: 'Alex Kim',
              message: 'UI/UX designer specializing in e-commerce and sustainable brands. I understand the importance of purpose-driven design.',
              status: 'pending',
              appliedAt: '2024-12-04T10:30:00Z'
            }
          ]
        }
      ]
    }
  ];

  const fetchCollaborations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations`,
        {
          headers: {
            'Authorization': `Bearer ${token || publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Use dummy data if no real data is available
        setCollaborations(data.collaborations && data.collaborations.length > 0 ? data.collaborations : dummyCollaborations);
      } else {
        console.error('Failed to fetch collaborations');
        // Fall back to dummy data
        setCollaborations(dummyCollaborations);
      }
    } catch (error) {
      console.error('Error fetching collaborations:', error);
      // Fall back to dummy data
      setCollaborations(dummyCollaborations);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCollaborations = async () => {
    if (!user) return;
    
    // Dummy user collaborations data
    const dummyUserCollaborations: Collaboration[] = [
      {
        id: 'user-collab-1',
        title: 'Wedding Photography Portfolio',
        description: 'Building a comprehensive wedding photography portfolio with a team of creative professionals.',
        creatorId: user.id,
        createdAt: '2024-11-15T09:00:00Z',
        status: 'active',
        requirements: [
          {
            id: 'user-req-1',
            collaborationId: 'user-collab-1',
            role: 'Second Photographer',
            quantityNeeded: 1,
            quantityFilled: 0,
            budget: '$500 - $800',
            timing: 'Next weekend',
            location: 'San Francisco',
            skills: ['Wedding Photography', 'Candid Photography'],
            description: 'Assistant photographer for wedding shoots.',
            status: 'open',
            applications: [
              {
                id: 'user-app-1',
                requirementId: 'user-req-1',
                applicantId: 'applicant-1',
                applicantName: 'Maria Garcia',
                message: 'I have experience as a second shooter and would love to collaborate on wedding photography.',
                status: 'pending',
                appliedAt: '2024-11-20T14:00:00Z'
              },
              {
                id: 'user-app-2',
                requirementId: 'user-req-1',
                applicantId: 'applicant-2',
                applicantName: 'James Wilson',
                message: 'Wedding photographer with 2 years experience. Great at capturing candid moments.',
                status: 'pending',
                appliedAt: '2024-11-21T16:30:00Z'
              }
            ]
          }
        ]
      }
    ];
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/user/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Use dummy data if no real data is available
        setCollaborations(data.collaborations && data.collaborations.length > 0 ? data.collaborations : dummyUserCollaborations);
      } else {
        console.error('Failed to fetch user collaborations');
        // Fall back to dummy data
        setCollaborations(dummyUserCollaborations);
      }
    } catch (error) {
      console.error('Error fetching user collaborations:', error);
      // Fall back to dummy data
      setCollaborations(dummyUserCollaborations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchCollaborations();
    } else if (activeTab === 'my-projects' && user) {
      fetchUserCollaborations();
    }
  }, [activeTab, user]);

  const toggleRequirement = (requirementId: string) => {
    const newOpen = new Set(openRequirements);
    if (newOpen.has(requirementId)) {
      newOpen.delete(requirementId);
    } else {
      newOpen.add(requirementId);
    }
    setOpenRequirements(newOpen);
  };

  const handleApply = async (requirement: CollaborationRequirement) => {
    if (!user) {
      toast.error('Please sign in to apply for collaborations');
      return;
    }

    const message = applicationMessages[requirement.id] || '';
    if (!message.trim()) {
      toast.error('Please write an application message');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/${requirement.collaborationId}/requirements/${requirement.id}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setApplicationMessages(prev => ({ ...prev, [requirement.id]: '' }));
        setShowingApplicationForm(null);
        if (activeTab === 'browse') {
          fetchCollaborations();
        } else {
          fetchUserCollaborations();
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    }
  };

  const handleApplicationAction = async (collaborationId: string, requirementId: string, applicationId: string, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/${collaborationId}/requirements/${requirementId}/applications/${applicationId}/${action}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`Application ${action}ed successfully!`);
        fetchUserCollaborations();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${action} application`);
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast.error(`Failed to ${action} application`);
    }
  };

  const getProgressPercentage = (filled: number, needed: number) => {
    return Math.round((filled / needed) * 100);
  };

  const canApply = (requirement: CollaborationRequirement) => {
    if (!user) return false;
    if (requirement.status === 'closed') return false;
    if (requirement.quantityFilled >= requirement.quantityNeeded) return false;
    
    // Check if user already applied
    const userApplication = requirement.applications?.find(app => app.applicantId === user.id);
    return !userApplication;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isDashboardDarkMode ? 'bg-[#171717] text-white' : ''}`}>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-title text-3xl mb-2">Collaborations</h1>
            <p className="text-muted-foreground">
              Find creative collaborators and join exciting projects in the art community.
            </p>
          </div>
          {user && (
            <Button onClick={() => router.push('/collaborations/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="my-applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {!user && (
            <CollaborationOverview />
          )}
          
          {collaborations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-title text-lg mb-2">No Projects Available</h3>
                <p className="text-muted-foreground">
                  {!user 
                    ? 'Sign in to view and apply for collaboration projects!'
                    : 'No collaboration projects are currently available. Check back later!'
                  }
                </p>
                {!user && (
                  <Button className="mt-4" onClick={() => window.location.href = '/auth'}>
                    Sign In to Get Started
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {collaborations.map((collaboration) => (
                <Card key={collaboration.id}>
                  <CardHeader>
                    <CardTitle className="font-title text-xl">{collaboration.title}</CardTitle>
                    {collaboration.description && (
                      <p className="text-muted-foreground">{collaboration.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collaboration.requirements.map((requirement) => (
                      <Collapsible
                        key={requirement.id}
                        open={openRequirements.has(requirement.id)}
                        onOpenChange={() => toggleRequirement(requirement.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-semibold">{requirement.role}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{requirement.quantityFilled} of {requirement.quantityNeeded} filled</span>
                                </div>
                              </div>
                              <Progress 
                                value={getProgressPercentage(requirement.quantityFilled, requirement.quantityNeeded)} 
                                className="w-24" 
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={requirement.status === 'open' ? 'default' : 'secondary'}>
                                {requirement.status}
                              </Badge>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <div className="space-y-3">
                            {requirement.description && (
                              <p className="text-sm">{requirement.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {requirement.budget && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{requirement.budget}</span>
                                </div>
                              )}
                              {requirement.timing && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{requirement.timing}</span>
                                </div>
                              )}
                              {requirement.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{requirement.location}</span>
                                </div>
                              )}
                            </div>

                            {requirement.skills && requirement.skills.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {requirement.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            )}

                            {canApply(requirement) && (
                              <div className="space-y-3">
                                {showingApplicationForm === requirement.id ? (
                                  <div className="border rounded-lg p-4 bg-muted/50">
                                    <h4 className="font-semibold mb-2">Apply for {requirement.role}</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      Tell the project creator why you're a good fit for this role.
                                    </p>
                                    <Textarea
                                      placeholder="Write your application message..."
                                      value={applicationMessages[requirement.id] || ''}
                                      onChange={(e) => setApplicationMessages(prev => ({
                                        ...prev,
                                        [requirement.id]: e.target.value
                                      }))}
                                      rows={4}
                                      className="mb-3"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setShowingApplicationForm(null);
                                          setApplicationMessages(prev => ({ ...prev, [requirement.id]: '' }));
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        size="sm"
                                        onClick={() => handleApply(requirement)}
                                      >
                                        Submit Application
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => setShowingApplicationForm(requirement.id)}
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Apply
                                  </Button>
                                )}
                              </div>
                            )}

                            {!canApply(requirement) && requirement.status === 'open' && (
                              <p className="text-sm text-muted-foreground">
                                {user 
                                  ? 'You have already applied for this role or the position is filled'
                                  : 'Sign in to apply for this collaboration'
                                }
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-projects" className="space-y-6">
          {collaborations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-title text-lg mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any collaboration projects yet. Start your first project to connect with talented professionals.
                </p>
                <Button onClick={() => router.push('/collaborations/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {collaborations.map((collaboration) => (
                <Card key={collaboration.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-title text-xl">{collaboration.title}</CardTitle>
                        {collaboration.description && (
                          <p className="text-muted-foreground mt-2">{collaboration.description}</p>
                        )}
                      </div>
                      <Badge variant={collaboration.status === 'active' ? 'default' : 'secondary'}>
                        {collaboration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collaboration.requirements.map((requirement) => (
                      <div key={requirement.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{requirement.role}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{requirement.quantityFilled} of {requirement.quantityNeeded} filled</span>
                            </div>
                          </div>
                          <Badge variant={requirement.status === 'open' ? 'default' : 'secondary'}>
                            {requirement.status}
                          </Badge>
                        </div>
                        
                        {requirement.applications && requirement.applications.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-medium">Applications ({requirement.applications.length})</h5>
                            {requirement.applications.map((application) => (
                              <div key={application.id} className="bg-muted/50 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium">{application.applicantName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Applied {new Date(application.appliedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={application.status === 'pending' ? 'default' : application.status === 'accepted' ? 'default' : 'secondary'}>
                                      {application.status}
                                    </Badge>
                                    {application.status === 'pending' && (
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => handleApplicationAction(collaboration.id, requirement.id, application.id, 'accept')}
                                        >
                                          Accept
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleApplicationAction(collaboration.id, requirement.id, application.id, 'reject')}
                                        >
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {application.message && (
                                  <p className="text-sm">{application.message}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-applications" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-title text-lg mb-2">Your Applications</h3>
              <p className="text-muted-foreground">
                View and manage your collaboration applications here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

