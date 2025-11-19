'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactCrop, { Crop, PixelCrop, makeAspectCrop, centerCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  MessageCircle,
  Calendar,
  TrendingUp,
  Heart,
  Share2,
  Eye,
  ArrowRight,
  Loader2,
  Star,
  MapPin,
  Clock,
  Plus,
  Filter,
  Search,
  Camera,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';
import { uploadImageToS3 } from '@/utils/s3Upload';
import { apiUrl } from '@/utils/api';

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  author_avatar: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  created_at: string;
  featured_image?: string;
  is_liked?: boolean;
}

interface GigRole {
  id: string;
  name: string;
  requiredSlots: number;
  approvedCount: number;
  pendingCount: number;
  description: string | null;
}

interface ApiPost {
  id: number | string;
  title: string;
  content: string;
  author?: string;
  username?: string;
  author_avatar?: string;
  category?: string;
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
  created_at: string;
  featured_image?: string;
  is_liked?: boolean;
}

interface ApiGig {
  id: number | string;
  title: string;
  description: string;
  gig_type: string;
  category?: string | null;
  experience_level?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_currency?: string;
  rate_type?: string | null;
  location?: string | null;
  is_remote?: boolean;
  application_deadline?: string | null;
  contact_email?: string | null;
  application_link?: string | null;
  skills_required?: string[] | string;
  status?: string;
  created_at: string;
  banner_image?: string | null;
  user_id?: number | string;
  display_name?: string;
  username?: string;
  avatar_url?: string;
  roles?: Array<{
    id?: number | string;
    name?: string;
    requiredSlots?: number;
    required_slots?: number;
    approvedCount?: number;
    pendingCount?: number;
    description?: string | null;
  }>;
}

interface ApiGigApplication {
  gig_id: number | string;
  [key: string]: unknown;
}

interface ApiGigRole {
  id?: number | string;
  name?: string;
  requiredSlots?: number;
  required_slots?: number;
  approvedCount?: number;
  approved_count?: number;
  pendingCount?: number;
  pending_count?: number;
  description?: string | null;
  role_description?: string | null;
}

