import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Trash2,
  Eye,
  BarChart3,
  Calendar,
  User,
  Send
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import { Alert, AlertDescription } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '../providers/AuthProvider';
import { projectId } from '../../utils/supabase/info';

import { UserApplications } from './UserApplications';
import { CollaborationFlow } from './CollaborationFlow';

interface Collaboration {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
  requirements: CollaborationRequirement[];
}

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
  applications: Application[];
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

interface CollaborationComment {
  id: string;
  collaborationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  createdAt: string;
  isSystemMessage?: boolean;
}

interface ProgressData {
  totalRequirements: number;
  filledRequirements: number;
  progressPercentage: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  requirements: Array<{
    id: string;
    role: string;
    quantityNeeded: number;
    quantityFilled: number;
    status: string;
    progressPercentage: number;
  }>;
}

interface CollaborationDashboardProps {
  isDashboardDarkMode?: boolean;
}

export const CollaborationDashboard: React.FC<CollaborationDashboardProps> = ({ isDashboardDarkMode = false }) => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null);
  const [comments, setComments] = useState<CollaborationComment[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserCollaborations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCollaboration) {
      fetchCollaborationComments();
      fetchCollaborationProgress();
    }
  }, [selectedCollaboration]);

  const fetchUserCollaborations = async () => {
    // Dummy user collaborations data for dashboard
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
                applicantAvatar: undefined,
                message: 'I have experience as a second shooter and would love to collaborate on wedding photography.',
                status: 'pending',
                appliedAt: '2024-11-20T14:00:00Z'
              },
              {
                id: 'user-app-2',
                requirementId: 'user-req-1',
                applicantId: 'applicant-2',
                applicantName: 'James Wilson',
                applicantAvatar: undefined,
                message: 'Wedding photographer with 2 years experience. Great at capturing candid moments.',
                status: 'pending',
                appliedAt: '2024-11-21T16:30:00Z'
              }
            ]
          },
          {
            id: 'user-req-2',
            collaborationId: 'user-collab-1',
            role: 'Video Editor',
            quantityNeeded: 1,
            quantityFilled: 1,
            budget: '$800 - $1,200',
            timing: 'Next month',
            location: 'Remote',
            skills: ['Video Editing', 'Wedding Videos', 'Color Grading'],
            description: 'Edit highlight reels and full ceremony videos.',
            status: 'closed',
            applications: [
              {
                id: 'user-app-3',
                requirementId: 'user-req-2',
                applicantId: 'applicant-3',
                applicantName: 'Sofia Chen',
                applicantAvatar: undefined,
                message: 'Specialized in wedding video editing with 4+ years experience.',
                status: 'accepted',
                appliedAt: '2024-11-18T10:15:00Z'
              }
            ]
          }
        ]
      },
      {
        id: 'user-collab-2',
        title: 'Art Exhibition Curation',
        description: 'Curating a digital art exhibition featuring emerging artists.',
        creatorId: user.id,
        createdAt: '2024-11-01T12:00:00Z',
        status: 'completed',
        requirements: [
          {
            id: 'user-req-3',
            collaborationId: 'user-collab-2',
            role: 'Digital Artists',
            quantityNeeded: 3,
            quantityFilled: 3,
            budget: '$1,000 per piece',
            timing: 'Completed',
            location: 'Online',
            skills: ['Digital Art', 'NFT Creation', 'Contemporary Art'],
            description: 'Create original digital artworks for exhibition.',
            status: 'closed',
            applications: []
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
        const collaborations = data.collaborations && data.collaborations.length > 0 ? data.collaborations : dummyUserCollaborations;
        setCollaborations(collaborations);
        if (collaborations.length > 0 && !selectedCollaboration) {
          setSelectedCollaboration(collaborations[0]);
        }
      } else {
        setCollaborations(dummyUserCollaborations);
        if (dummyUserCollaborations.length > 0 && !selectedCollaboration) {
          setSelectedCollaboration(dummyUserCollaborations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching collaborations:', error);
      setCollaborations(dummyUserCollaborations);
      if (dummyUserCollaborations.length > 0 && !selectedCollaboration) {
        setSelectedCollaboration(dummyUserCollaborations[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborationComments = async () => {
    if (!selectedCollaboration) return;

    // Dummy comments data
    const dummyComments: CollaborationComment[] = [
      {
        id: 'comment-1',
        collaborationId: selectedCollaboration.id,
        userId: 'user-1',
        userName: 'Project Creator',
        userAvatar: undefined,
        message: 'Welcome to the collaboration! Looking forward to working with everyone.',
        createdAt: '2024-11-15T10:00:00Z',
        isSystemMessage: false
      },
      {
        id: 'comment-2',
        collaborationId: selectedCollaboration.id,
        userId: 'system',
        userName: 'System',
        userAvatar: undefined,
        message: 'New application received for Second Photographer role',
        createdAt: '2024-11-20T14:05:00Z',
        isSystemMessage: true
      },
      {
        id: 'comment-3',
        collaborationId: selectedCollaboration.id,
        userId: 'applicant-1',
        userName: 'Maria Garcia',
        userAvatar: undefined,
        message: 'Thank you for considering my application! I have attached my portfolio for review.',
        createdAt: '2024-11-20T14:30:00Z',
        isSystemMessage: false
      },
      {
        id: 'comment-4',
        collaborationId: selectedCollaboration.id,
        userId: 'system',
        userName: 'System',
        userAvatar: undefined,
        message: 'Application accepted for Video Editor role',
        createdAt: '2024-11-18T10:20:00Z',
        isSystemMessage: true
      }
    ];

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/${selectedCollaboration.id}/comments`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments && data.comments.length > 0 ? data.comments : dummyComments);
      } else {
        setComments(dummyComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments(dummyComments);
    }
  };

  const fetchCollaborationProgress = async () => {
    if (!selectedCollaboration) return;

    // Calculate dummy progress data based on the selected collaboration
    const totalRequirements = selectedCollaboration.requirements.length;
    const filledRequirements = selectedCollaboration.requirements.filter(req => req.quantityFilled >= req.quantityNeeded).length;
    const progressPercentage = totalRequirements > 0 ? Math.round((filledRequirements / totalRequirements) * 100) : 0;
    
    const totalApplications = selectedCollaboration.requirements.reduce((total, req) => total + req.applications.length, 0);
    const pendingApplications = selectedCollaboration.requirements.reduce((total, req) => 
      total + req.applications.filter(app => app.status === 'pending').length, 0);
    const acceptedApplications = selectedCollaboration.requirements.reduce((total, req) => 
      total + req.applications.filter(app => app.status === 'accepted').length, 0);

    const dummyProgress: ProgressData = {
      totalRequirements,
      filledRequirements,
      progressPercentage,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      requirements: selectedCollaboration.requirements.map(req => ({
        id: req.id,
        role: req.role,
        quantityNeeded: req.quantityNeeded,
        quantityFilled: req.quantityFilled,
        status: req.status,
        progressPercentage: Math.round((req.quantityFilled / req.quantityNeeded) * 100)
      }))
    };

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/${selectedCollaboration.id}/progress`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress || dummyProgress);
      } else {
        setProgress(dummyProgress);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress(dummyProgress);
    }
  };

  const handleApplicationAction = async (applicationId: string, requirementId: string, action: 'accept' | 'reject') => {
    if (!selectedCollaboration) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/${selectedCollaboration.id}/requirements/${requirementId}/applications/${applicationId}/${action}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Refresh collaboration data
        fetchUserCollaborations();
        fetchCollaborationProgress();
        
        // Add system message
        const systemMessage = `Application ${action}ed for ${selectedCollaboration.requirements.find(r => r.id === requirementId)?.role}`;
        await addComment(systemMessage, true);
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
    }
  };

  const addComment = async (message: string, isSystemMessage = false) => {
    if (!selectedCollaboration || !message.trim()) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/${selectedCollaboration.id}/comments`,
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
        setNewComment('');
        fetchCollaborationComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const updateCollaborationStatus = async (status: 'active' | 'completed' | 'cancelled') => {
    if (!selectedCollaboration) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations/${selectedCollaboration.id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchUserCollaborations();
        fetchCollaborationComments();
      }
    } catch (error) {
      console.error('Error updating collaboration status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collaborations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-title">Collaboration Management</h1>
            <p className="text-gray-600">
              Manage your collaboration projects and track their progress
            </p>
          </div>
          <Button 
            className="flex items-center space-x-2"
            onClick={() => router.push('/collaborations/create')}
          >
            <Plus className="w-4 h-4" />
            <span>New Collaboration</span>
          </Button>
        </div>

        {collaborations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-title">No Collaborations Yet</h3>
              <p className="text-gray-600 mb-6">
                Start your first collaboration project and connect with talented professionals.
              </p>
              <Button onClick={() => router.push('/collaborations/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Collaboration
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Collaboration List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Collaborations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    {collaborations.map((collab) => (
                      <div
                        key={collab.id}
                        className={`p-4 cursor-pointer border-l-4 hover:bg-gray-50 ${
                          selectedCollaboration?.id === collab.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-transparent'
                        }`}
                        onClick={() => setSelectedCollaboration(collab)}
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">{collab.title}</h4>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(collab.status)}>
                            {collab.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {collab.requirements.length} requirements
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedCollaboration && (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="communication">Communication</TabsTrigger>
                    <TabsTrigger value="my-applications">My Applications</TabsTrigger>
                    <TabsTrigger value="browse">Browse</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Collaboration Header */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="font-title">{selectedCollaboration.title}</CardTitle>
                            <p className="text-gray-600 mt-2">{selectedCollaboration.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(selectedCollaboration.status)}>
                              {selectedCollaboration.status}
                            </Badge>
                            {selectedCollaboration.status === 'active' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCollaborationStatus('completed')}
                                >
                                  Mark Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCollaborationStatus('cancelled')}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Progress Overview */}
                    {progress && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5" />
                            <span>Progress Overview</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">{progress.progressPercentage}%</div>
                              <div className="text-sm text-gray-600">Overall Progress</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{progress.filledRequirements}/{progress.totalRequirements}</div>
                              <div className="text-sm text-gray-600">Requirements Filled</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{progress.pendingApplications}</div>
                              <div className="text-sm text-gray-600">Pending Applications</div>
                            </div>
                          </div>
                          
                          <Progress value={progress.progressPercentage} className="mb-4" />
                          
                          <div className="space-y-3">
                            {progress.requirements.map((req) => (
                              <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <h4 className="font-medium">{req.role}</h4>
                                  <div className="text-sm text-gray-600">
                                    {req.quantityFilled}/{req.quantityNeeded} filled
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Progress value={req.progressPercentage} className="w-24" />
                                  <Badge className={getStatusColor(req.status)}>
                                    {req.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Requirements</h3>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Requirement
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedCollaboration.requirements.map((requirement) => (
                        <Card key={requirement.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-semibold text-lg">{requirement.role}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                                  <span>
                                    {requirement.quantityFilled}/{requirement.quantityNeeded} filled
                                  </span>
                                  {requirement.budget && <span>Budget: {requirement.budget}</span>}
                                  {requirement.timing && <span>Timeline: {requirement.timing}</span>}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(requirement.status)}>
                                  {requirement.status}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {requirement.applications.filter(app => app.status === 'accepted').length === 0 && (
                                  <Button size="sm" variant="outline">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {requirement.description && (
                              <p className="text-gray-700 mb-4">{requirement.description}</p>
                            )}
                            
                            {requirement.skills && requirement.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {requirement.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="applications" className="space-y-4">
                    <h3 className="text-lg font-semibold">Applications Management</h3>
                    
                    <div className="space-y-6">
                      {selectedCollaboration.requirements.map((requirement) => (
                        <Card key={requirement.id}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              {requirement.role} ({requirement.quantityFilled}/{requirement.quantityNeeded} filled)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {requirement.applications.length === 0 ? (
                              <p className="text-gray-500 text-center py-4">No applications yet</p>
                            ) : (
                              <div className="space-y-4">
                                {requirement.applications.map((application) => (
                                  <div key={application.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-3">
                                        <Avatar>
                                          <AvatarImage src={application.applicantAvatar} />
                                          <AvatarFallback>
                                            {application.applicantName.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h4 className="font-medium">{application.applicantName}</h4>
                                          <p className="text-sm text-gray-600">
                                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                                          </p>
                                          {application.message && (
                                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded">
                                              {application.message}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={getStatusColor(application.status)}>
                                          {application.status}
                                        </Badge>
                                        {application.status === 'pending' && requirement.quantityFilled < requirement.quantityNeeded && (
                                          <div className="flex space-x-1">
                                            <Button
                                              size="sm"
                                              onClick={() => handleApplicationAction(application.id, requirement.id, 'accept')}
                                            >
                                              <CheckCircle className="w-4 h-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleApplicationAction(application.id, requirement.id, 'reject')}
                                            >
                                              <XCircle className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="communication" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MessageSquare className="w-5 h-5" />
                          <span>Collaboration Chat</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-96 mb-4">
                          <div className="space-y-4">
                            {comments.map((comment) => (
                              <div key={comment.id} className={`flex space-x-3 ${
                                comment.isSystemMessage ? 'justify-center' : ''
                              }`}>
                                {comment.isSystemMessage ? (
                                  <div className="bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded-full">
                                    {comment.message}
                                  </div>
                                ) : (
                                  <>
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage src={comment.userAvatar} />
                                      <AvatarFallback>
                                        {comment.userName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-medium text-sm">{comment.userName}</span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(comment.createdAt).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">{comment.message}</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Type a message..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1"
                            rows={3}
                          />
                          <Button
                            onClick={() => addComment(newComment)}
                            disabled={!newComment.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="my-applications" className="space-y-4">
                    <UserApplications />
                  </TabsContent>

                  <TabsContent value="browse" className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Collaborations</h3>
                      <p className="text-gray-600">Discover and apply to join exciting projects</p>
                      <Button
                        onClick={() => router.push('/collaborations/browse')}
                        className="mt-4"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View All Available Projects
                      </Button>
                    </div>
                    <CollaborationFlow />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

