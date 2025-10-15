import React, { useState } from "react";
import { Palette, Search, Filter, Grid, List, Download, Eye, Share2, Edit, Trash2, Star, Calendar, DollarSign, Tag, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface CreationsPageProps {
  isDashboardDarkMode: boolean;
}

interface Creation {
  id: string;
  title: string;
  type: "artwork" | "design" | "concept" | "product";
  category: string;
  tags: string[];
  description: string;
  thumbnail: string;
  createdDate: string;
  completedDate?: string;
  client?: string;
  value?: number;
  status: "completed" | "personal" | "sold" | "licensed";
  rating?: number;
  views: number;
  likes: number;
  downloads: number;
  isPublic: boolean;
  isPremium: boolean;
}

const mockCreations: Creation[] = [
  {
    id: "1",
    title: "Abstract Digital Landscape",
    type: "artwork",
    category: "Digital Art",
    tags: ["abstract", "landscape", "digital", "modern"],
    description: "A vibrant abstract interpretation of natural landscapes using digital techniques",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    createdDate: "2024-11-15",
    completedDate: "2024-11-20",
    status: "completed",
    rating: 5,
    views: 1240,
    likes: 89,
    downloads: 23,
    isPublic: true,
    isPremium: false
  },
  {
    id: "2",
    title: "Brand Identity for TechFlow",
    type: "design",
    category: "Branding",
    tags: ["logo", "branding", "corporate", "tech"],
    description: "Complete brand identity system including logo, color palette, and typography",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    createdDate: "2024-10-10",
    completedDate: "2024-11-05",
    client: "TechFlow Inc.",
    value: 2500,
    status: "sold",
    rating: 5,
    views: 856,
    likes: 67,
    downloads: 12,
    isPublic: false,
    isPremium: true
  },
  {
    id: "3",
    title: "Mobile App UI Concept",
    type: "concept",
    category: "UI/UX Design",
    tags: ["mobile", "app", "ui", "modern", "clean"],
    description: "Modern mobile application interface design with focus on user experience",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    createdDate: "2024-12-01",
    completedDate: "2024-12-08",
    status: "personal",
    views: 432,
    likes: 34,
    downloads: 8,
    isPublic: true,
    isPremium: false
  },
  {
    id: "4",
    title: "Character Design Collection",
    type: "artwork",
    category: "Character Design",
    tags: ["character", "fantasy", "illustration", "collection"],
    description: "Set of fantasy character designs for gaming and animation projects",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    createdDate: "2024-09-20",
    completedDate: "2024-10-15",
    client: "Game Studios Ltd",
    value: 1800,
    status: "licensed",
    rating: 4,
    views: 2340,
    likes: 156,
    downloads: 45,
    isPublic: true,
    isPremium: true
  },
  {
    id: "5",
    title: "Product Packaging Design",
    type: "product",
    category: "Packaging",
    tags: ["packaging", "product", "sustainable", "minimal"],
    description: "Eco-friendly packaging design for organic skincare products",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    createdDate: "2024-11-01",
    completedDate: "2024-11-25",
    client: "Green Beauty Co.",
    value: 1200,
    status: "completed",
    rating: 5,
    views: 678,
    likes: 52,
    downloads: 15,
    isPublic: false,
    isPremium: false
  },
  {
    id: "6",
    title: "Website Landing Page",
    type: "design",
    category: "Web Design",
    tags: ["web", "landing", "responsive", "modern"],
    description: "Clean and modern landing page design for SaaS startup",
    thumbnail: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
    createdDate: "2024-08-15",
    completedDate: "2024-09-10",
    status: "personal",
    views: 1560,
    likes: 94,
    downloads: 38,
    isPublic: true,
    isPremium: false
  }
];

export function CreationsPage({ isDashboardDarkMode }: CreationsPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredCreations = mockCreations.filter(creation => {
    const matchesSearch = creation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || creation.type === filterType;
    const matchesStatus = filterStatus === "all" || creation.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedCreations = [...filteredCreations].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.completedDate || b.createdDate).getTime() - new Date(a.completedDate || a.createdDate).getTime();
      case "popular":
        return b.views - a.views;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "value":
        return (b.value || 0) - (a.value || 0);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "completed": { variant: "default" as const, color: "bg-green-500" },
      "personal": { variant: "secondary" as const, color: "bg-blue-500" },
      "sold": { variant: "default" as const, color: "bg-[#FF8D28]" },
      "licensed": { variant: "outline" as const, color: "bg-purple-500" }
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
      artwork: "🎨",
      design: "✏️",
      concept: "💡",
      product: "📦"
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  const CreationCard = ({ creation }: { creation: Creation }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700 hover:border-[#FF8D28]/50" : "bg-white border-gray-200 hover:border-[#FF8D28]/50"}`}>
      <div className="relative">
        <ImageWithFallback
          src={creation.thumbnail}
          alt={creation.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge(creation.status)}
          {creation.isPremium && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Star className="w-3 h-3 mr-1" />
              Premium
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
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(creation.type)}</span>
            <h3 className={`font-title text-lg font-semibold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              {creation.title}
            </h3>
          </div>
          {creation.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-yellow-600">{creation.rating}</span>
            </div>
          )}
        </div>
        
        <p className={`text-sm mb-3 line-clamp-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {creation.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {creation.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {creation.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{creation.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className={`flex items-center justify-between text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {creation.views}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {creation.likes}
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {creation.downloads}
            </div>
          </div>
          {creation.value && (
            <div className="flex items-center gap-1 text-green-600">
              <DollarSign className="w-4 h-4" />
              ${creation.value.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const CreationListItem = ({ creation }: { creation: Creation }) => (
    <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <ImageWithFallback
            src={creation.thumbnail}
            alt={creation.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(creation.type)}</span>
                <h3 className={`font-title text-lg font-semibold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  {creation.title}
                </h3>
                {getStatusBadge(creation.status)}
              </div>
              <div className="flex items-center gap-2">
                {creation.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-yellow-600">{creation.rating}</span>
                  </div>
                )}
                {creation.value && (
                  <div className="flex items-center gap-1 text-green-600">
                    <DollarSign className="w-4 h-4" />
                    ${creation.value.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            <p className={`text-sm mb-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {creation.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {creation.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
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
          Creations
        </h1>
        <p className={`mt-2 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage and showcase your creative works and portfolio
        </p>
      </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Palette className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {mockCreations.length}
                    </p>
                    <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Total Creations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      ${mockCreations.reduce((sum, c) => sum + (c.value || 0), 0).toLocaleString()}
                    </p>
                    <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Total Value
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {mockCreations.reduce((sum, c) => sum + c.views, 0).toLocaleString()}
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
                      {mockCreations.reduce((sum, c) => sum + c.likes, 0)}
                    </p>
                    <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Total Likes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search creations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="artwork">Artwork</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="licensed">Licensed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="value">Value</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

        {/* Results */}
        <div className="mb-4">
          <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Showing {sortedCreations.length} of {mockCreations.length} creations
          </p>
        </div>

        {/* Creations Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCreations.map((creation) => (
              <CreationCard key={creation.id} creation={creation} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCreations.map((creation) => (
              <CreationListItem key={creation.id} creation={creation} />
            ))}
          </div>
        )}

        {sortedCreations.length === 0 && (
          <div className="text-center py-12">
            <Palette className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? "text-gray-600" : "text-gray-400"}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              No creations found
            </h3>
            <p className={`${isDashboardDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
    </div>
  );
}

