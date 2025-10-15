import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Check, X, Database, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId } from '@/utils/supabase/info';

export const ProfileDebugPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const fixProfile = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/profiles/fix/${user.id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        toast.success('Profile fixed successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to fix profile');
      }
    } catch (error) {
      console.error('Error fixing profile:', error);
      toast.error('Failed to fix profile');
    } finally {
      setLoading(false);
    }
  };

  const checkProfile = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/profiles/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        toast.success('Profile data loaded successfully!');
      } else {
        const error = await response.json();
        setResults({ error: error.message || 'Profile not found' });
        toast.error(error.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setResults({ error: 'Network error' });
      toast.error('Failed to check profile');
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/seed-demo-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        toast.success('Demo data seeded successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to seed demo data');
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast.error('Failed to seed demo data');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileData = (profile: any) => {
    if (!profile) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Username:</strong> {profile.username}
          </div>
          <div>
            <strong>Full Name:</strong> {profile.full_name}
          </div>
          <div>
            <strong>Profile Type:</strong> 
            <Badge variant="secondary" className="ml-2">{profile.profile_type}</Badge>
          </div>
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
        </div>

        <div>
          <strong>Bio:</strong> {profile.bio || 'No bio set'}
        </div>

        <div>
          <strong>Location:</strong> {profile.location || 'No location set'}
        </div>

        {/* Profile type specific fields */}
        {profile.profile_type === 'Artist' && (
          <div>
            <strong>Specialties:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.specialties?.length > 0 ? (
                profile.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">{specialty}</Badge>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No specialties set</span>
              )}
            </div>
          </div>
        )}

        {profile.profile_type === 'Venue' && (
          <div className="space-y-2">
            <div>
              <strong>Capacity:</strong> {profile.venue_capacity || 0} people
            </div>
            <div>
              <strong>Amenities:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.venue_amenities?.length > 0 ? (
                  profile.venue_amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No amenities set</span>
                )}
              </div>
            </div>
          </div>
        )}

        {profile.profile_type === 'Investor' && (
          <div className="space-y-2">
            <div>
              <strong>Investment Range:</strong> 
              ${profile.investment_range?.min?.toLocaleString()} - ${profile.investment_range?.max?.toLocaleString()}
            </div>
            <div>
              <strong>Focus Areas:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.investment_focus?.length > 0 ? (
                  profile.investment_focus.map((focus: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">{focus}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No focus areas set</span>
                )}
              </div>
            </div>
          </div>
        )}

        {profile.profile_type === 'Legal' && (
          <div className="space-y-2">
            <div>
              <strong>Specializations:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.legal_specialization?.length > 0 ? (
                  profile.legal_specialization.map((spec: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">{spec}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No specializations set</span>
                )}
              </div>
            </div>
            <div>
              <strong>Bar Admissions:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.bar_admission?.length > 0 ? (
                  profile.bar_admission.map((bar: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">{bar}</Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No bar admissions set</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div><strong>Created:</strong> {profile.created_at}</div>
            <div><strong>Updated:</strong> {profile.updated_at}</div>
            <div><strong>Followers:</strong> {profile.followers_count}</div>
            <div><strong>Following:</strong> {profile.following_count}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-title text-gray-900">Profile Debug</h1>
            <p className="text-gray-600">Debug and fix profile data issues</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Current User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Metadata:</strong></div>
                <div className="col-span-2">
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(user.user_metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Debug Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={checkProfile}
                disabled={loading || !user}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Check Profile
              </Button>
              
              <Button
                onClick={fixProfile}
                disabled={loading || !user}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Fix Profile
              </Button>
              
              <Button
                onClick={seedDemoData}
                disabled={loading}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Seed Demo Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push('/profile-settings')}
                variant="outline"
              >
                Go to Profile Settings
              </Button>
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
              >
                View My Profile
              </Button>
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
              >
                Sign Up/In Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.error ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.error ? (
                <div className="text-red-600">
                  <strong>Error:</strong> {results.error}
                </div>
              ) : results.profile ? (
                renderProfileData(results.profile)
              ) : (
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

