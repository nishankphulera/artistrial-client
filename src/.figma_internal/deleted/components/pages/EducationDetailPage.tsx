import React, { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, 
  Star, 
  MessageSquare, 
  Share2, 
  Heart, 
  DollarSign,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Play,
  Download,
  BookOpen,
  Award,
  Globe,
  Video,
  FileText,
  Headphones,
  Monitor,
  Smartphone,
  GraduationCap,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useAuth } from '../providers/AuthProvider';

export interface Course {
  id: string;
  title: string;
  type: 'Course' | 'Workshop' | 'Masterclass' | 'Tutorial Series' | 'Certification';
  category: string;
  price: number;
  originalPrice?: number;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    credentials: string[];
    verified: boolean;
    students_taught: number;
    courses_created: number;
  };
  description: string;
  images: string[];
  duration: string;
  lessons_count: number;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  what_you_learn: string[];
  requirements: string[];
  includes: string[];
  curriculum: {
    section: string;
    lessons: { title: string; duration: string; free_preview?: boolean }[];
  }[];
  rating: number;
  total_reviews: number;
  students_enrolled: number;
  completion_rate: number;
  certificate_offered: boolean;
  lifetime_access: boolean;
  mobile_access: boolean;
  created_at: string;
  last_updated: string;
  tags: string[];
}

interface EducationDetailPageProps {
  isDashboardDarkMode?: boolean;
  isDashboardContext?: boolean;
}

