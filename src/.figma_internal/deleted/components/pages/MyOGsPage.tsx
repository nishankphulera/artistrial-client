import React, { useState } from "react";
import { 
  Star, Plus, Search, Filter, Grid, List, Eye, Share2, Edit, Trash2, 
  Calendar, Heart, Download, Play, Music, FileText, Image, 
  Sparkles, TrendingUp, Clock, ChevronRight, Users, 
  Upload, MapPin, ExternalLink, Badge as BadgeIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { ImageWithFallback } from "../figma/ImageWithFallback";

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

const mockReleases: OriginalRelease[] = [
  {
    id: "1",
    title: "Metamorphosis Series",
    type: "collection",
    description: "A groundbreaking collection of 12 digital artworks exploring themes of transformation, identity, and the intersection of technology with human emotion. Each piece represents a different stage of creative evolution.",
    coverImage: "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?w=500&h=500&fit=crop",
    releaseDate: "2024-11-01",
    status: "published",
    pieceCount: 12,
    category: "Digital Art",
    tags: ["transformation", "digital", "contemporary", "emotions"],
    views: 8420,
    likes: 342,
    downloads: 89,
    shares: 156,
    isPublic: true,
    isFeatured: true,
    priceRange: "$250 - $800",
    collaborators: ["Artist Name", "Digital Studio"],
    venues: ["Virtual Gallery", "Online Platform"],
    links: [
      { platform: "Instagram", url: "#" },
      { platform: "Portfolio", url: "#" }
    ]
  },
  {
    id: "2",
    title: "Urban Chronicles",
    type: "book",
    description: "A visual journey through metropolitan landscapes, capturing the essence of urban life through photography and narrative storytelling.",
    coverImage: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&h=500&fit=crop",
    releaseDate: "2024-09-15",
    status: "published",
    category: "Photography Book",
    tags: ["urban", "photography", "storytelling", "city"],
    views: 5240,
    likes: 189,
    downloads: 42,
    shares: 73,
    isPublic: true,
    isFeatured: false,
    priceRange: "$45 - $65",
    venues: ["Local Bookstores", "Online"],
    links: [
      { platform: "Amazon", url: "#" },
      { platform: "Website", url: "#" }
    ]
  },
  {
    id: "3",
    title: "Echoes Exhibition",
    type: "exhibition",
    description: "An immersive multimedia exhibition exploring sound, space, and memory through interactive installations.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    releaseDate: "2024-12-01",
    status: "upcoming",
    category: "Mixed Media",
    tags: ["installation", "multimedia", "interactive", "sound"],
    views: 1240,
    likes: 67,
    downloads: 12,
    shares: 28,
    isPublic: true,
    isFeatured: true,
    venues: ["Modern Art Museum", "Gallery District"],
    links: [
      { platform: "Museum Site", url: "#" },
      { platform: "Event Page", url: "#" }
    ]
  },
  {
    id: "4",
    title: "Midnight Melodies",
    type: "album",
    description: "A collection of ambient electronic compositions inspired by late-night city soundscapes and urban solitude.",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop",
    releaseDate: "2024-08-20",
    status: "published",
    category: "Electronic Music",
    tags: ["ambient", "electronic", "atmospheric", "nocturnal"],
    views: 3680,
    likes: 156,
    downloads: 234,
    shares: 89,
    isPublic: true,
    isFeatured: false,
    priceRange: "$15 - $25",
    links: [
      { platform: "Spotify", url: "#" },
      { platform: "Bandcamp", url: "#" }
    ]
  },
  {
    id: "5",
    title: "Draft Project Alpha",
    type: "series",
    description: "Work in progress - A conceptual series exploring the relationship between technology and nature.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=500&fit=crop",
    releaseDate: "2024-12-15",
    status: "draft",
    category: "Conceptual Art",
    tags: ["technology", "nature", "concept", "experimental"],
    views: 120,
    likes: 8,
    downloads: 0,
    shares: 2,
    isPublic: false,
    isFeatured: false
  }
];

export function MyOGsPage({ isDashboardDarkMode }: MyOGsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRelease, setNewRelease] = useState({
    title: "",
    type: "collection" as const,
    description: "",
    category: "",
    tags: "",
    isPublic: true,
    isFeatured: false
  });

  const filteredReleases = mockReleases.filter(release => {
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

  const handleCreateRelease = () => {
    // Handle form submission - in real app would save to backend
    console.log("Creating new release:", newRelease);
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

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`font-title text-3xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
          My OGs
        </h1>
        <p className={`mt-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage your original releases, collections, and creative projects
        </p>
      </div>

      {/* Create Release Dialog */}
      <div className="mb-8">
        <div className="flex items-center justify-end mb-4">
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
                  <Button onClick={handleCreateRelease} className="bg-[#FF8D28] hover:bg-[#FF8D28]/90">
                    Create Release
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
                    {mockReleases.length}
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
                    {mockReleases.reduce((sum, release) => sum + release.views, 0).toLocaleString()}
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
                    {mockReleases.reduce((sum, release) => sum + release.likes, 0).toLocaleString()}
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
                    {mockReleases.reduce((sum, release) => sum + release.downloads, 0).toLocaleString()}
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

