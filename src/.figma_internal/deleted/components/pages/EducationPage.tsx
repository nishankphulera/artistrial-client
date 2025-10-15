import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Briefcase, Clock, Calendar, User, Plus, Heart, Eye, BookOpen, Play, Users, Award, GraduationCap, Video, FileText, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { FavoritesButton } from '../shared/FavoritesButton';
import { RatingSystem } from '../shared/RatingSystem';
import { FilterSidebar, FilterConfig, FilterState } from '../shared/FilterSidebar';
import { UserProfileLink } from '../shared/UserProfileLink';
import { useAuth } from '../providers/AuthProvider';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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

export function EducationPage({ isDashboardDarkMode = false }: EducationPageProps) {
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
    moduleType: 'education'
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

    setCourses(sampleCourses);
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('q', filters.searchTerm);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.location !== 'all') params.append('location', filters.location);
      if (filters.availability !== 'all') params.append('availability', filters.availability);
      if (filters.minRating > 0) params.append('min_rating', filters.minRating.toString());
      if (filters.sortBy) params.append('sort', filters.sortBy);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/education?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/reviews/education/${courseId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
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

  const handleSubmitEnrollment = async () => {
    if (!selectedCourse || !user) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/enrollments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: selectedCourse.id,
            student_id: user.id,
            ...enrollmentForm
          }),
        }
      );

      if (response.ok) {
        alert('Enrollment successful! Check your email for course details.');
        setShowEnrollDialog(false);
        setEnrollmentForm({
          enrollmentType: 'full_course',
          startDate: '',
          paymentPlan: 'full_payment',
          specialRequests: ''
        });
      } else {
        alert('Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      alert('Failed to enroll in course');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !filters.searchTerm || 
      course.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    // Main category matching - now handles arrays
    const matchesMainCategory = !Array.isArray(filters.category) || filters.category.length === 0 || 
      filters.category.some(category => course.category.toLowerCase().includes(category.toLowerCase()));
    
    // Subcategory matching - now handles arrays
    const matchesSubcategory = !Array.isArray(filters.subcategory) || filters.subcategory.length === 0 ||
      filters.subcategory.some(subcategory => course.category.toLowerCase().includes(subcategory.toLowerCase()));
    
    const matchesLocation = filters.location === 'all' || 
      course.location.includes(filters.location) ||
      course.format.toLowerCase() === filters.location.toLowerCase();
    
    const matchesAvailability = filters.availability === 'all' || 
      course.availability.toLowerCase() === filters.availability.toLowerCase();
    
    const matchesRating = (course.rating || 0) >= filters.minRating;
    
    const matchesPrice = course.price >= filters.priceRange[0] && 
      course.price <= filters.priceRange[1];
    
    return matchesSearch && matchesMainCategory && matchesSubcategory && matchesLocation && 
           matchesAvailability && matchesRating && matchesPrice;
  });

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="flex h-full">
        {/* Filter Sidebar */}
        <FilterSidebar
          config={filterConfig}
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredCourses.length}
          isDashboardDarkMode={isDashboardDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-auto scrollbar-hide">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex-1">
              <h1 className="mb-2 lg:mb-4 font-title text-2xl lg:text-3xl">Education & Learning</h1>
              <p className="text-muted-foreground">
                Advance your creative skills with courses, workshops, and masterclasses from industry professionals. 
                Learn at your own pace or join live sessions.
              </p>
            </div>
            {user && (
              <Button onClick={() => setShowCreateCourse(true)} className="flex items-center gap-2 w-full lg:w-auto">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            )}
          </div>

          {/* Search and Category Section */}
          <div className={`${isDashboardDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-4 sm:p-6 mb-6 lg:mb-8 space-y-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              {/* Main Category Filter - Multi-select */}
              <div className="sm:col-span-1 lg:col-span-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between text-left font-normal"
                    >
                      {Array.isArray(filters.category) && filters.category.length > 0
                        ? `${filters.category.length} categories selected`
                        : "All Categories"
                      }
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <div className="p-4 space-y-2">
                      <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                        {filterConfig.categories?.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.value}`}
                              checked={Array.isArray(filters.category) && filters.category.includes(category.value)}
                              onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                            />
                            <label
                              htmlFor={`category-${category.value}`}
                              className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category.icon}
                              {category.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Subcategory Filter - Multi-select */}
              <div className="sm:col-span-1 lg:col-span-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between text-left font-normal"
                      disabled={!Array.isArray(filters.category) || filters.category.length === 0 || getSubcategories().length === 0}
                    >
                      {Array.isArray(filters.subcategory) && filters.subcategory.length > 0
                        ? `${filters.subcategory.length} subcategories selected`
                        : "All Subcategories"
                      }
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <div className="p-4 space-y-2">
                      <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                        {Array.isArray(filters.category) && filters.category.map((categoryValue) => {
                          const categoryData = categoryStructure[categoryValue as keyof typeof categoryStructure];
                          if (!categoryData || !categoryData.subcategories) return null;
                          
                          return (
                            <div key={categoryValue} className="space-y-2">
                              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {categoryData.label}
                              </h5>
                              <div className="space-y-2 pl-2">
                                {categoryData.subcategories.map((subcategory) => (
                                  <div key={subcategory.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`subcategory-${subcategory.value}`}
                                      checked={Array.isArray(filters.subcategory) && filters.subcategory.includes(subcategory.value)}
                                      onCheckedChange={(checked) => handleSubcategoryChange(subcategory.value, checked as boolean)}
                                    />
                                    <label
                                      htmlFor={`subcategory-${subcategory.value}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {subcategory.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Input */}
              <div className="sm:col-span-2 lg:col-span-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search courses, instructors, or topics..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.searchTerm || 
              (Array.isArray(filters.category) && filters.category.length > 0) || 
              (Array.isArray(filters.subcategory) && filters.subcategory.length > 0)) && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {filters.searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {filters.searchTerm}
                      <button onClick={() => setFilters({...filters, searchTerm: ''})} className="ml-1 hover:bg-gray-200 rounded">
                        ×
                      </button>
                    </Badge>
                  )}
                  {Array.isArray(filters.category) && filters.category.map(category => {
                    const categoryData = Object.entries(categoryStructure).find(([key]) => key === category);
                    return (
                      <Badge key={category} variant="secondary" className="gap-1">
                        {categoryData ? categoryData[1].label : category}
                        <button onClick={() => handleCategoryChange(category, false)} className="ml-1 hover:bg-gray-200 rounded">
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                  {Array.isArray(filters.subcategory) && filters.subcategory.map(subcategory => (
                    <Badge key={subcategory} variant="secondary" className="gap-1">
                      {subcategory}
                      <button onClick={() => handleSubcategoryChange(subcategory, false)} className="ml-1 hover:bg-gray-200 rounded">
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <FavoritesButton 
                          itemId={course.id} 
                          itemType="education"
                          className="bg-white/80 hover:bg-white"
                        />
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant={course.availability === 'Available' ? 'default' : course.availability === 'Full' ? 'destructive' : 'secondary'}>
                          {course.availability}
                        </Badge>
                        <Badge variant="outline" className="bg-white/90">
                          {course.format}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="outline" className="bg-white/90">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{course.title}</h3>
                          <UserProfileLink 
                            userId={course.instructorId}
                            userName={course.instructor}
                            className="text-sm text-muted-foreground hover:text-primary"
                          />
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${course.price}</div>
                          <div className="text-xs text-muted-foreground">{course.duration}</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating}</span>
                          <span className="text-sm text-muted-foreground">({course.total_reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{course.students_enrolled} students</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{course.location}</span>
                        {course.next_start_date && (
                          <>
                            <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
                            <span className="text-sm text-muted-foreground">
                              Starts {new Date(course.next_start_date).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEnrollCourse(course)}
                          className="flex-1"
                          disabled={course.availability === 'Full'}
                        >
                          <GraduationCap className="h-4 w-4 mr-2" />
                          {course.availability === 'Full' ? 'Course Full' : 'Enroll Now'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enroll in {selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              Complete your enrollment with {selectedCourse?.instructor}
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <ImageWithFallback 
                  src={selectedCourse.thumbnail} 
                  alt={selectedCourse.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedCourse.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedCourse.instructor}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-bold text-lg">${selectedCourse.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedCourse.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{selectedCourse.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollment_type">Enrollment Type</Label>
                  <Select value={enrollmentForm.enrollmentType} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, enrollmentType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_course">Full Course</SelectItem>
                      <SelectItem value="audit_only">Audit Only</SelectItem>
                      <SelectItem value="certificate">With Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_plan">Payment Plan</Label>
                  <Select value={enrollmentForm.paymentPlan} onValueChange={(value) => setEnrollmentForm({...enrollmentForm, paymentPlan: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_payment">Full Payment</SelectItem>
                      <SelectItem value="installments">3 Installments</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedCourse.next_start_date && (
                <div className="space-y-2">
                  <Label htmlFor="start_date">Preferred Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={enrollmentForm.startDate}
                    onChange={(e) => setEnrollmentForm({...enrollmentForm, startDate: e.target.value})}
                    min={selectedCourse.next_start_date}
                  />
                  <p className="text-sm text-muted-foreground">
                    Next available start: {new Date(selectedCourse.next_start_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="special_requests">Special Requests</Label>
                <Textarea
                  id="special_requests"
                  placeholder="Any special learning needs or requests..."
                  value={enrollmentForm.specialRequests}
                  onChange={(e) => setEnrollmentForm({...enrollmentForm, specialRequests: e.target.value})}
                />
              </div>
              
              {/* Course Curriculum */}
              {selectedCourse.curriculum && selectedCourse.curriculum.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Course Curriculum</h4>
                  <div className="space-y-2">
                    {selectedCourse.curriculum.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Reviews Section */}
              {reviews.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Student Reviews</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {reviews.slice(0, 3).map((review: any, index) => (
                      <div key={index} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <RatingSystem rating={review.rating} size="sm" readOnly />
                          <span className="text-sm font-medium">{review.reviewer_name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-bold">
                  Total: ${selectedCourse.price}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitEnrollment}>
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

