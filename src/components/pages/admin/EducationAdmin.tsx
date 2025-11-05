'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { 
  Grid, 
  List, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  BookOpen,
  Edit,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  Search,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CheckCircle,
  Users,
  PlayCircle,
  FileText,
  Camera,
  Palette,
  Music,
  Video,
  Monitor
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { FilterSidebar, FilterConfig, FilterState } from '../../shared/FilterSidebar';
import { FavoritesButton } from '../../shared/FavoritesButton';
import { AdminHeader } from '../../shared/AdminHeader';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useAuth } from '../../providers/AuthProvider';
import {
  useEducationData,
  EducationListing,
  EducationFilters,
  educationFilterConfig
} from '../../shared/data/EducationDataService';

interface AdminStats {
  totalCourses: number;
  myCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
}

interface EducationAdminProps {
  isDashboardDarkMode?: boolean;
}

export const EducationAdmin: React.FC<EducationAdminProps> = ({
  isDashboardDarkMode = false
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { fetchEducationListings } = useEducationData();
  const [courses, setCourses] = useState<EducationListing[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all-courses');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: [],
    subcategory: [],
    location: 'all',
    priceRange: [0, 500],
    availability: 'all',
    minRating: 0,
    sortBy: 'newest'
  });

  const filterConfig: FilterConfig = educationFilterConfig as FilterConfig;

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Convert FilterState to EducationFilters
      const educationFilters: EducationFilters = {
        searchTerm: filters.searchTerm || '',
        category: Array.isArray(filters.category) ? filters.category : [],
        subcategory: Array.isArray(filters.subcategory) ? filters.subcategory : [],
        location: filters.location,
        priceRange: filters.priceRange,
        availability: filters.availability,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      };

      // Use the unified data service
      const data = await fetchEducationListings(educationFilters, {
        context: 'admin',
        userId: user?.id,
        activeTab: activeTab,
      });

      setCourses(data);

      // Calculate admin stats from the loaded data
      const myCourses = data.filter(course => course.isOwner).length;
      setAdminStats({
        totalCourses: data.length,
        myCourses: myCourses,
        totalStudents: data.reduce((sum, course) => sum + (course.currentStudents || 0), 0),
        totalRevenue: data
          .filter(course => course.isOwner)
          .reduce((sum, course) => sum + (course.earnings || 0), 0),
        averageRating: data.length > 0 
          ? data.reduce((sum, course) => sum + (course.rating || 0), 0) / data.length 
          : 0,
        completionRate: data.length > 0
          ? data.reduce((sum, course) => sum + 85, 0) / data.length  // Default completion rate
          : 0,
      });
    } catch (error) {
      console.error('Error loading admin education data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    router.push('/dashboard/create-education');
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/dashboard/edit-course/${courseId}`);
  };

  const handleViewAnalytics = (courseId: string) => {
    router.push(`/dashboard/analytics/course/${courseId}`);
  };

  // Courses are already filtered by the data service based on activeTab
  const filteredCourses = courses;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const showFilterSidebar = activeTab === 'all-courses' || activeTab === 'online' || activeTab === 'in-person' || activeTab === 'active';

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Admin Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminHeader
          title="Education Management"
          description="Manage your courses, track student progress, and analyze learning outcomes."
          createButtonText="Create Course"
          onCreateClick={handleCreateCourse}
          createButtonIcon={<Plus className="w-4 h-4" />}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Admin Stats Dashboard */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Courses</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalCourses}
                    </p>
                  </div>
                  <BookOpen className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>My Courses</p>
                    <p className="text-2xl font-title text-green-600">
                      {adminStats.myCourses}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Students</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.totalStudents.toLocaleString()}
                    </p>
                  </div>
                  <Users className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</p>
                    <p className="text-2xl font-title text-[#FF8D28]">
                      ${(adminStats.totalRevenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-[#FF8D28]" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.averageRating.toFixed(1)}★
                    </p>
                  </div>
                  <Star className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completion</p>
                    <p className={`text-2xl font-title ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {adminStats.completionRate.toFixed(0)}%
                    </p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className={`grid w-full max-w-3xl grid-cols-5 ${isDashboardDarkMode ? 'bg-gray-800' : ''}`}>
            <TabsTrigger value="all-courses">All Courses</TabsTrigger>
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
            <TabsTrigger value="in-person">In-Person</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area with Filter Sidebar */}
      <div className="flex h-full">
        {/* Filter Sidebar - only show on listing tabs */}
        {showFilterSidebar && (
          <FilterSidebar
            config={filterConfig}
            filters={filters}
            onFiltersChange={setFilters}
            resultCount={filteredCourses.length}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide ${!showFilterSidebar ? 'w-full' : ''}`}>
          {/* All Courses Tab */}
          {(activeTab === 'all-courses' || activeTab === 'online' || activeTab === 'in-person' || activeTab === 'active') && (
            <div className="space-y-6 mt-0">
              {/* Course Grid - Responsive and Scalable */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse h-full">
                      <div className="aspect-video bg-gray-200"></div>
                      <CardContent className="p-3 sm:p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredCourses.map((course) => (
                    <Card 
                      key={course.id} 
                      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer relative h-full flex flex-col group hover:scale-105 ${
                        isDashboardDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Admin Action Menu */}
                      <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {course.isOwner && (
                              <>
                                <DropdownMenuItem onClick={() => handleEditCourse(course.id)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Course
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewAnalytics(course.id)}>
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  View Analytics
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact Instructor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Course Thumbnail */}
                      <div className="aspect-video relative overflow-hidden">
                        <ImageWithFallback
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={`${getLevelColor(course.level)} text-xs px-2 py-1`}>
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {course.duration}
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                      </div>

                      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-sm sm:text-base line-clamp-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {course.title}
                            </h3>
                            <p className={`text-xs sm:text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                              by {course.instructor}
                            </p>
                          </div>
                          <FavoritesButton 
                            entityId={course.id} 
                            entityType="project"
                            size="sm"
                          />
                        </div>

                        {/* Course Details */}
                        <div className="space-y-2 mb-3 flex-1">
                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                              <span className="text-xs sm:text-sm ml-1">{course.rating}</span>
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              ({course.totalReviews} reviews)
                            </span>
                          </div>

                          {/* Students and Capacity */}
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-muted-foreground" />
                              <span className="truncate">{course.currentStudents}/{course.maxStudents} students</span>
                            </div>
                            <Badge className={`${getStatusColor(course.status)} text-xs`}>
                              {course.status?.charAt(0).toUpperCase()}{course.status?.slice(1) || 'Active'}
                            </Badge>
                          </div>

                          {/* Format and Location */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <span className="capitalize truncate">{course.format}</span>
                            {course.location && (
                              <>
                                <span>•</span>
                                <span className="truncate">{course.location}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                          {course.description}
                        </p>

                        {/* Materials/Requirements */}
                        {course.materials && course.materials.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">Materials:</p>
                            <div className="flex flex-wrap gap-1">
                              {course.materials.slice(0, 2).map((material, index) => (
                                <Badge key={index} variant="outline" className="text-xs truncate max-w-[80px]">
                                  {material}
                                </Badge>
                              ))}
                              {course.materials.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{course.materials.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Price and Action */}
                        <div className="flex items-center justify-between pt-2 mt-auto">
                          <div className="text-lg sm:text-xl font-bold">
                            ${course.price}
                            <span className="text-xs sm:text-sm text-muted-foreground ml-1">{course.currency}</span>
                          </div>
                          <div className="flex gap-1 sm:gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/courses/${course.id}`)}
                              className="text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            {course.isOwner && (
                              <Button 
                                size="sm"
                                onClick={() => handleEditCourse(course.id)}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm px-2 sm:px-3"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your filters or create a new course.
                  </p>
                  <Button onClick={handleCreateCourse} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === 'my-courses' && (
            <div className="space-y-6 mt-0">
              {/* My Courses Content */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                      <div className="aspect-video bg-gray-200"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.filter(course => course.isOwner).map((course) => (
                    <Card 
                      key={course.id} 
                      className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative ${
                        isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''
                      }`}
                    >
                      {/* Same card content as above but with owner-specific actions */}
                      <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditCourse(course.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewAnalytics(course.id)}>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="aspect-video relative">
                        <ImageWithFallback
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={`${getLevelColor(course.level)} text-xs`}>
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {course.duration}
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className={`font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {course.title}
                        </h3>
                        
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}>Students</span>
                            <span>{course.currentStudents}/{course.maxStudents}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}>Earnings</span>
                            <span className="text-green-600 font-medium">${course.earnings || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className={isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}>Rating</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewAnalytics(course.id)}
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                          <Button 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditCourse(course.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty state for my courses */}
              {!loading && filteredCourses.filter(course => course.isOwner).length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses created yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start building your education business by creating your first course.
                  </p>
                  <Button onClick={handleCreateCourse} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