export const EducationDetailPage: React.FC<EducationDetailPageProps> = ({
  isDashboardDarkMode = false,
  isDashboardContext = false
}) => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Use the explicit prop if provided, otherwise fallback to location detection
  const isInDashboard = isDashboardContext || pathname.startsWith('/dashboard');

  useEffect(() => {
    loadCourseDetails();
  }, [id]);

  const loadCourseDetails = async () => {
    setLoading(true);
    try {
      // Sample data for now - replace with actual API call
      const sampleCourse: Course = {
        id: id || 'course1',
        title: 'Complete Digital Art Mastery: From Beginner to Professional',
        type: 'Course',
        category: 'Digital Art',
        price: 199.99,
        originalPrice: 299.99,
        instructor: {
          id: 'instructor1',
          name: 'Maria Rodriguez',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          bio: 'Professional digital artist with 10+ years of experience in the industry. Former concept artist at major gaming studios and current freelance illustrator.',
          credentials: [
            'BFA Digital Arts, Art Center College',
            'Former Senior Artist at Blizzard Entertainment',
            'Over 50k students taught worldwide'
          ],
          verified: true,
          students_taught: 52000,
          courses_created: 8
        },
        description: 'Master the art of digital painting and illustration with this comprehensive course. Learn industry-standard techniques, software mastery, and develop your unique artistic style. Perfect for aspiring digital artists, traditional artists transitioning to digital, or anyone looking to enhance their creative skills.',
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=800&h=600&fit=crop'
        ],
        duration: '25 hours',
        lessons_count: 89,
        skill_level: 'All Levels',
        language: 'English',
        what_you_learn: [
          'Master digital painting fundamentals and advanced techniques',
          'Learn industry-standard software (Photoshop, Procreate, Clip Studio)',
          'Develop your unique artistic style and creative voice',
          'Understand color theory, composition, and lighting',
          'Create professional-quality digital illustrations',
          'Build a portfolio that stands out to clients and employers',
          'Learn workflow optimization and time-saving techniques',
          'Understand the business side of digital art careers'
        ],
        requirements: [
          'No prior digital art experience required',
          'Computer or tablet with internet connection',
          'Access to drawing software (free options provided)',
          'Drawing tablet recommended but not required'
        ],
        includes: [
          '89 high-quality video lessons',
          'Downloadable exercise files and brushes',
          'Lifetime access to course content',
          'Certificate of completion',
          'Access on mobile and desktop',
          'English subtitles included'
        ],
        curriculum: [
          {
            section: 'Getting Started',
            lessons: [
              { title: 'Course Introduction and Overview', duration: '5:32', free_preview: true },
              { title: 'Essential Software and Tools', duration: '12:45', free_preview: true },
              { title: 'Setting Up Your Workspace', duration: '8:21' },
              { title: 'Basic Navigation and Interface', duration: '15:30' }
            ]
          },
          {
            section: 'Digital Art Fundamentals',
            lessons: [
              { title: 'Understanding Digital Canvas and Resolution', duration: '10:15' },
              { title: 'Brush Basics and Customization', duration: '18:42' },
              { title: 'Layers and Blending Modes', duration: '22:10' },
              { title: 'Color Theory for Digital Artists', duration: '25:33' }
            ]
          },
          {
            section: 'Advanced Techniques',
            lessons: [
              { title: 'Lighting and Shading Mastery', duration: '28:45' },
              { title: 'Texture and Detail Work', duration: '31:20' },
              { title: 'Character Design Principles', duration: '35:18' },
              { title: 'Environment and Background Art', duration: '29:55' }
            ]
          }
        ],
        rating: 4.8,
        total_reviews: 1247,
        students_enrolled: 8934,
        completion_rate: 78,
        certificate_offered: true,
        lifetime_access: true,
        mobile_access: true,
        created_at: '2023-08-15',
        last_updated: '2024-01-20',
        tags: [
          'Digital Art',
          'Illustration',
          'Photoshop',
          'Character Design',
          'Color Theory',
          'Portfolio Development'
        ]
      };

      setCourse(sampleCourse);
    } catch (error) {
      console.error('Error loading course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseIcon = (type: string) => {
    switch (type) {
      case 'Course': return <BookOpen className="h-5 w-5" />;
      case 'Workshop': return <Users className="h-5 w-5" />;
      case 'Masterclass': return <Award className="h-5 w-5" />;
      case 'Tutorial Series': return <Video className="h-5 w-5" />;
      case 'Certification': return <GraduationCap className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'All Levels': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEnrollCourse = () => {
    if (!user) {
      alert('Please sign in to enroll in this course');
      return;
    }
    console.log('Enrolling in course:', course);
    // Handle enrollment logic here
  };

  const totalLessons = course?.curriculum.reduce((acc, section) => acc + section.lessons.length, 0) || 0;
  const savings = course && course.originalPrice ? course.originalPrice - course.price : 0;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-pulse">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="font-title text-xl mb-4">Course not found</h2>
          <Button onClick={() => router.push('/education')}>
            Back to Education
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      
      {/* Header - Only show if not in dashboard context */}
      {!isInDashboard && (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${isInDashboard ? 'p-4 sm:p-6 lg:p-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {/* Dashboard Back Button */}
        {isInDashboard && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/education')}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Education
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <Card className="overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={course.images[0]}
                  alt={course.title}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-[#FF8D28] text-white">
                    {course.type}
                  </Badge>
                  <Badge className={getSkillLevelColor(course.skill_level)}>
                    {course.skill_level}
                  </Badge>
                  {savings > 0 && (
                    <Badge variant="destructive">
                      Save ${savings.toFixed(2)}
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded">
                  <div className="flex items-center gap-2 text-sm">
                    <Play className="h-4 w-4" />
                    <span>{course.duration} • {course.lessons_count} lessons</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Navigation */}
            <div className="flex gap-2 border-b">
              {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'ghost'}
                  className={`capitalize ${activeTab === tab ? 'bg-[#FF8D28] hover:bg-[#FF8D28]/90' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#FF8D28]/10 rounded-lg">
                      {getCourseIcon(course.type)}
                    </div>
                    <div>
                      <h2 className="font-title text-xl">Course Overview</h2>
                      <p className="text-muted-foreground">{course.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {course.students_enrolled.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {course.rating.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {course.completion_rate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-title text-primary">
                        {course.language}
                      </div>
                      <div className="text-sm text-muted-foreground">Language</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-title text-lg mb-3">What You'll Learn</h3>
                      <div className="space-y-2">
                        {course.what_you_learn.slice(0, 6).map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-title text-lg mb-3">Requirements</h3>
                      <div className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                            <span className="text-sm">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-title text-lg mb-3">This Course Includes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {course.includes.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'curriculum' && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-title text-xl mb-4">Course Curriculum</h2>
                  <div className="space-y-4">
                    {course.curriculum.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border rounded-lg">
                        <div className="p-4 bg-muted">
                          <h3 className="font-title text-lg">{section.section}</h3>
                          <p className="text-sm text-muted-foreground">
                            {section.lessons.length} lessons
                          </p>
                        </div>
                        <div className="divide-y">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="p-3 flex items-center justify-between hover:bg-muted/50">
                              <div className="flex items-center gap-3">
                                <Play className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium text-sm">{lesson.title}</div>
                                  {lesson.free_preview && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      Free Preview
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {lesson.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'instructor' && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-title text-xl mb-4">Meet Your Instructor</h2>
                  <div className="flex items-start gap-4 mb-6">
                    <Avatar className="h-20 w-20 ring-2 ring-border">
                      <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                      <AvatarFallback>
                        {course.instructor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-title text-xl">{course.instructor.name}</h3>
                        {course.instructor.verified && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-title text-primary">
                            {course.instructor.students_taught.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Students Taught</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-title text-primary">
                            {course.instructor.courses_created}
                          </div>
                          <div className="text-sm text-muted-foreground">Courses Created</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-title text-lg mb-3">Credentials</h4>
                    <div className="space-y-2">
                      {course.instructor.credentials.map((credential, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Award className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{credential}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="font-title text-xl mb-2">{course.title}</h1>
                  
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({course.total_reviews.toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-title text-[#FF8D28]">
                        ${course.price.toFixed(2)}
                      </span>
                      {course.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-green-600">
                        You save ${savings.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Duration</span>
                    </div>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Lessons</span>
                    </div>
                    <span className="font-medium">{course.lessons_count}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Students</span>
                    </div>
                    <span className="font-medium">{course.students_enrolled.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Completion Rate</span>
                    </div>
                    <span className="font-medium">{course.completion_rate}%</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-title text-lg">Course Features</h3>
                  <div className="space-y-2">
                    {course.lifetime_access && (
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-green-500" />
                        <span>Lifetime Access</span>
                      </div>
                    )}
                    {course.mobile_access && (
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone className="h-4 w-4 text-blue-500" />
                        <span>Mobile & Desktop Access</span>
                      </div>
                    )}
                    {course.certificate_offered && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span>Certificate of Completion</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-orange-500" />
                      <span>Downloadable Resources</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                    onClick={handleEnrollCourse}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Instructor
                  </Button>

                  <div className="text-center">
                    <Button variant="link" className="text-sm">
                      <Play className="h-4 w-4 mr-2" />
                      Preview This Course
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 mx-auto mb-2" />
                  30-day money-back guarantee
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

