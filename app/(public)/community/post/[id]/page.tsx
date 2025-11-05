'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MessageCircle,
  Heart,
  Share2,
  Eye,
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface Comment {
  id: string;
  content: string;
  author: string;
  author_avatar: string;
  created_at: string;
  likes: number;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  author_avatar: string;
  category: string;
  created_at: string;
  likes: number;
  comments: number;
  views: number;
  featured_image?: string;
}

export default function CommunityPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5001/api/community/posts/${id}`, { headers });
      if (response.ok) {
        const data = await response.json();
        const postData = Array.isArray(data) ? data[0] : (data?.data || data);
        setPost({
          id: postData.id.toString(),
          title: postData.title,
          content: postData.content,
          author: postData.author || postData.display_name || postData.username || 'Unknown',
          author_avatar: postData.author_avatar || postData.avatar_url || '',
          category: postData.category || 'General',
          created_at: postData.created_at,
          likes: postData.likes_count || postData.likes || 0,
          comments: postData.comments_count || postData.comments || 0,
          views: postData.views_count || postData.views || 0,
          featured_image: postData.featured_image,
        });
        
        // Set liked status from response
        setLiked(postData.is_liked || false);
      } else if (response.status === 404) {
        toast.error('Post not found');
        router.push('/community');
      } else {
        toast.error('Failed to load post');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5001/api/community/posts/${id}/comments`, { headers });
      if (response.ok) {
        const data = await response.json();
        const commentsData = Array.isArray(data) ? data : (data?.data || []);
        setComments(commentsData.map((comment: any) => ({
          id: comment.id.toString(),
          content: comment.content,
          author: comment.author || comment.display_name || comment.username || 'Unknown',
          author_avatar: comment.author_avatar || comment.avatar_url || '',
          created_at: comment.created_at,
          likes: comment.likes_count || comment.likes || 0,
        })));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like posts');
      router.push('/auth?mode=signin');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:5001/api/community/posts/${id}/like`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setLiked(!liked);
        if (post) {
          setPost({
            ...post,
            likes: liked ? post.likes - 1 : post.likes + 1,
          });
        }
      } else {
        toast.error('Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      router.push('/auth?mode=signin');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:5001/api/community/posts/${id}/comments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newComment.trim(),
          }),
        }
      );

      if (response.ok) {
        setNewComment('');
        toast.success('Comment posted successfully');
        fetchComments();
        if (post) {
          setPost({
            ...post,
            comments: post.comments + 1,
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
          <Button onClick={() => router.push('/community')}>
            Back to Community
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Content */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author_avatar} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{post.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            {post.featured_image && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto"
                  fallbackSrc="/placeholder-image.png"
                />
              </div>
            )}

            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-5 w-5" />
                  <span>{post.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
          </CardHeader>
          <CardContent>
            {/* Comment Form */}
            {user ? (
              <div className="mb-6 pb-6 border-b">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitComment}
                        disabled={submittingComment || !newComment.trim()}
                        size="sm"
                      >
                        {submittingComment ? (
                          'Posting...'
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Post Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 pb-6 border-b text-center">
                <p className="text-gray-600 mb-4">Sign in to join the discussion</p>
                <Button onClick={() => router.push('/auth?mode=signin')}>
                  Sign In
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author_avatar} alt={comment.author} />
                      <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 ml-2">
                        <button className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{comment.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

