import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../providers/AuthProvider';
import { projectId } from '../../utils/supabase/info';

interface UserApplication {
  id: string;
  requirementId: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  requirement?: {
    id: string;
    role: string;
    quantityNeeded: number;
    quantityFilled: number;
    budget?: string;
    timing?: string;
    location?: string;
    skills?: string[];
    description?: string;
    status: 'open' | 'closed';
  };
  collaboration?: {
    id: string;
    title: string;
    description?: string;
    creatorId: string;
    createdAt: string;
    status: 'active' | 'completed' | 'cancelled';
  };
}

interface UserApplicationsProps {
  isDashboardDarkMode?: boolean;
}

export const UserApplications: React.FC<UserApplicationsProps> = ({ isDashboardDarkMode = false }) => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchUserApplications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/applications/user/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        console.error('Failed to fetch applications');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getCollaborationStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>{stats.total}</div>
              <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Applications</div>
            </CardContent>
          </Card>
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Pending</div>
            </CardContent>
          </Card>
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Accepted</div>
            </CardContent>
          </Card>
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {stats[status]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-title">
                {filter === 'all' ? 'No Applications Yet' : `No ${filter} Applications`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't applied to any collaborations yet. Browse available projects to get started!"
                  : `You don't have any ${filter} applications at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Button onClick={() => router.push('/collaborations/browse')}>
                  Browse Collaborations
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.collaboration?.title}
                        </h3>
                        <Badge className={getCollaborationStatusColor(application.collaboration?.status || 'active')}>
                          {application.collaboration?.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Applied for: {application.requirement?.role}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {application.collaboration?.description && (
                        <p className="text-gray-700 text-sm mb-3">{application.collaboration.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getStatusColor(application.status)} flex items-center space-x-1`}>
                        {getStatusIcon(application.status)}
                        <span>{application.status}</span>
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/collaborations/${application.collaboration?.id}`)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Requirement Details */}
                  {application.requirement && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Position Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Role:</span>
                          <p className="text-gray-600">{application.requirement.role}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Positions:</span>
                          <p className="text-gray-600">
                            {application.requirement.quantityFilled}/{application.requirement.quantityNeeded} filled
                          </p>
                        </div>
                        {application.requirement.budget && (
                          <div>
                            <span className="font-medium text-gray-700">Budget:</span>
                            <p className="text-gray-600">{application.requirement.budget}</p>
                          </div>
                        )}
                        {application.requirement.timing && (
                          <div>
                            <span className="font-medium text-gray-700">Timeline:</span>
                            <p className="text-gray-600">{application.requirement.timing}</p>
                          </div>
                        )}
                      </div>
                      
                      {application.requirement.skills && application.requirement.skills.length > 0 && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700 text-sm">Required Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {application.requirement.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Application Message */}
                  {application.message && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Your Application Message</h4>
                          <p className="text-sm text-blue-800">{application.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
};