interface CommunityGig {
  id: string;
  title: string;
  description: string;
  gig_type: string;
  category: string | null;
  experience_level: string | null;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string;
  rate_type: string | null;
  location: string | null;
  is_remote: boolean;
  application_deadline: string | null;
  contact_email: string | null;
  application_link: string | null;
  skills_required: string[];
  status: string;
  created_at: string;
  banner_image: string | null;
  ownerId: string;
  poster: {
    displayName: string;
    username?: string;
    avatar?: string;
  };
  roles: GigRole[];
}

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [gigs, setGigs] = useState<CommunityGig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [communityStats, setCommunityStats] = useState({
    activeCreators: '50K+',
    postsShared: '125K+',
    collaborations: '15K+',
    eventsHosted: '2.8K+'
  });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    category: '',
    featured_image: ''
  });
  const [applyingGigId, setApplyingGigId] = useState<string | null>(null);
  const [appliedGigIds, setAppliedGigIds] = useState<string[]>([]);
  const [selectedGigRoles, setSelectedGigRoles] = useState<Record<string, string>>({});
  const [likingPosts, setLikingPosts] = useState<Record<string, boolean>>({});

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!normalizedSearch) {
      return posts;
    }

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.content,
        post.author,
        post.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [posts, normalizedSearch]);

  const filteredGigs = useMemo(() => {
    if (!normalizedSearch) {
      return gigs;
    }

    return gigs.filter((gig) => {
      const skillBundle = gig.skills_required.join(' ');
      const rolesBundle = gig.roles?.map((role) => role.name).join(' ') ?? '';
      const haystack = [
        gig.title,
        gig.description,
        gig.gig_type,
        gig.category,
        gig.experience_level,
        gig.location,
        gig.poster.displayName,
        gig.poster.username,
        skillBundle,
        rolesBundle,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [gigs, normalizedSearch]);

  const formatGigBudget = useCallback((gig: CommunityGig) => {
    const { budget_min, budget_max, budget_currency, rate_type } = gig;

    if (budget_min === null && budget_max === null) {
      return 'Budget not specified';
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: budget_currency || 'USD',
      maximumFractionDigits: 0,
    });

    const rateSuffix = rate_type ? ` / ${rate_type}` : '';

    if (budget_min !== null && budget_max !== null) {
      return `${formatter.format(budget_min)} - ${formatter.format(budget_max)}${rateSuffix}`;
    }

    if (budget_min !== null) {
      return `${formatter.format(budget_min)}${rateSuffix}`;
    }

    return `${formatter.format(budget_max as number)}${rateSuffix}`;
  }, []);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  const postCategories = [
    'Digital Art',
    'Photography',
    'Illustration',
    'Design',
    'Career Advice',
    'Collaboration',
    'Showcase',
    'Tips & Tricks',
    'Tutorial',
    'General'
  ];

  useEffect(() => {
    fetchCommunityData();
  }, []);


  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      
      // Fetch posts
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Fetch community stats
      try {
        const statsResponse = await fetch(apiUrl('community/posts/stats'), { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('Stats data:', statsData);
          if (statsData.success && statsData.data) {
            const formatNumber = (num: number) => {
              if (num >= 1000) {
                const k = (num / 1000).toFixed(1);
                return k.endsWith('.0') ? `${k.slice(0, -2)}K+` : `${k}K+`;
              }
              return `${num}+`;
            };
            setCommunityStats({
              activeCreators: formatNumber(statsData?.data?.active_creators || 50000),
              postsShared: formatNumber(statsData?.data?.posts_shared || 125000),
              collaborations: formatNumber(statsData?.data?.collaborations),
              eventsHosted: formatNumber(statsData?.data?.events_hosted)
            });
          }
        }
      } catch (statsError) {
        console.error('Error fetching community stats:', statsError);  // Keep default values if stats API fails
      }
      
      // Fetch posts
      const postsResponse = await fetch(
        `${apiUrl('community/posts')}?limit=20&offset=0&status=published&sort=newest`,
        { headers }
      );
      
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        const formattedPosts: CommunityPost[] = postsData.data?.map((post: ApiPost) => ({
          id: post.id.toString(),
          title: post.title,
          content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
          author: post.author || post.username || 'Unknown',
          author_avatar: post.author_avatar || '',
          category: post.category || 'General',
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          views: post.views_count || 0,
          created_at: post.created_at,
          featured_image: post.featured_image || undefined,
          is_liked: post.is_liked || false
        })) || [];
        setPosts(formattedPosts);
      } else {
        console.error('Failed to fetch posts');
        setPosts([]);
      }
      
      // Fetch gigs
      try {
        const gigsResponse = await fetch(
          `${apiUrl('community/gigs')}?status=open&limit=20&offset=0`,
          { headers }
        );

        if (gigsResponse.ok) {
          const gigsData = await gigsResponse.json();
          const formattedGigs: CommunityGig[] = gigsData.data?.map((gig: ApiGig) => ({
            id: gig.id.toString(),
            title: gig.title,
            description: gig.description,
            gig_type: gig.gig_type,
            category: gig.category ?? null,
            experience_level: gig.experience_level ?? null,
            budget_min: gig.budget_min !== undefined && gig.budget_min !== null ? Number(gig.budget_min) : null,
            budget_max: gig.budget_max !== undefined && gig.budget_max !== null ? Number(gig.budget_max) : null,
            budget_currency: gig.budget_currency || 'USD',
            rate_type: gig.rate_type ?? null,
            location: gig.location ?? null,
            is_remote: Boolean(gig.is_remote),
            application_deadline: gig.application_deadline ?? null,
            contact_email: gig.contact_email ?? null,
            application_link: gig.application_link ?? null,
            skills_required: Array.isArray(gig.skills_required)
              ? gig.skills_required.filter(Boolean)
              : (gig.skills_required
                  ? String(gig.skills_required)
                      .split(',')
                      .map((skill: string) => skill.trim())
                      .filter(Boolean)
                  : []),
            status: gig.status || 'open',
            created_at: gig.created_at,
            banner_image: gig.banner_image || null,
            ownerId: gig.user_id ? gig.user_id.toString() : '',
            poster: {
              displayName: gig.display_name || gig.username || 'Community Member',
              username: gig.username || undefined,
              avatar: gig.avatar_url || undefined,
            },
          roles: Array.isArray(gig.roles)
            ? gig.roles
                .map((role: ApiGigRole) => ({
                  id: role?.id ? String(role.id) : generateId(),
                  name: typeof role?.name === 'string' ? role.name : 'Role',
                  requiredSlots: Number.isFinite(Number(role?.requiredSlots))
                    ? Number(role.requiredSlots)
                    : Number.isFinite(Number(role?.required_slots))
                    ? Number(role.required_slots)
                    : 1,
                  approvedCount: Number.isFinite
                  (Number(role?.approvedCount))
                    ? Number(role.approvedCount)
                    : Number.isFinite(Number(role?.approved_count))
                    ? Number(role.approved_count)
                    : 0,
                  pendingCount: Number.isFinite(Number(role?.pendingCount))
                    ? Number(role.pendingCount)
                    : Number.isFinite(Number(role?.pending_count))
                    ? Number(role.pending_count)
                    : 0,
                  description:
                    typeof role?.description === 'string' && role.description.trim().length > 0
                      ? role.description.trim()
                      : typeof role?.role_description === 'string' && role.role_description.trim().length > 0
                      ? role.role_description.trim()
                      : null,
                }))
            : [],
          })) || [];

          console.log('Formatted gigs:', formattedGigs);
          setGigs(formattedGigs);
          setSelectedGigRoles((prev) => {
            const nextSelections: Record<string, string> = {};
            for (const gig of formattedGigs) {
              const prevSelection = prev[gig.id];
              if (prevSelection && gig.roles.some((role) => role.id === prevSelection)) {
                nextSelections[gig.id] = prevSelection;
              }
            }
            return nextSelections;
          });
        } else {
          setGigs([]);
        }
      } catch (gigError) {
        console.error('Failed to fetch gigs', gigError);
        setGigs([]);
      }

    } catch (error) {
      console.error('Error fetching community data:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedGigIds = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setAppliedGigIds([]);
        return;
      }

      const response = await fetch(apiUrl('community/gigs/applications'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const gigIds =
          Array.isArray(data?.data) ? data.data.map((application: ApiGigApplication) => String(application.gig_id)) : [];
        setAppliedGigIds(gigIds);
      } else if (response.status === 401) {
        setAppliedGigIds([]);
      } else {
        console.error('Failed to fetch applied gigs');
      }
    } catch (error) {
      console.error('Error fetching applied gigs:', error);
    }
  }, []);

  const handleApplyToGig = useCallback(
    async (gig: CommunityGig) => {
      if (!user) {
        router.push('/auth');
        return;
      }

      const selectedRoleId = selectedGigRoles[gig.id];
      const selectedRole =
        gig.roles && gig.roles.length
          ? gig.roles.find((role) => role.id === selectedRoleId)
          : undefined;

      if (gig.roles.length > 0 && !selectedRole) {
        toast.error('Please select the role you are applying for.');
        return;
      }

      try {
        setApplyingGigId(gig.id);

        const token = localStorage.getItem('access_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (!token) {
          toast.error('Please log in to apply for this gig.');
          router.push('/auth');
          return;
        }

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(apiUrl(`community/gigs/${gig.id}/apply`), {
          method: 'POST',
          headers,
          body: JSON.stringify({
            status: 'applied',
            roleId: selectedRole?.id,
            roleName: selectedRole?.name,
          }),
        });

        if (!response.ok) {
          let message = 'Failed to mark application as applied.';
          try {
            const errorData = await response.json();
            if (errorData?.message) {
              message = errorData.message;
            }
          } catch {
            // ignore JSON parsing errors
          }
          throw new Error(message);
        }

        setAppliedGigIds((prev) => (prev.includes(gig.id) ? prev : [...prev, gig.id]));
        await fetchAppliedGigIds();
        toast.success('Application marked as applied.');
      } catch (error) {
        console.error('Error marking application as applied:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to mark application as applied.');
      } finally {
        setApplyingGigId(null);
      }
    },
    [fetchAppliedGigIds, router, selectedGigRoles, user]
  );

  useEffect(() => {
    if (user) {
      fetchAppliedGigIds();
    } else {
      setAppliedGigIds([]);
    }
  }, [fetchAppliedGigIds, user]);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowImageEditor(true);
        // Reset crop when opening new image
        setCrop(undefined);
        setCompletedCrop(undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(initialCrop);
    } else {
      // Auto-crop to fit image
      setCrop({
        unit: '%',
        x: 5,
        y: 5,
        width: 90,
        height: 90,
      });
    }
  };

  const getCroppedImg = useCallback(
    (
      image: HTMLImageElement,
      pixelCrop: PixelCrop,
      fileName: string,
      mimeType: string = 'image/jpeg'
    ): Promise<File> => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const cropWidth = Math.round(pixelCrop.width * scaleX);
      const cropHeight = Math.round(pixelCrop.height * scaleY);
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      ctx.drawImage(
        image,
        Math.round(pixelCrop.x * scaleX),
        Math.round(pixelCrop.y * scaleY),
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            const file = new File([blob], fileName, { type: blob.type });
            resolve(file);
          },
          mimeType,
          0.95
        );
      });
    },
    []
  );

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop || !selectedImage) {
      toast.error('Please select a crop area');
      return;
    }

    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        selectedImage.name,
        selectedImage.type || 'image/jpeg'
      );
      setSelectedImage(croppedFile);
      setImagePreview(URL.createObjectURL(croppedFile));
      setShowImageEditor(false);
      toast.success('Image cropped successfully');
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image');
    }
  };

  const uploadImageWithToast = async (
    file: File,
    folder: string,
    setLoadingState: (value: boolean) => void
  ): Promise<string | null> => {
    try {
      setLoadingState(true);
      toast.info('Uploading image to S3...');
      const imageUrl = await uploadImageToS3(file, folder);
      toast.success('Image uploaded successfully!');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setLoadingState(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!postForm.title.trim() || !postForm.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to create a post');
        router.push('/auth');
        return;
      }

      // Upload image first if selected
      let imageUrl = postForm.featured_image;
      if (selectedImage) {
        const uploadedUrl = await uploadImageWithToast(selectedImage, 'community/posts', setUploadingImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const response = await fetch(apiUrl('community/posts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: postForm.title,
          content: postForm.content,
          category: postForm.category || null,
          featured_image: imageUrl || null,
          status: 'published'
        }),
      });

      if (response.ok) {
        toast.success('Post created successfully!');
        setShowCreatePost(false);
        setPostForm({ title: '', content: '', category: '', featured_image: '' });
        setSelectedImage(null);
        setImagePreview(null);
        setShowImageEditor(false);
        fetchCommunityData(); // Refresh the feed
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePostLike = useCallback(
    async (postId: string, currentlyLiked: boolean) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth');
        return;
      }

      if (likingPosts[postId]) {
        return;
      }

      setLikingPosts((prev) => ({ ...prev, [postId]: true }));
      try {
        const response = await fetch(apiUrl(`community/posts/${postId}/like`), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setPosts((prev) =>
            prev.map((post) => {
              if (post.id !== postId) {
                return post;
              }

              const nextLikes = currentlyLiked ? Math.max(0, post.likes - 1) : post.likes + 1;
              return {
                ...post,
                likes: nextLikes,
                is_liked: !currentlyLiked,
              };
            })
          );
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      } finally {
        setLikingPosts((prev) => {
          const next = { ...prev };
          delete next[postId];
          return next;
        });
      }
    },
    [likingPosts, router]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            🌟 Join the Creative Revolution
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-title leading-tight">
            Welcome to the
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Artistrial Community
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto mb-8 leading-relaxed">
            Connect with 50,000+ passionate creators, share your journey, collaborate on groundbreaking projects, 
            and turn your creative dreams into reality together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                onClick={() => setShowCreatePost(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Post
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                onClick={() => router.push('/auth')}
              >
                Join Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Button
              size="lg"
              className="bg-[#FF8D28] text-white hover:bg-[#FF8D28]/90 px-8 py-4 text-lg font-semibold"
              onClick={() => {
                router.push('/community/gigs/new');
              }}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Create a Gig
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white !bg-transparent !text-white hover:!bg-white hover:!text-purple-600 px-8 py-4 text-lg font-semibold transition-all [&>svg]:text-white [&>svg]:hover:text-purple-600"
              onClick={() => router.push('/marketplace/tickets')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Explore Events
            </Button>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">{communityStats.activeCreators}</div>
              <p className="text-purple-200">Active Creators</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">{communityStats.postsShared}</div>
              <p className="text-purple-200">Posts Shared</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">{communityStats.collaborations}</div>
              <p className="text-purple-200">Collaborations</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-title">{communityStats.eventsHosted}</div>
              <p className="text-purple-200">Events Hosted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
                <TabsTrigger value="feed" className="flex items-center gap-2 px-6">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Feed</span>
                </TabsTrigger>
                <TabsTrigger value="gigs" className="flex items-center gap-2 px-6">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Gigs</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search community..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Community Feed */}
            <TabsContent value="feed" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <CardContent className="p-0">
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden">
                            <ImageWithFallback
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={post.author_avatar} alt={post.author} />
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold font-title">{post.author}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{timeAgo(post.created_at)}</span>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {post.category}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold mb-3 font-title hover:text-purple-600 cursor-pointer transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-6 leading-relaxed">{post.content}</p>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <button 
                                className={`flex items-center gap-2 transition-colors ${post.is_liked ? 'text-red-600' : 'hover:text-red-600'}`}
                                onClick={() => handleTogglePostLike(post.id, Boolean(post.is_liked))}
                                disabled={Boolean(likingPosts[post.id])}
                              >
                                <Heart
                                  className={`h-4 w-4 ${post.is_liked ? 'text-red-500 fill-red-500' : ''}`}
                                />
                                {post.likes}
                              </button>
                              <button 
                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                onClick={() => router.push(`/community/post/${post.id}`)}
                              >
                                <MessageCircle className="h-4 w-4" />
                                {post.comments}
                              </button>
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                {post.views.toLocaleString()}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold font-title">Quick Actions</h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => {
                          if (!user) {
                            router.push('/auth');
                          } else {
                            setShowCreatePost(true);
                          }
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => {
                          router.push('/community/gigs/new');
                        }}
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        Create Gig
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Trending Topics */}
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold font-title">Trending Topics</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Digital Art Techniques',
                          'Portfolio Reviews',
                          'Creative Collaborations',
                          'Art Challenges',
                          'Career Growth'
                        ].map((topic) => (
                          <div key={topic} className="flex items-center justify-between group cursor-pointer">
                            <span className="text-sm hover:text-purple-600 transition-colors">{topic}</span>
                            <TrendingUp className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Gigs Tab */}
            <TabsContent value="gigs" className="space-y-6">
              {filteredGigs.length === 0 ? (
                <Card className="border-2 border-dashed border-purple-200">
                  <CardContent className="py-12 text-center space-y-4">
                    <Briefcase className="h-12 w-12 mx-auto text-purple-300" />
                    <h3 className="text-xl font-semibold font-title">No gigs available yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Create the first opportunity and invite collaborators from the community.
                    </p>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => {
                        router.push('/community/gigs/new');
                      }}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create a Gig
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGigs.map((gig) => {
                    const isApplying = applyingGigId === gig.id;
                    const hasApplied = appliedGigIds.includes(gig.id);
                    const isOwner = Boolean(user?.id) && Boolean(gig.ownerId) && String(user.id) === gig.ownerId;
                    const locationLabel = gig.is_remote
                      ? gig.location
                        ? `${gig.location} • Remote`
                        : 'Remote'
                      : gig.location || 'Location provided on request';

                    return (
                      <Card key={gig.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                        {gig.banner_image && (
                          <div className="aspect-[16/9] overflow-hidden">
                            <ImageWithFallback
                              src={gig.banner_image}
                              alt={`${gig.title} banner`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardContent className="p-6 space-y-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <Badge variant="secondary" className="capitalize">
                                {gig.gig_type.replace(/[_-]/g, ' ')}
                              </Badge>
                              {gig.status && gig.status !== 'open' && (
                                <Badge variant="outline" className="text-xs uppercase tracking-wide">
                                  {gig.status}
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {timeAgo(gig.created_at)}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold mb-2 font-title">{gig.title}</h3>
                            <p className="text-gray-600 line-clamp-3">{gig.description}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-purple-500" />
                              <span>{locationLabel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span>{formatGigBudget(gig)}</span>
                            </div>
                            {gig.application_deadline && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <span>
                                  Apply by{' '}
                                  {new Date(gig.application_deadline).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {gig.experience_level && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="capitalize">{gig.experience_level}</span>
                              </div>
                            )}
                          </div>

                          {gig.roles.length > 0 && (
                            <div className="space-y-2 rounded-lg border border-purple-100 bg-purple-50/50 p-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <p className="text-sm font-medium text-purple-700">Roles Needed</p>
                                <p className="text-xs text-purple-500">
                                  {hasApplied ? 'Application submitted' : 'Select a role before applying'}
                                </p>
                              </div>
                              <div className="space-y-1">
                                {gig.roles.map((role) => {
                                  const totalSlots = role.requiredSlots || 0;
                                  const approved = role.approvedCount || 0;
                                  const remaining =
                                    totalSlots === 0 ? 'Unlimited spots' : `${Math.max(totalSlots - approved, 0)} spot${Math.max(totalSlots - approved, 0) === 1 ? '' : 's'} left`;
                                  return (
                                    <div
                                      key={role.id}
                                      className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-purple-700"
                                    >
                                      <div className="flex-1">
                                        <span className="font-medium block">{role.name}</span>
                                        {role.description && (
                                          <span className="block text-[11px] text-purple-500/80 sm:text-xs">
                                            {role.description}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-purple-500">
                                        {totalSlots === 0
                                          ? 'Unlimited approvals'
                                          : `${approved}/${totalSlots} approved • ${remaining}`}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {gig.skills_required.length > 0 ? (
                              gig.skills_required.slice(0, 8).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-xs text-gray-500 border-dashed">
                                General opportunity
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={gig.poster.avatar} alt={gig.poster.displayName} />
                                <AvatarFallback>{gig.poster.displayName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold font-title">{gig.poster.displayName}</p>
                                {gig.poster.username && (
                                  <p className="text-xs text-gray-500">{gig.poster.username}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {gig.contact_email && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={`mailto:${gig.contact_email}`} target="_blank" rel="noreferrer">
                                    Contact
                                  </a>
                                </Button>
                              )}
                              {isOwner && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/dashboard/gigs/${gig.id}/applications`}>
                                    Manage Requests
                                  </Link>
                                </Button>
                              )}
                              {isOwner ? (
                                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                                  You posted this gig
                                </Badge>
                              ) : (
                                <>
                                  {gig.roles.length > 0 && (
                                    <Select
                                      value={selectedGigRoles[gig.id] ?? undefined}
                                      onValueChange={(value) =>
                                        setSelectedGigRoles((prev) => ({
                                          ...prev,
                                          [gig.id]: value,
                                        }))
                                      }
                                      disabled={isApplying || hasApplied}
                                    >
                                      <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Select a role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {gig.roles.map((role) => (
                                          <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                            {role.requiredSlots
                                              ? ` (${role.approvedCount ?? 0}/${role.requiredSlots} approved)`
                                              : ' (Unlimited slots)'}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                  <Button
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700"
                                    disabled={isApplying || hasApplied}
                                    onClick={() => handleApplyToGig(gig)}
                                  >
                                    {isApplying ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Applying...
                                      </>
                                    ) : hasApplied ? (
                                      'Applied'
                                    ) : (
                                      <>
                                        Apply Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* Gig creation moved to /community/gigs/new */}

      {/* Create Post Dialog */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <DialogTitle className="text-2xl font-bold">Create New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts, showcase your work, or ask questions with the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 px-6 flex-1 overflow-y-auto min-h-0">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title *</Label>
              <Input
                id="post-title"
                placeholder="Give your post a catchy title..."
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                maxLength={255}
              />
              <p className="text-xs text-gray-500">{postForm.title.length}/255 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-category">Category (Optional)</Label>
              <Select 
                value={postForm.category || undefined} 
                onValueChange={(value) => setPostForm({ ...postForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {postCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {postForm.category && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setPostForm({ ...postForm, category: '' })}
                >
                  Clear category
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content">Content *</Label>
              <Textarea
                id="post-content"
                placeholder="Write your post content here... Share your story, ask questions, or showcase your work!"
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">{postForm.content.length} characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-image">Featured Image (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                {!imagePreview ? (
                  <>
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Label htmlFor="post-image" className="cursor-pointer">
                      <span className="text-purple-600 hover:text-purple-500 font-medium">Upload an image</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </Label>
                    <Input
                      id="post-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-contain bg-gray-50"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setShowImageEditor(false);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('post-image') as HTMLInputElement;
                          input?.click();
                        }}
                      >
                        Change Image
                      </Button>
                      {selectedImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowImageEditor(true)}
                        >
                          Edit Image
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {selectedImage?.name} ({(selectedImage?.size || 0) / 1024 / 1024}MB)
                    </p>
                  </div>
                )}
              </div>
              {uploadingImage && (
                <div className="text-sm text-blue-600 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Uploading image...
                </div>
              )}
            </div>

            {/* Image Editor Dialog */}
            {showImageEditor && imagePreview && (
              <Dialog open={showImageEditor} onOpenChange={setShowImageEditor}>
                <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
                  <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogDescription>
                      Crop and adjust your image before uploading. Drag the corners to adjust the crop area.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 px-6 py-4 flex-1 overflow-y-auto min-h-0">
                    {/* Aspect Ratio Options */}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant={aspect === undefined ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspect(undefined)}
                      >
                        Free Crop
                      </Button>
                      <Button
                        type="button"
                        variant={aspect === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspect(1)}
                      >
                        1:1 (Square)
                      </Button>
                      <Button
                        type="button"
                        variant={aspect === 16 / 9 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspect(16 / 9)}
                      >
                        16:9 (Landscape)
                      </Button>
                      <Button
                        type="button"
                        variant={aspect === 4 / 3 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspect(4 / 3)}
                      >
                        4:3 (Classic)
                      </Button>
                      <Button
                        type="button"
                        variant={aspect === 3 / 4 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAspect(3 / 4)}
                      >
                        3:4 (Portrait)
                      </Button>
                    </div>

                    {/* Crop Area */}
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '600px' }}>
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        minWidth={50}
                        minHeight={50}
                        className="max-w-full max-h-[600px]"
                      >
                        <img
                          ref={imgRef}
                          alt="Crop me"
                          src={imagePreview}
                          style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
                          onLoad={onImageLoad}
                        />
                      </ReactCrop>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-between items-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Simple resize to 1200px max width
                          const img = new Image();
                          img.src = imagePreview;
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;
                            const maxWidth = 1200;
                            
                            if (width > maxWidth) {
                              height = (height * maxWidth) / width;
                              width = maxWidth;
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0, width, height);
                            
                            canvas.toBlob((blob) => {
                              if (blob) {
                                const file = new File([blob], selectedImage?.name || 'image.jpg', { type: blob.type });
                                setSelectedImage(file);
                                setImagePreview(URL.createObjectURL(blob));
                                setCrop(undefined);
                                setCompletedCrop(undefined);
                                toast.success('Image resized successfully');
                              }
                            }, selectedImage?.type || 'image/jpeg', 0.9);
                          };
                        }}
                      >
                        Resize (Max 1200px)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCrop(undefined);
                          setCompletedCrop(undefined);
                          setAspect(undefined);
                        }}
                      >
                        Reset Crop
                      </Button>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-4 flex-shrink-0 border-t flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowImageEditor(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCropComplete}
                      disabled={!completedCrop}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Apply Crop
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <DialogFooter className="px-6 pb-6 pt-4 flex-shrink-0 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreatePost(false);
                setPostForm({ title: '', content: '', category: '', featured_image: '' });
                setSelectedImage(null);
                setImagePreview(null);
                setShowImageEditor(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={isSubmitting || !postForm.title.trim() || !postForm.content.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}