import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Upload,
  Download,
  Tag,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Copy,
  Star,
  Grid,
  List,
  Share2,
  Heart,
  Play,
  Music,
  FileText,
  Image,
  Sparkles,
  Clock,
  ChevronRight,
  MapPin,
  ExternalLink,
  Badge as BadgeIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

interface MyOGsPageProps {
  isDashboardDarkMode: boolean;
}

interface OriginalRelease {
  id: string;
  title: string;
  type: "collection" | "series" | "book" | "exhibition" | "album" | "film" | "game";
  description: string;
  coverImage: string;
  releaseDate: string;
  status: "published" | "draft" | "upcoming" | "archived";
  pieceCount?: number;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  downloads: number;
  shares: number;
  isPublic: boolean;
  isFeatured: boolean;
  priceRange?: string;
  collaborators?: string[];
  venues?: string[];
  links?: { platform: string; url: string }[];
}

export function MyOGsPage({ isDashboardDarkMode }: MyOGsPageProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<OriginalRelease[]>([]);
  const [creating, setCreating] = useState(false);
  const [newRelease, setNewRelease] = useState({
    title: "",
    type: "collection" as const,
    description: "",
    category: "",
    tags: "",
    isPublic: true,
    isFeatured: false
  });

  // Fetch original releases from API
  useEffect(() => {
    const fetchReleases = async () => {
      // Always clear releases first to prevent stale data
      setReleases([]);
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        let userId = user.id;
        if (!userId && typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              userId = parsedUser?.id;
            } catch (e) {
              console.error('Error parsing stored user:', e);
            }
          }
        }

        if (!userId) {
          setLoading(false);
          return;
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `http://localhost:5001/api/original-releases/user/${userId}`,
          { 
            headers,
            cache: 'no-store' // Prevent caching
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched releases from API:', data); // Debug log
          
          // Handle case where API returns empty array
          if (!Array.isArray(data)) {
            console.error('API response is not an array:', data);
            setReleases([]);
            setLoading(false);
            return;
          }
          
          // Transform API data to match frontend interface
          const transformedReleases: OriginalRelease[] = data.map((release: any) => ({
            id: release.id.toString(),
            title: release.title,
            type: release.type,
            description: release.description || '',
            coverImage: release.cover_image || '',
            releaseDate: release.release_date || release.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            status: release.status,
            pieceCount: release.piece_count,
            category: release.category || '',
            tags: Array.isArray(release.tags) ? release.tags : [],
            views: release.views || 0,
            likes: release.likes || 0,
            downloads: release.downloads || 0,
            shares: release.shares || 0,
            isPublic: release.is_public || false,
            isFeatured: release.is_featured || false,
            priceRange: release.price_range || 
              (release.price_min && release.price_max ? `$${release.price_min} - $${release.price_max}` : undefined),
            collaborators: Array.isArray(release.collaborators) ? release.collaborators : [],
            venues: Array.isArray(release.venues) ? release.venues : [],
            links: typeof release.links === 'string' ? 
              (release.links ? JSON.parse(release.links) : []) : 
              (Array.isArray(release.links) ? release.links : [])
          }));
          
          console.log('Transformed releases:', transformedReleases); // Debug log
          setReleases(transformedReleases);
        } else {
          console.error('Failed to fetch releases, status:', response.status);
          setReleases([]);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          toast.error('Failed to load releases');
        }
      } catch (error) {
        console.error('Error fetching releases:', error);
        setReleases([]);
        toast.error('Failed to load releases');
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [user]);

  const filteredReleases = releases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || release.type === filterType;
    const matchesStatus = filterStatus === "all" || release.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedReleases = [...filteredReleases].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case "popular":
        return b.views - a.views;
      case "likes":
        return b.likes - a.likes;
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "published": { variant: "default" as const, color: "bg-green-500" },
      "draft": { variant: "secondary" as const, color: "bg-gray-500" },
      "upcoming": { variant: "default" as const, color: "bg-[#FF8D28]" },
      "archived": { variant: "outline" as const, color: "bg-gray-400" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      collection: <Image className="w-4 h-4" />,
      series: <Grid className="w-4 h-4" />,
      book: <FileText className="w-4 h-4" />,
      exhibition: <Eye className="w-4 h-4" />,
      album: <Music className="w-4 h-4" />,
      film: <Play className="w-4 h-4" />,
      game: <BadgeIcon className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Star className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCreateRelease = async () => {
    if (!user) {
      toast.error('Please log in to create a release');
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem('access_token');
      
      let userId = user.id;
      if (!userId && typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?.id;
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }

      if (!userId) {
        toast.error('Unable to identify user');
        setCreating(false);
        return;
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Parse tags from comma-separated string
      const tagsArray = newRelease.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch(
        'http://localhost:5001/api/original-releases',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            user_id: userId,
            title: newRelease.title,
            type: newRelease.type,
            description: newRelease.description,
            category: newRelease.category,
            tags: tagsArray,
            is_public: newRelease.isPublic,
            is_featured: newRelease.isFeatured,
            status: 'draft'
          })
        }
      );

      if (response.ok) {
        toast.success('Release created successfully!');
        setShowCreateDialog(false);
        setNewRelease({
          title: "",
          type: "collection",
          description: "",
          category: "",
          tags: "",
          isPublic: true,
          isFeatured: false
        });
        // Refresh the list
        const fetchResponse = await fetch(
          `http://localhost:5001/api/original-releases/user/${userId}`,
          { headers }
        );
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          const transformedReleases: OriginalRelease[] = data.map((release: any) => ({
            id: release.id.toString(),
            title: release.title,
            type: release.type,
            description: release.description || '',
            coverImage: release.cover_image || '',
            releaseDate: release.release_date || release.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            status: release.status,
            pieceCount: release.piece_count,
            category: release.category || '',
            tags: release.tags || [],
            views: release.views || 0,
            likes: release.likes || 0,
            downloads: release.downloads || 0,
            shares: release.shares || 0,
            isPublic: release.is_public || false,
            isFeatured: release.is_featured || false,
            priceRange: release.price_range || undefined,
            collaborators: release.collaborators || [],
            venues: release.venues || [],
            links: typeof release.links === 'string' ? JSON.parse(release.links || '[]') : (release.links || [])
          }));
          setReleases(transformedReleases);
        }
      } else {
        const error = await response.json().catch(() => ({}));
        toast.error(error.error || 'Failed to create release');
      }
    } catch (error) {
      console.error('Error creating release:', error);
      toast.error('Failed to create release');
    } finally {
      setCreating(false);
    }
  };

  const ReleaseCard = ({ release }: { release: OriginalRelease }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700 hover:border-[#FF8D28]/50" : "bg-white border-gray-200 hover:border-[#FF8D28]/50"}`}>
      <div className="relative">
        <ImageWithFallback
          src={release.coverImage}
          alt={release.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge(release.status)}
          {release.isFeatured && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-1">
            <Button size="sm" variant="secondary" className="p-2">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="p-2">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="p-2">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {getTypeIcon(release.type)}
            <span className="capitalize">{release.type}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className={`font-title text-lg font-semibold mb-1 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
            {release.title}
          </h3>
          <p className={`text-sm line-clamp-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {release.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {release.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {release.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{release.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(release.releaseDate)}
          </span>
          {release.pieceCount && (
            <span>{release.pieceCount} pieces</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {release.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {release.likes}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {release.downloads}
            </span>
          </div>
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ReleaseListItem = ({ release }: { release: OriginalRelease }) => (
    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <ImageWithFallback
            src={release.coverImage}
            alt={release.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(release.type)}
                <h3 className={`font-title text-lg font-semibold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  {release.title}
                </h3>
                {getStatusBadge(release.status)}
                {release.isFeatured && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {release.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {release.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  {release.shares}
                </span>
              </div>
            </div>
            <p className={`text-sm mb-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {release.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {release.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {release.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{release.tags.length - 4}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {formatDate(release.releaseDate)}
                </span>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className={`p-6 flex items-center justify-center min-h-screen ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4 ${isDashboardDarkMode ? "border-white" : "border-gray-900"}`}></div>
          <p className={isDashboardDarkMode ? "text-white" : "text-gray-900"}>Loading releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-[#FF8D28]/20 border border-[#FF8D28]/30">
              <Star className="w-6 h-6 text-[#FF8D28]" />
            </div>
            <div>
              <h1 className={`font-title text-3xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                My OGs
              </h1>
              <p className={`text-lg ${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Your original releases and creative works
              </p>
            </div>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Release
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-2xl ${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
              <DialogHeader>
                <DialogTitle className={isDashboardDarkMode ? "text-white" : ""}>
                  Create New Release
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newRelease.title}
                    onChange={(e) => setNewRelease({ ...newRelease, title: e.target.value })}
                    placeholder="Enter release title"
                    className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newRelease.type} onValueChange={(value: any) => setNewRelease({ ...newRelease, type: value })}>
                    <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collection">Collection</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="exhibition">Exhibition</SelectItem>
                      <SelectItem value="album">Album</SelectItem>
                      <SelectItem value="film">Film</SelectItem>
                      <SelectItem value="game">Game</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newRelease.category}
                    onChange={(e) => setNewRelease({ ...newRelease, category: e.target.value })}
                    placeholder="e.g., Digital Art, Photography"
                    className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRelease.description}
                    onChange={(e) => setNewRelease({ ...newRelease, description: e.target.value })}
                    placeholder="Describe your release"
                    rows={3}
                    className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newRelease.tags}
                    onChange={(e) => setNewRelease({ ...newRelease, tags: e.target.value })}
                    placeholder="art, digital, modern"
                    className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRelease.isPublic}
                      onChange={(e) => setNewRelease({ ...newRelease, isPublic: e.target.checked })}
                    />
                    <span className={isDashboardDarkMode ? "text-white" : ""}>Make Public</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRelease.isFeatured}
                      onChange={(e) => setNewRelease({ ...newRelease, isFeatured: e.target.checked })}
                    />
                    <span className={isDashboardDarkMode ? "text-white" : ""}>Feature Release</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRelease} className="bg-[#FF8D28] hover:bg-[#FF8D28]/90" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Release'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    {releases.length}
                  </p>
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Total Releases
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    {releases.reduce((sum, release) => sum + release.views, 0).toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Total Views
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    {releases.reduce((sum, release) => sum + release.likes, 0).toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Total Likes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    {releases.reduce((sum, release) => sum + release.downloads, 0).toLocaleString()}
                  </p>
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Total Downloads
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search releases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className={`w-40 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
                <SelectItem value="series">Series</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="exhibition">Exhibition</SelectItem>
                <SelectItem value="album">Album</SelectItem>
                <SelectItem value="film">Film</SelectItem>
                <SelectItem value="game">Game</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className={`w-40 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`w-40 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Releases Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedReleases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReleases.map((release) => (
            <ReleaseListItem key={release.id} release={release} />
          ))}
        </div>
      )}

      {sortedReleases.length === 0 && (
        <div className="text-center py-12">
          <Star className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? "text-gray-600" : "text-gray-400"}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
            No releases found
          </h3>
          <p className={`mb-4 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {searchTerm || filterType !== "all" || filterStatus !== "all" 
              ? "Try adjusting your filters or search terms"
              : "Share your creative journey by publishing your first original work."
            }
          </p>
          {(!searchTerm && filterType === "all" && filterStatus === "all") && (
            <Button 
              className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Release
            </Button>
           )}
        </div>
      )}
    </div>
  );
}

