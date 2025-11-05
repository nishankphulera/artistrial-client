'use client'

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Briefcase, Clock, Calendar, User, Plus, Heart, Eye, BookOpen, Play, Users, Award, GraduationCap, Video, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FavoritesButton } from '@/components/shared/FavoritesButton';
import { RatingSystem } from '@/components/shared/RatingSystem';
import { FilterSidebar, FilterConfig, FilterState } from '@/components/shared/FilterSidebar';
import { UserProfileLink } from '@/components/shared/UserProfileLink';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface EducationItem {
  id: string;
  title: string;
  instructor: string;
  instructorId: string;
  location: string;
  rating: number;
  price: number;
  category: string;
  description: string;
  format: 'Online' | 'In-Person' | 'Hybrid';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  languages: string[];
  avatar: string;
  availability: 'Available' | 'Full' | 'Coming Soon';
  thumbnail: string;
  curriculum?: string[];
  total_reviews?: number;
  students_enrolled?: number;
  next_start_date?: string;
}

interface EducationPageProps {
  isDashboardDarkMode?: boolean;
}

export default function EducationPage({ isDashboardDarkMode = false }: EducationPageProps) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<EducationItem | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [reviews, setReviews] = useState([]);
  
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

  // Enrollment form state
  const [enrollmentForm, setEnrollmentForm] = useState({
    enrollmentType: 'full_course',
    startDate: '',
    paymentPlan: 'full_payment',
    specialRequests: ''
  });

  // Get subcategories for the selected main categories
  const getSubcategories = () => {
    if (!Array.isArray(filters.category) || filters.category.length === 0) {
      return [];
    }
    
    const allSubcategories: { value: string; label: string }[] = [];
    filters.category.forEach(category => {
      const categoryData = categoryStructure[category as keyof typeof categoryStructure];
      if (categoryData && categoryData.subcategories) {
        allSubcategories.push(...categoryData.subcategories);
      }
    });
    
    // Remove duplicates
    const uniqueSubcategories = allSubcategories.filter((subcategory, index, self) => 
      index === self.findIndex(s => s.value === subcategory.value)
    );
    
    return uniqueSubcategories;
  };

  // Handle multi-select category changes
  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    const currentCategories = Array.isArray(filters.category) ? filters.category : [];
    
    let newCategories;
    if (checked) {
      newCategories = [...currentCategories, categoryValue];
    } else {
      newCategories = currentCategories.filter(cat => cat !== categoryValue);
    }
    
    setFilters({
      ...filters,
      category: newCategories,
      subcategory: [] // Reset subcategories when categories change
    });
  };

  // Handle multi-select subcategory changes
  const handleSubcategoryChange = (subcategoryValue: string, checked: boolean) => {
    const currentSubcategories = Array.isArray(filters.subcategory) ? filters.subcategory : [];
    
    let newSubcategories;
    if (checked) {
      newSubcategories = [...currentSubcategories, subcategoryValue];
    } else {
      newSubcategories = currentSubcategories.filter(sub => sub !== subcategoryValue);
    }
    
    setFilters({
      ...filters,
      subcategory: newSubcategories
    });
  };

  // Category structure with main categories and subcategories
  const categoryStructure = {
    art_design: {
      label: 'Art & Design',
      icon: <BookOpen className="h-4 w-4" />,
      subcategories: [
        { value: 'digital_art', label: 'Digital Art & Illustration' },
        { value: 'traditional_art', label: 'Traditional Art Techniques' },
        { value: 'graphic_design', label: 'Graphic Design' },
        { value: 'ui_ux', label: 'UI/UX Design' },
        { value: 'branding', label: 'Branding & Identity' },
        { value: 'typography', label: 'Typography' }
      ]
    },
    photography: {
      label: 'Photography & Video',
      icon: <Video className="h-4 w-4" />,
      subcategories: [
        { value: 'portrait_photography', label: 'Portrait Photography' },
        { value: 'landscape_photography', label: 'Landscape Photography' },
        { value: 'commercial_photography', label: 'Commercial Photography' },
        { value: 'videography', label: 'Videography' },
        { value: 'video_editing', label: 'Video Editing' },
        { value: 'cinematography', label: 'Cinematography' }
      ]
    },
    music_audio: {
      label: 'Music & Audio',
      icon: <Play className="h-4 w-4" />,
      subcategories: [
        { value: 'music_production', label: 'Music Production' },
        { value: 'sound_design', label: 'Sound Design' },
        { value: 'mixing_mastering', label: 'Mixing & Mastering' },
        { value: 'instrument_lessons', label: 'Instrument Lessons' },
        { value: 'vocal_training', label: 'Vocal Training' },
        { value: 'audio_engineering', label: 'Audio Engineering' }
      ]
    },
    writing: {
      label: 'Writing & Content',
      icon: <FileText className="h-4 w-4" />,
      subcategories: [
        { value: 'creative_writing', label: 'Creative Writing' },
        { value: 'copywriting', label: 'Copywriting' },
        { value: 'screenwriting', label: 'Screenwriting' },
        { value: 'content_marketing', label: 'Content Marketing' },
        { value: 'journalism', label: 'Journalism' },
        { value: 'technical_writing', label: 'Technical Writing' }
      ]
    },
    business: {
      label: 'Creative Business',
      icon: <Briefcase className="h-4 w-4" />,
      subcategories: [
        { value: 'freelancing', label: 'Freelancing Essentials' },
        { value: 'portfolio_building', label: 'Portfolio Building' },
        { value: 'client_management', label: 'Client Management' },
        { value: 'pricing_strategy', label: 'Pricing Strategy' },
        { value: 'marketing', label: 'Creative Marketing' },
        { value: 'business_development', label: 'Business Development' }
      ]
    },
    technology: {
      label: 'Creative Technology',
      icon: <GraduationCap className="h-4 w-4" />,
      subcategories: [
        { value: 'web_development', label: 'Web Development' },
        { value: 'app_development', label: 'App Development' },
        { value: '3d_modeling', label: '3D Modeling' },
        { value: 'animation', label: 'Animation' },
        { value: 'game_development', label: 'Game Development' },
        { value: 'ar_vr', label: 'AR/VR Development' }
      ]
    }
  };

  const filterConfig: FilterConfig = {
    categories: Object.entries(categoryStructure).map(([key, category]) => ({
      value: key,
      label: category.label,
      icon: category.icon
    })),
    locations: [
      { value: 'Online', label: 'Online' },
      { value: 'New York', label: 'New York' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'London', label: 'London' },
      { value: 'Berlin', label: 'Berlin' },
      { value: 'Hybrid', label: 'Hybrid' }
    ],
    priceRange: { min: 0, max: 500 },
    availability: true,
    rating: true,
    customFilters: [
      {
        name: 'level',
        type: 'select',
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
          { value: 'all_levels', label: 'All Levels' }
        ]
      },
      {
        name: 'format',
        type: 'select',
        options: [
          { value: 'online', label: 'Online' },
          { value: 'in_person', label: 'In-Person' },
          { value: 'hybrid', label: 'Hybrid' }
        ]
      }
    ],
    moduleType: 'assets' as const
  };

  useEffect(() => {
    loadCourses();
    loadSampleData();
  }, [filters]);

  const loadSampleData = async () => {
    // Create sample educational content for demo
    const sampleCourses = [
      {
        id: 'edu1',
        title: 'Complete Digital Illustration Masterclass',
        instructor: 'Sarah Chen',
        instructorId: 'instructor1',
        location: 'Online',
        rating: 4.9,
        price: 149,
        category: 'Digital Art & Illustration',
        description: 'Master digital illustration from basics to advanced techniques using Procreate and Photoshop.',
        format: 'Online',
        duration: '8 weeks',
        level: 'Beginner',
        languages: ['English', 'Spanish'],
        avatar: '/api/placeholder/150/150',
        availability: 'Available',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['Drawing Fundamentals', 'Digital Tools', 'Color Theory', 'Character Design', 'Portfolio Building'],
        total_reviews: 247,
        students_enrolled: 1834,
        next_start_date: '2024-02-01'
      },
      {
        id: 'edu2',
        title: 'Professional Portrait Photography Workshop',
        instructor: 'Marcus Rodriguez',
        instructorId: 'instructor2',
        location: 'New York, NY',
        rating: 4.8,
        price: 299,
        category: 'Portrait Photography',
        description: 'Intensive 2-day workshop covering lighting, posing, and post-processing for stunning portraits.',
        format: 'In-Person',
        duration: '2 days',
        level: 'Intermediate',
        languages: ['English'],
        avatar: '/api/placeholder/150/150',
        availability: 'Available',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['Studio Lighting', 'Natural Light Techniques', 'Posing Direction', 'Lightroom Processing'],
        total_reviews: 89,
        students_enrolled: 156,
        next_start_date: '2024-01-20'
      },
      {
        id: 'edu3',
        title: 'Music Production Fundamentals',
        instructor: 'DJ Alex Thompson',
        instructorId: 'instructor3',
        location: 'Online',
        rating: 4.7,
        price: 199,
        category: 'Music Production',
        description: 'Learn to produce music from scratch using Logic Pro and industry-standard techniques.',
        format: 'Online',
        duration: '6 weeks',
        level: 'Beginner',
        languages: ['English', 'French'],
        avatar: '/api/placeholder/150/150',
        availability: 'Available',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['DAW Basics', 'Beat Making', 'Melody Creation', 'Mixing', 'Mastering'],
        total_reviews: 178,
        students_enrolled: 892,
        next_start_date: '2024-01-25'
      },
      {
        id: 'edu4',
        title: 'Creative Writing for Beginners',
        instructor: 'Emma Wilson',
        instructorId: 'instructor4',
        location: 'Hybrid',
        rating: 4.8,
        price: 129,
        category: 'Creative Writing',
        description: 'Discover your voice and develop storytelling skills in this comprehensive creative writing course.',
        format: 'Hybrid',
        duration: '10 weeks',
        level: 'Beginner',
        languages: ['English'],
        avatar: '/api/placeholder/150/150',
        availability: 'Available',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['Story Structure', 'Character Development', 'Dialogue', 'Writing Process', 'Publishing'],
        total_reviews: 134,
        students_enrolled: 567,
        next_start_date: '2024-02-05'
      },
      {
        id: 'edu5',
        title: 'Freelance Creative Business Bootcamp',
        instructor: 'David Kim',
        instructorId: 'instructor5',
        location: 'Online',
        rating: 4.9,
        price: 249,
        category: 'Freelancing Essentials',
        description: 'Everything you need to build and grow a successful creative freelance business.',
        format: 'Online',
        duration: '4 weeks',
        level: 'All Levels',
        languages: ['English', 'Korean'],
        avatar: '/api/placeholder/150/150',
        availability: 'Available',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['Setting Rates', 'Finding Clients', 'Contracts & Legal', 'Time Management', 'Scaling Business'],
        total_reviews: 312,
        students_enrolled: 1456,
        next_start_date: '2024-01-30'
      },
      {
        id: 'edu6',
        title: 'Advanced UI/UX Design Principles',
        instructor: 'Lisa Chang',
        instructorId: 'instructor6',
        location: 'Los Angeles, CA',
        rating: 4.8,
        price: 349,
        category: 'UI/UX Design',
        description: 'Advanced course covering modern UI/UX design principles and user research methodologies.',
        format: 'In-Person',
        duration: '3 days',
        level: 'Advanced',
        languages: ['English'],
        avatar: '/api/placeholder/150/150',
        availability: 'Full',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['User Research', 'Design Systems', 'Prototyping', 'Usability Testing', 'Design Strategy'],
        total_reviews: 98,
        students_enrolled: 45,
        next_start_date: '2024-03-15'
      },
      {
        id: 'edu7',
        title: '3D Modeling with Blender',
        instructor: 'Tom Bradley',
        instructorId: 'instructor7',
        location: 'Online',
        rating: 4.6,
        price: 179,
        category: '3D Modeling',
        description: 'Complete guide to 3D modeling using Blender, from basic shapes to complex characters.',
        format: 'Online',
        duration: '12 weeks',
        level: 'Beginner',
        languages: ['English', 'German'],
        avatar: '/api/placeholder/150/150',
        availability: 'Available',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['Blender Interface', 'Modeling Basics', 'Texturing', 'Lighting', 'Animation Basics'],
        total_reviews: 203,
        students_enrolled: 734,
        next_start_date: '2024-02-10'
      },
      {
        id: 'edu8',
        title: 'Content Marketing for Creatives',
        instructor: 'Rachel Martinez',
        instructorId: 'instructor8',
        location: 'Online',
        rating: 4.7,
        price: 99,
        category: 'Content Marketing',
        description: 'Learn how to market your creative work effectively across social media and digital platforms.',
        format: 'Online',
        duration: '4 weeks',
        level: 'All Levels',
        languages: ['English', 'Spanish'],
        avatar: '/api/placeholder/150/150',
        availability: 'Available',
        thumbnail: '/api/placeholder/400/300',
        curriculum: ['Social Media Strategy', 'Content Creation', 'Audience Building', 'Analytics', 'Brand Building'],
        total_reviews: 167,
        students_enrolled: 923,
        next_start_date: '2024-01-22'
      }
    ];

    setCourses(sampleCourses as any);
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (filters.category !== 'all') params.append('category', Array.isArray(filters.category) ? filters.category[0] : filters.category);
      if (filters.location !== 'all') params.append('location', filters.location);
      if (filters.availability !== 'all') params.append('availability', filters.availability);
      if (filters.minRating > 0) params.append('min_rating', filters.minRating.toString());
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `http://localhost:5001/api/education?${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Transform server data to match our interface
          const transformedData = data.map((course: any) => ({
            id: course.id.toString(),
            title: course.title,
            instructor: course.display_name || course.username || 'Unknown Instructor',
            instructorId: course.user_id?.toString() || 'unknown',
            location: course.location || 'Online',
            rating: 4.5 + Math.random() * 0.5, // Mock rating since not in API
            price: course.price || 0,
            category: course.category,
            description: course.description,
            format: course.format || 'Online',
            duration: course.duration || '8 weeks',
            level: course.level || 'Beginner',
            languages: course.languages || ['English'],
            avatar: course.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            availability: course.status === 'active' ? 'Available' : 'Coming Soon',
            thumbnail: course.thumbnail_url || 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
            curriculum: course.curriculum || [],
            total_reviews: Math.floor(Math.random() * 50) + 10, // Mock reviews
            students_enrolled: Math.floor(Math.random() * 20) + 5,
            next_start_date: course.start_date || new Date().toISOString().split('T')[0],
          }));
          setCourses(transformedData);
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (courseId: string) => {
    try {
      // For now, we'll use mock reviews since the server doesn't have a reviews endpoint yet
      const mockReviews = [
        {
          id: '1',
          user: 'John Doe',
          rating: 5,
          comment: 'Excellent course! Very well structured and informative.',
          date: '2024-01-15'
        },
        {
          id: '2',
          user: 'Jane Smith',
          rating: 4,
          comment: 'Great content, learned a lot. Would recommend.',
          date: '2024-01-10'
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleEnrollCourse = (course: EducationItem) => {
    if (!user) {
      alert('Please sign in to enroll in courses');
      return;
    }
    setSelectedCourse(course);
    setShowEnrollDialog(true);
    loadReviews(course.id);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCreateCourse = () => {
    if (!user) {
      alert('Please sign in to create a course');
      return;
    }
    setShowCreateCourse(true);
  };

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enrolling in course:', selectedCourse?.title, 'with options:', enrollmentForm);
    setShowEnrollDialog(false);
    // Here you would typically make an API call to enroll the user
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
        {halfStar && <Star key="half" className="h-4 w-4 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)}
      </div>
    );
  };

  const CourseCard = ({ course }: { course: EducationItem }) => (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <div className="relative">
        <ImageWithFallback
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 right-3" variant={course.availability === 'Available' ? 'secondary' : 'destructive'}>
          {course.availability}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className={`font-bold text-lg text-white ${isDashboardDarkMode ? 'text-gray-100' : ''}`}>{course.title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={course.avatar} alt={course.instructor} />
              <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
            </Avatar>
            <UserProfileLink 
              userId={course.instructorId} 
              userName={course.instructor}
              className={`text-sm font-medium ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              prefix=""
            />
          </div>
          <div className="flex items-center gap-1">
            {renderStars(course.rating)}
            <span className={`text-xs ml-1 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({course.total_reviews})</span>
          </div>
        </div>
        <p className={`text-sm mb-4 h-10 overflow-hidden ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={isDashboardDarkMode ? 'border-gray-600 text-gray-300' : ''}>{course.level}</Badge>
          <Badge variant="outline" className={isDashboardDarkMode ? 'border-gray-600 text-gray-300' : ''}>{course.format}</Badge>
          <Badge variant="outline" className={isDashboardDarkMode ? 'border-gray-600 text-gray-300' : ''}>{course.duration}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-xl font-bold ${isDashboardDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>${course.price}</p>
          <Button onClick={() => handleEnrollCourse(course)} size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`py-16 px-4 text-center ${isDashboardDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-4xl font-bold mb-4 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>Expand Your Creative Horizons</h1>
        <p className={`max-w-2xl mx-auto ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          From mastering new software to honing your artistic techniques, find the perfect course to elevate your skills.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <Input
              type="text"
              placeholder="Search for courses, skills, or instructors..."
              className={`pl-10 pr-4 py-2 w-full border rounded-md ${isDashboardDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            />
          </div>
          <Button onClick={handleCreateCourse}>
            <Plus className="mr-2 h-4 w-4" /> Become an Instructor
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex container mx-auto py-8 px-4">
        {/* Filters Sidebar */}
        <div className="w-1/4 pr-8 hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFilterChange}
            config={filterConfig}
            isDashboardDarkMode={isDashboardDarkMode}
          />
        </div>

        {/* Courses Grid */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Courses ({courses.length})</h2>
            <div className="flex items-center gap-4">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange({ sortBy: value })}
              >
                <SelectTrigger className={`w-[180px] ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="lg:hidden">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className={`animate-pulse ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <div className={`h-48 ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <CardContent className="p-4">
                    <div className={`h-4 w-3/4 mb-4 rounded ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-4 w-1/2 mb-4 rounded ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-10 w-full rounded ${isDashboardDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Dialog */}
      {selectedCourse && (
        <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
          <DialogContent className={`max-w-4xl ${isDashboardDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedCourse.title}</DialogTitle>
              <DialogDescription>
                by <UserProfileLink userId={selectedCourse.instructorId} userName={selectedCourse.instructor} className="text-purple-400" prefix="" />
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div>
                <ImageWithFallback src={selectedCourse.thumbnail} alt={selectedCourse.title} className="rounded-lg mb-4 w-full h-64 object-cover" />
                <h3 className="font-bold text-lg mb-2">Course Curriculum</h3>
                <ul className="space-y-2">
                  {selectedCourse.curriculum?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <form onSubmit={handleEnrollmentSubmit}>
                  <h3 className="font-bold text-lg mb-4">Enrollment Options</h3>
                  <div className="space-y-4">
                    {/* Enrollment Type, Start Date, Payment Plan, etc. */}
                    <p className="text-3xl font-bold text-purple-400">${selectedCourse.price}</p>
                    <Button type="submit" className="w-full" size="lg">Enroll Now</Button>
                  </div>
                </form>
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-4">Student Reviews</h3>
                  {/* Render reviews here */}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}