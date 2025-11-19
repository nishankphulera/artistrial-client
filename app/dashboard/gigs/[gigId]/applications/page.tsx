'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Check, Clock, Loader2, RotateCcw, X } from 'lucide-react';

import { useAuth } from '@/components/providers/AuthProvider';
import { apiUrl } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

type ApplicationStatus = 'applied' | 'pending' | 'approved' | 'rejected';

interface GigDetails {
  id: string;
  title: string;
  user_id: number;
  status: string;
  gig_type?: string;
  created_at?: string;
}

interface GigApplication {
  id: string;
  gig_id: string;
  user_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  applicant_display_name: string | null;
  applicant_username?: string | null;
  applicant_avatar?: string | null;
  role_id: string | null;
  role_name: string | null;
  role_required_slots: number | null;
  role_approved_count: number | null;
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-700 border-blue-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function ManageGigApplicationsPage() {
  const params = useParams<{ gigId: string }>();
  const gigId = Array.isArray(params?.gigId) ? params?.gigId[0] : params?.gigId;
  const router = useRouter();
  const { user } = useAuth();

  const [gig, setGig] = useState<GigDetails | null>(null);
  const [applications, setApplications] = useState<GigApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isOwner = useMemo(() => {
    if (!gig || !user) return false;
    return String(gig.user_id) === String(user.id);
  }, [gig, user]);

  const fetchGigAndApplications = useCallback(async () => {
    if (!gigId || !user) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const gigResponse = await fetch(apiUrl(`community/gigs/${gigId}`));

      if (!gigResponse.ok) {
        const errorData = await gigResponse.json().catch(() => null);
        const message = errorData?.message ?? 'Failed to load gig details.';
        setError(message);
        setGig(null);
        setApplications([]);
        return;
      }

      const gigPayload = await gigResponse.json();
      const gigData = gigPayload?.data;

      if (!gigData) {
        setError('Gig not found.');
        setGig(null);
        setApplications([]);
        return;
      }

      setGig({
        id: String(gigData.id),
        title: gigData.title ?? 'Untitled Gig',
        user_id: gigData.user_id,
        status: gigData.status ?? 'open',
        gig_type: gigData.gig_type ?? undefined,
        created_at: gigData.created_at ?? undefined,
      });

      if (String(gigData.user_id) !== String(user.id)) {
        setError('You can only manage requests for gigs you created.');
        setApplications([]);
        return;
      }

      const token = localStorage.getItem('access_token');

      if (!token) {
        setError('Please sign in again to manage requests.');
        setApplications([]);
        return;
      }

      const applicationsResponse = await fetch(
        apiUrl(`community/gigs/${gigId}/applications`),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!applicationsResponse.ok) {
        const errorData = await applicationsResponse.json().catch(() => null);
        const message = errorData?.message ?? 'Failed to load gig requests.';
        setError(message);
        setApplications([]);
        return;
      }

      const applicationsPayload = await applicationsResponse.json();
      const data = Array.isArray(applicationsPayload?.data) ? applicationsPayload.data : [];

      const formatted: GigApplication[] = data.map((application: any) => ({
        id: application.id ? String(application.id) : generateId(),
        gig_id: application.gig_id ? String(application.gig_id) : String(gigId),
        user_id: application.user_id ? String(application.user_id) : '',
        status: (application.status ?? 'applied') as ApplicationStatus,
        cover_letter: application.cover_letter ?? null,
        created_at: application.created_at,
        updated_at: application.updated_at,
        applicant_display_name: application.applicant_display_name ?? null,
        applicant_username: application.applicant_username ?? null,
        applicant_avatar: application.applicant_avatar ?? null,
        role_id: application.role_id ? String(application.role_id) : null,
        role_name: application.role_name ?? null,
        role_required_slots: Number.isFinite(Number(application.role_required_slots))
          ? Number(application.role_required_slots)
          : null,
        role_approved_count: Number.isFinite(Number(application.role_approved_count))
          ? Number(application.role_approved_count)
          : null,
      }));

      setApplications(formatted);
    } catch (err) {
      console.error('Error loading gig applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gig requests.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [gigId, user]);

  useEffect(() => {
    if (!gigId) {
      setError('Gig not specified.');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('Please sign in to manage gig requests.');
      setLoading(false);
      return;
    }

    fetchGigAndApplications();
  }, [fetchGigAndApplications, gigId, user]);

  const handleStatusChange = async (applicationId: string, nextStatus: ApplicationStatus) => {
    if (!gig || !isOwner) return;

    const token = localStorage.getItem('access_token');

    if (!token) {
      toast.error('Please sign in again to update requests.');
      router.push('/auth');
      return;
    }

    setActionLoading(`${applicationId}:${nextStatus}`);

    try {
      const response = await fetch(
        apiUrl(`community/gigs/${gig.id}/applications/${applicationId}`),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message ?? 'Failed to update request status.';
        throw new Error(message);
      }

      const payload = await response.json();
      const updated = payload?.data;

      setApplications((prev) =>
        prev.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: (updated?.status ?? nextStatus) as ApplicationStatus,
                updated_at: updated?.updated_at ?? new Date().toISOString(),
              }
            : application
        )
      );

      toast.success(`Application marked as ${STATUS_LABELS[nextStatus]}.`);
    } catch (err) {
      console.error('Error updating application status:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update application status.');
    } finally {
      setActionLoading(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-sm">
          {error}
        </div>
      );
    }

    if (!gig || !isOwner) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-6 text-sm">
          You can only manage requests for gigs you created.
        </div>
      );
    }

    if (!applications.length) {
      return (
        <div className="text-center text-gray-500 py-12">
          No one has applied yet. Check back after creators discover your gig.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {applications.map((application) => {
          const displayName =
            application.applicant_display_name ||
            application.applicant_username ||
            'Interested creator';
          const username = application.applicant_username
            ? `@${application.applicant_username}`
            : null;
          const fallbackInitial = (
            application.applicant_display_name?.[0] ||
            application.applicant_username?.[0] ||
            '?'
          ).toUpperCase();
          const appliedDate = new Date(application.created_at).toLocaleString();

          const status = application.status in STATUS_LABELS ? application.status : 'applied';
          const badgeClasses = STATUS_STYLES[status as ApplicationStatus] ?? STATUS_STYLES.applied;

          const isUpdating = actionLoading?.startsWith(`${application.id}:`);
          const profileHref = application.user_id ? `/profile/${application.user_id}` : null;

          const totalSlots =
            typeof application.role_required_slots === 'number'
              ? application.role_required_slots
              : null;
          const approvedCount =
            typeof application.role_approved_count === 'number'
              ? application.role_approved_count
              : 0;
          const isRoleFilled =
            totalSlots !== null && totalSlots > 0 && approvedCount >= totalSlots;
          const roleCapacityLabel =
            totalSlots === null
              ? null
              : totalSlots === 0
              ? 'Unlimited approvals'
              : `${approvedCount}/${totalSlots} approved`;

          const handleNavigateToProfile = () => {
            if (profileHref) {
              router.push(profileHref);
            }
          };

          const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!profileHref) return;
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleNavigateToProfile();
            }
          };

          return (
            <div
              key={application.id}
              className={`border border-gray-200 rounded-xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-shadow ${
                profileHref ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500' : ''
              }`}
              onClick={handleNavigateToProfile}
              onKeyDown={handleCardKeyDown}
              role={profileHref ? 'button' : undefined}
              tabIndex={profileHref ? 0 : undefined}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.applicant_avatar || undefined} alt={displayName} />
                    <AvatarFallback>{fallbackInitial}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{displayName}</p>
                    {username && <p className="text-xs text-gray-500">{username}</p>}
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3" />
                      Applied {appliedDate}
                    </p>
                    {application.role_name && (
                      <p className="text-xs text-gray-500 mt-1">
                        Role: <span className="font-medium text-gray-700">{application.role_name}</span>
                        {roleCapacityLabel ? ` • ${roleCapacityLabel}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-3">
                  <Badge variant="outline" className={`capitalize text-xs px-2 py-1 ${badgeClasses}`}>
                    {STATUS_LABELS[status as ApplicationStatus] ?? application.status}
                  </Badge>
                  {application.role_name && (
                    <Badge
                      variant="secondary"
                      className={`capitalize text-xs px-2 py-1 ${
                        isRoleFilled ? 'bg-red-100 text-red-700 border-red-200' : 'bg-purple-100 text-purple-700 border-purple-200'
                      }`}
                    >
                      {application.role_name}
                    </Badge>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleStatusChange(application.id, 'pending');
                      }}
                    >
                      {isUpdating && actionLoading?.endsWith('pending') ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <RotateCcw className="mr-1 h-4 w-4" />
                          Pending
                        </>
                      )}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isUpdating || (isRoleFilled && status !== 'approved')}
                      title={
                        isRoleFilled && status !== 'approved'
                          ? 'All approved slots for this role are filled.'
                          : undefined
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        handleStatusChange(application.id, 'approved');
                      }}
                    >
                      {isUpdating && actionLoading?.endsWith('approved') ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isUpdating}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleStatusChange(application.id, 'rejected');
                      }}
                    >
                      {isUpdating && actionLoading?.endsWith('rejected') ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {application.cover_letter && (
                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-line">
                  {application.cover_letter}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button variant="ghost" className="px-0 text-purple-600 hover:text-purple-700" asChild>
            <Link href="/community">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/community">Browse Other Gigs</Link>
          </Button>
        </div>

        <Card className="shadow-md border border-gray-200">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold">
              Manage Requests{gig ? ` • ${gig.title}` : ''}
            </CardTitle>
            <CardDescription>
              Review and manage collaborators who have applied to your gig. Set each applicant&apos;s
              status to pending, approved, or rejected.
            </CardDescription>
          </CardHeader>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}

