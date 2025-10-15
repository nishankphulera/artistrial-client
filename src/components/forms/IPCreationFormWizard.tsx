import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Calendar,
  Users,
  Clock,
  MapPin,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Building,
  Briefcase,
  Music,
  Camera,
  Palette,
  FileText,
  Code,
  Zap,
  Video,
  Image as ImageIcon,
  Settings,
  Target,
  Star,
  DollarSign
} from 'lucide-react';

interface IPCreationFormWizardProps {
  isDashboardDarkMode?: boolean;
}

// Step 1: Event/Project Types
const PROJECT_TYPES = [
  { 
    value: 'event', 
    label: 'Event', 
    icon: Calendar, 
    description: 'Conferences, workshops, exhibitions, performances',
    examples: ['Art Exhibition', 'Music Concert', 'Tech Conference', 'Workshop']
  },
  { 
    value: 'project', 
    label: 'Project', 
    icon: Briefcase, 
    description: 'Creative projects, collaborations, productions',
    examples: ['Film Production', 'Album Creation', 'Art Installation', 'App Development']
  }
];

// Step 2: Categories based on project type
const CATEGORIES = {
  event: [
    { value: 'exhibition', label: 'Art Exhibition', subcategories: ['Solo Show', 'Group Show', 'Gallery Opening', 'Pop-up Show'] },
    { value: 'performance', label: 'Performance', subcategories: ['Concert', 'Theater', 'Dance', 'Poetry Reading'] },
    { value: 'conference', label: 'Conference/Workshop', subcategories: ['Tech Conference', 'Art Workshop', 'Masterclass', 'Panel Discussion'] },
    { value: 'festival', label: 'Festival', subcategories: ['Music Festival', 'Art Festival', 'Film Festival', 'Food Festival'] },
  ],
  project: [
    { value: 'visual-art', label: 'Visual Art', subcategories: ['Painting', 'Sculpture', 'Digital Art', 'Mixed Media'] },
    { value: 'design', label: 'Design', subcategories: ['Graphic Design', 'Web Design', 'Product Design', 'Brand Identity'] },
    { value: 'media', label: 'Media Production', subcategories: ['Film', 'Documentary', 'Animation', 'Podcast'] },
    { value: 'music', label: 'Music', subcategories: ['Album', 'Single', 'EP', 'Soundtrack'] },
  ],
  service: [
    { value: 'creative-services', label: 'Creative Services', subcategories: ['Design Services', 'Photography', 'Writing', 'Consulting'] },
    { value: 'education', label: 'Education & Training', subcategories: ['Workshops', 'Mentorship', 'Online Courses', 'Tutorials'] },
    { value: 'technical', label: 'Technical Services', subcategories: ['Development', 'IT Support', 'Digital Marketing', 'SEO'] },
  ],
  product: [
    { value: 'physical', label: 'Physical Products', subcategories: ['Art Prints', 'Merchandise', 'Books', 'Crafts'] },
    { value: 'digital', label: 'Digital Products', subcategories: ['Software', 'Digital Art', 'Templates', 'Stock Photos'] },
    { value: 'course', label: 'Educational Content', subcategories: ['Online Course', 'Ebook', 'Video Series', 'Audio Guide'] },
  ]
};

// Step 3: Requirements and Itinerary  
const REQUIREMENT_TYPES = [
  { value: 'venue', label: 'Venue', icon: Building, description: 'Physical location or space' },
  { value: 'talent', label: 'Talent/Artists', icon: User, description: 'Creative professionals and artists' },
  { value: 'equipment', label: 'Equipment', icon: Settings, description: 'Technical equipment and tools' },
  { value: 'catering', label: 'Catering', icon: Target, description: 'Food and beverage services' },
  { value: 'marketing', label: 'Marketing', icon: Star, description: 'Promotion and marketing services' },
  { value: 'logistics', label: 'Logistics', icon: Users, description: 'Transportation and coordination' },
];

// Suggested requirements based on project type
const SUGGESTED_REQUIREMENTS = {
  event: [
    { type: 'venue', title: 'Event Venue', description: 'Gallery space or exhibition hall', priority: 'high' },
    { type: 'talent', title: 'Featured Artists', description: '3-5 local artists for exhibition', priority: 'high' },
    { type: 'equipment', title: 'Display Equipment', description: 'Easels, lighting, and display cases', priority: 'medium' },
    { type: 'catering', title: 'Opening Reception', description: 'Light refreshments for 50-100 guests', priority: 'medium' },
    { type: 'marketing', title: 'Event Promotion', description: 'Social media and press coverage', priority: 'high' },
    { type: 'logistics', title: 'Setup & Coordination', description: 'Event coordination and logistics', priority: 'medium' },
  ],
  project: [
    { type: 'talent', title: 'Creative Team', description: 'Artists, designers, and creative professionals', priority: 'high' },
    { type: 'equipment', title: 'Production Tools', description: 'Software licenses, hardware, and tools', priority: 'high' },
    { type: 'venue', title: 'Studio Space', description: 'Creative workspace or studio rental', priority: 'medium' },
    { type: 'marketing', title: 'Project Promotion', description: 'Marketing and PR for project launch', priority: 'medium' },
    { type: 'logistics', title: 'Project Management', description: 'Coordination and timeline management', priority: 'high' },
  ],
  service: [
    { type: 'talent', title: 'Service Providers', description: 'Qualified professionals and consultants', priority: 'high' },
    { type: 'equipment', title: 'Service Tools', description: 'Professional equipment and software', priority: 'medium' },
    { type: 'venue', title: 'Service Location', description: 'Office space or meeting rooms', priority: 'low' },
    { type: 'marketing', title: 'Service Marketing', description: 'Client acquisition and branding', priority: 'high' },
  ],
  product: [
    { type: 'talent', title: 'Development Team', description: 'Developers, designers, and specialists', priority: 'high' },
    { type: 'equipment', title: 'Development Tools', description: 'Software, hardware, and production equipment', priority: 'high' },
    { type: 'marketing', title: 'Product Launch', description: 'Marketing campaign and launch strategy', priority: 'high' },
    { type: 'logistics', title: 'Distribution', description: 'Manufacturing and distribution logistics', priority: 'medium' },
  ]
};

interface FormData {
  // Step 1
  projectType: string;
  
  // Step 2
  category: string;
  subcategory: string;
  title: string;
  description: string;
  
  // Step 3
  requirements: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    quantity: number;
    budget?: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  itinerary: Array<{
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: string;
    location?: string;
    requirements: string[];
    assignedUsers?: string[];
  }>;
  selectedUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    requirements: string[];
  }>;
}

const MOCK_USERS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Photographer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b812c8d5?w=40&h=40&fit=crop&crop=face', skills: ['Photography', 'Visual Arts', 'Post-Production'] },
  { id: '2', name: 'Mike Chen', email: 'mike@example.com', role: 'Graphic Designer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', skills: ['Graphic Design', 'Branding', 'UI/UX'] },
  { id: '3', name: 'Emily Davis', email: 'emily@example.com', role: 'Event Manager', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', skills: ['Event Planning', 'Coordination', 'Vendor Management'] },
  { id: '4', name: 'Alex Rodriguez', email: 'alex@example.com', role: 'Sound Engineer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', skills: ['Audio Engineering', 'Live Sound', 'Music Production'] },
  { id: '5', name: 'Lisa Wang', email: 'lisa@example.com', role: 'Marketing Specialist', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face', skills: ['Digital Marketing', 'Social Media', 'Content Strategy'] },
  { id: '6', name: 'James Wilson', email: 'james@example.com', role: 'Video Producer', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face', skills: ['Video Production', 'Editing', 'Cinematography'] },
  { id: '7', name: 'Maria Garcia', email: 'maria@example.com', role: 'Art Director', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=40&h=40&fit=crop&crop=face', skills: ['Art Direction', 'Creative Strategy', 'Brand Development'] },
  { id: '8', name: 'David Kim', email: 'david@example.com', role: 'Web Developer', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face', skills: ['Web Development', 'Frontend', 'React'] },
];

// Sample timeline data based on project type
const SAMPLE_TIMELINE_DATA = {
  event: [
    {
      title: 'Pre-Production Planning',
      description: 'Initial concept development and venue booking',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '17:00',
      location: 'Project Office',
      assignedUsers: ['3', '5'], // Emily Davis, Lisa Wang
      status: 'planned'
    },
    {
      title: 'Artist Recruitment & Selection',
      description: 'Reach out to artists and finalize participation',
      date: '2024-01-20',
      startTime: '10:00',
      endTime: '16:00',
      location: 'Remote',
      assignedUsers: ['3', '7'], // Emily Davis, Maria Garcia
      status: 'planned'
    },
    {
      title: 'Marketing Campaign Launch',
      description: 'Social media campaign and press release',
      date: '2024-02-01',
      startTime: '09:00',  
      endTime: '18:00',
      location: 'Marketing Office',
      assignedUsers: ['5'], // Lisa Wang
      status: 'planned'
    },
    {
      title: 'Exhibition Setup',
      description: 'Install artworks and prepare venue',
      date: '2024-02-14',
      startTime: '08:00',
      endTime: '20:00',
      location: 'Gallery Space',
      assignedUsers: ['3', '1'], // Emily Davis, Sarah Johnson
      status: 'planned'
    },
    {
      title: 'Opening Reception',
      description: 'Official opening event with networking',
      date: '2024-02-15',
      startTime: '18:00',
      endTime: '22:00',
      location: 'Gallery Space',
      assignedUsers: ['3', '4', '5'], // Emily Davis, Alex Rodriguez, Lisa Wang
      status: 'planned'
    }
  ],
  project: [
    {
      title: 'Project Kickoff Meeting',
      description: 'Team alignment and project scope definition',
      date: '2024-01-20',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Conference Room A',
      assignedUsers: ['2', '7', '8'], // Mike Chen, Maria Garcia, David Kim
      status: 'planned'
    },
    {
      title: 'Design & Concept Phase',
      description: 'Create initial designs and concepts',
      date: '2024-01-25',
      startTime: '09:00',
      endTime: '17:00',
      location: 'Design Studio',
      assignedUsers: ['2', '7'], // Mike Chen, Maria Garcia
      status: 'planned'
    },
    {
      title: 'Development Sprint 1',
      description: 'Core functionality development',
      date: '2024-02-05',
      startTime: '09:00',
      endTime: '17:00',
      location: 'Development Office',
      assignedUsers: ['8'], // David Kim
      status: 'planned'
    },
    {
      title: 'Content Creation',
      description: 'Photography and video content production',
      date: '2024-02-10',
      startTime: '10:00',
      endTime: '16:00',
      location: 'Studio B',
      assignedUsers: ['1', '6'], // Sarah Johnson, James Wilson
      status: 'planned'
    },
    {
      title: 'Testing & Launch Preparation',
      description: 'Quality assurance and launch planning',
      date: '2024-02-20',
      startTime: '09:00',
      endTime: '17:00',
      location: 'QA Lab',
      assignedUsers: ['8', '5'], // David Kim, Lisa Wang
      status: 'planned'
    }
  ]
};

export const IPCreationFormWizard: React.FC<IPCreationFormWizardProps> = ({ isDashboardDarkMode = false }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    category: '',
    subcategory: '',
    title: '',
    description: '',
    requirements: [],
    itinerary: [],
    selectedUsers: []
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    const newRequirement = {
      id: Date.now().toString(),
      type: '',
      title: '',
      description: '',
      quantity: 1,
      budget: 0,
      priority: 'medium' as const
    };
    setFormData(prev => ({ 
      ...prev, 
      requirements: [...prev.requirements, newRequirement] 
    }));
  };

  const updateRequirement = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map(req => 
        req.id === id ? { ...req, [field]: value } : req
      )
    }));
  };

  const removeRequirement = (id: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req.id !== id)
    }));
  };

  const addItineraryItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      date: '',
      location: '',
      requirements: []
    };
    setFormData(prev => ({ 
      ...prev, 
      itinerary: [...prev.itinerary, newItem] 
    }));
  };

  const updateItineraryItem = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItineraryItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter(item => item.id !== id)
    }));
  };

  const toggleUserSelection = (user: any, requirementId?: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedUsers.some(u => u.id === user.id);
      
      if (isSelected) {
        return {
          ...prev,
          selectedUsers: prev.selectedUsers.filter(u => u.id !== user.id)
        };
      } else {
        return {
          ...prev,
          selectedUsers: [...prev.selectedUsers, {
            ...user,
            requirements: requirementId ? [requirementId] : []
          }]
        };
      }
    });
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.projectType !== '';
      case 2:
        return formData.category !== '' && formData.subcategory !== '' && formData.title !== '';
      case 3:
        return true; // Requirements and itinerary are optional
      default:
        return false;
    }
  };

  // Step 1: Project Type Selection
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className={`font-title text-2xl mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
          What type of IP are you creating?
        </h2>
        <p className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Choose the category that best describes your intellectual property
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.projectType === type.value;
          
          return (
            <Card 
              key={type.value}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? `ring-2 ring-[#FF8D28] ${isDashboardDarkMode ? "bg-gray-700 border-[#FF8D28]" : "bg-orange-50 border-[#FF8D28]"}` 
                  : `${isDashboardDarkMode ? "bg-gray-800 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"}`
              }`}
              onClick={() => handleInputChange('projectType', type.value)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${isSelected ? "bg-[#FF8D28]" : isDashboardDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-[#FF8D28]"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-title text-lg mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                      {type.label}
                    </h3>
                    <p className={`text-sm mb-3 ${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.map((example, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`text-xs ${
                            isDashboardDarkMode ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-500"
                          }`}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  // Step 2: Category and Details
  const renderStep2 = () => {
    const availableCategories = CATEGORIES[formData.projectType as keyof typeof CATEGORIES] || [];
    const selectedCategory = availableCategories.find(cat => cat.value === formData.category);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className={`font-title text-2xl mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
            Category & Project Details
          </h2>
          <p className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Specify the category and provide basic information about your {formData.projectType}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className={`font-title text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                  {availableCategories.map((category) => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                      className={isDashboardDarkMode ? "text-white hover:bg-gray-700 focus:bg-gray-700" : ""}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCategory && (
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => handleInputChange('subcategory', value)}
                >
                  <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                    {selectedCategory.subcategories.map((sub) => (
                      <SelectItem 
                        key={sub} 
                        value={sub}
                        className={isDashboardDarkMode ? "text-white hover:bg-gray-700 focus:bg-gray-700" : ""}
                      >
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className={`font-title text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className={isDashboardDarkMode ? "text-gray-300" : ""}>
                  Project Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your project title"
                  className={`mt-2 ${isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="description" className={isDashboardDarkMode ? "text-gray-300" : ""}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project..."
                  className={`mt-2 min-h-[100px] ${isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Step 3: Requirements and Itinerary
  const renderStep3 = () => {
    const suggestedRequirements = SUGGESTED_REQUIREMENTS[formData.projectType as keyof typeof SUGGESTED_REQUIREMENTS] || [];
    const sampleTimeline = SAMPLE_TIMELINE_DATA[formData.projectType as keyof typeof SAMPLE_TIMELINE_DATA] || [];
    
    const loadSampleData = () => {
      // Load sample timeline data
      const sampleData = sampleTimeline.map((item, index) => ({
        id: `sample-${index}`,
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        date: item.date,
        location: item.location,
        requirements: [],
        assignedUsers: item.assignedUsers
      }));
      
      setFormData(prev => ({ 
        ...prev, 
        itinerary: sampleData,
        selectedUsers: MOCK_USERS.filter(user => 
          sampleTimeline.some(timeline => timeline.assignedUsers.includes(user.id))
        ).map(user => ({ ...user, requirements: [] }))
      }));
    };

    const addSuggestedRequirement = (suggested: any) => {
      const newRequirement = {
        id: Date.now().toString(),
        type: suggested.type,
        title: suggested.title,
        description: suggested.description,
        quantity: 1,
        budget: 0,
        priority: suggested.priority as 'high' | 'medium' | 'low'
      };
      setFormData(prev => ({ 
        ...prev, 
        requirements: [...prev.requirements, newRequirement] 
      }));
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className={`font-title text-2xl mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
            Requirements & Team
          </h2>
          <p className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Define what you need and build your team for this project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requirements Section */}
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`font-title text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  Requirements
                </CardTitle>
                <Button
                  onClick={addRequirement}
                  size="sm"
                  className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Custom
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Suggested Requirements */}
              {suggestedRequirements.length > 0 && (
                <div className="mb-6">
                  <h4 className={`text-sm font-medium mb-3 ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Suggested for {formData.projectType}s:
                  </h4>
                  <div className="space-y-2">
                    {suggestedRequirements.map((suggested, index) => {
                      const RequirementIcon = REQUIREMENT_TYPES.find(t => t.value === suggested.type)?.icon || Settings;
                      const isAlreadyAdded = formData.requirements.some(req => req.title === suggested.title);
                      
                      return (
                        <div 
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isDashboardDarkMode ? "border-gray-600 bg-gray-700/50" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RequirementIcon className="w-4 h-4 text-[#FF8D28]" />
                            <div>
                              <p className={`text-sm font-medium ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                                {suggested.title}
                              </p>
                              <p className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {suggested.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={suggested.priority === 'high' ? 'destructive' : suggested.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {suggested.priority}
                            </Badge>
                            <Button
                              onClick={() => addSuggestedRequirement(suggested)}
                              disabled={isAlreadyAdded}
                              size="sm"
                              variant="outline"
                              className={`${
                                isDashboardDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-600" : ""
                              } ${isAlreadyAdded ? "opacity-50" : ""}`}
                            >
                              {isAlreadyAdded ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Requirements */}
              {formData.requirements.length === 0 ? (
                <div className={`text-center py-8 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No custom requirements added yet</p>
                  <p className="text-sm">Use suggested requirements or add custom ones</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Added Requirements ({formData.requirements.length}):
                  </h4>
                  {formData.requirements.map((req) => {
                    const RequirementIcon = REQUIREMENT_TYPES.find(t => t.value === req.type)?.icon || Settings;
                    
                    return (
                      <Card key={req.id} className={isDashboardDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Select 
                              value={req.type} 
                              onValueChange={(value) => updateRequirement(req.id, 'type', value)}
                            >
                              <SelectTrigger className={`w-full ${isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}>
                                <SelectValue placeholder="Select requirement type" />
                              </SelectTrigger>
                              <SelectContent className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                                {REQUIREMENT_TYPES.map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <SelectItem 
                                      key={type.value} 
                                      value={type.value}
                                      className={isDashboardDarkMode ? "text-white hover:bg-gray-700 focus:bg-gray-700" : ""}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => removeRequirement(req.id)}
                              size="sm"
                              variant="ghost"
                              className={`ml-2 ${isDashboardDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Input
                            value={req.title}
                            onChange={(e) => updateRequirement(req.id, 'title', e.target.value)}
                            placeholder="Requirement title"
                            className={isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}
                          />
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={req.quantity}
                              onChange={(e) => updateRequirement(req.id, 'quantity', parseInt(e.target.value) || 1)}
                              placeholder="Qty"
                              min="1"
                              className={isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}
                            />
                            <Select 
                              value={req.priority} 
                              onValueChange={(value) => updateRequirement(req.id, 'priority', value)}
                            >
                              <SelectTrigger className={isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                                <SelectItem value="high" className={isDashboardDarkMode ? "text-white hover:bg-gray-700" : ""}>High Priority</SelectItem>
                                <SelectItem value="medium" className={isDashboardDarkMode ? "text-white hover:bg-gray-700" : ""}>Medium Priority</SelectItem>
                                <SelectItem value="low" className={isDashboardDarkMode ? "text-white hover:bg-gray-700" : ""}>Low Priority</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Selection */}
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`font-title text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  Team Members ({formData.selectedUsers.length})
                </CardTitle>
                <Button
                  onClick={loadSampleData}
                  size="sm"
                  variant="outline"
                  className={isDashboardDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}
                >
                  Load Sample Team
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {MOCK_USERS.map((user) => {
                  const isSelected = formData.selectedUsers.some(u => u.id === user.id);
                  
                  return (
                    <div 
                      key={user.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected 
                          ? `border-[#FF8D28] ${isDashboardDarkMode ? "bg-orange-900/20" : "bg-orange-50"}` 
                          : `${isDashboardDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-200 hover:border-gray-300"}`
                      }`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => {}}
                        className="pointer-events-none"
                      />
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-[#FF8D28] text-white text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                          {user.name}
                        </p>
                        <p className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {user.role}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1">
                              {skill}
                            </Badge>
                          ))}
                          {user.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1">
                              +{user.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {formData.selectedUsers.length > 0 && (
                <div className={`mt-6 pt-4 border-t ${isDashboardDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                  <h4 className={`font-medium text-sm mb-3 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    Selected Team Members ({formData.selectedUsers.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.selectedUsers.map((user) => (
                      <div key={user.id} className={`flex items-center justify-between p-2 rounded border ${
                        isDashboardDarkMode ? "border-gray-600 bg-gray-700/50" : "border-gray-200 bg-gray-50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-[#FF8D28] text-white text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {user.name}
                            </span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => toggleUserSelection(user)}
                          size="sm"
                          variant="ghost"
                          className={`${isDashboardDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

        {/* Itinerary Section */}
        <div className="lg:col-span-2">
          <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`font-title text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  Project Timeline & Itinerary
                </CardTitle>
                <div className="flex gap-2">
                  {sampleTimeline.length > 0 && formData.itinerary.length === 0 && (
                    <Button
                      onClick={loadSampleData}
                      size="sm"
                      variant="outline"
                      className={`${isDashboardDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
                    >
                      Load Sample Timeline
                    </Button>
                  )}
                  <Button
                    onClick={addItineraryItem}
                    size="sm"
                    variant="outline"
                    className={isDashboardDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.itinerary.length === 0 ? (
                <div className={`text-center py-12 ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No timeline items added yet</p>
                  <p className="text-sm mb-4">Create a project timeline to organize tasks and deadlines</p>
                  {sampleTimeline.length > 0 && (
                    <Button
                      onClick={loadSampleData}
                      size="sm"
                      className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                    >
                      Load Sample Timeline for {formData.projectType}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className={`text-sm ${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {formData.itinerary.length} timeline items
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {formData.selectedUsers.length} team members assigned
                    </Badge>
                  </div>
                  
                  {formData.itinerary.map((item, index) => {
                    const assignedUsers = MOCK_USERS.filter(user => 
                      item.assignedUsers?.includes(user.id)
                    );
                    
                    return (
                      <Card key={item.id} className={isDashboardDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}>
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-10 h-10 rounded-full bg-[#FF8D28] text-white flex items-center justify-center text-sm font-medium shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <Input
                                  value={item.title}
                                  onChange={(e) => updateItineraryItem(item.id, 'title', e.target.value)}
                                  placeholder="Timeline item title"
                                  className={`mb-2 font-medium ${isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                                />
                                <Textarea
                                  value={item.description}
                                  onChange={(e) => updateItineraryItem(item.id, 'description', e.target.value)}
                                  placeholder="Description of this timeline item..."
                                  className={`min-h-[60px] resize-none ${isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                                />
                              </div>
                            </div>
                            <Button
                              onClick={() => removeItineraryItem(item.id)}
                              size="sm"
                              variant="ghost"
                              className={`ml-2 ${isDashboardDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <Label className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Due Date
                              </Label>
                              <Input
                                type="date"
                                value={item.date}
                                onChange={(e) => updateItineraryItem(item.id, 'date', e.target.value)}
                                className={`mt-1 ${isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                              />
                            </div>
                            <div>
                              <Label className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Start Time
                              </Label>
                              <Input
                                type="time"
                                value={item.startTime}
                                onChange={(e) => updateItineraryItem(item.id, 'startTime', e.target.value)}
                                className={`mt-1 ${isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                              />
                            </div>
                            <div>
                              <Label className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                End Time
                              </Label>  
                              <Input
                                type="time"
                                value={item.endTime}
                                onChange={(e) => updateItineraryItem(item.id, 'endTime', e.target.value)}
                                className={`mt-1 ${isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                              />
                            </div>
                            <div>
                              <Label className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Location
                              </Label>
                              <Input
                                value={item.location || ''}
                                onChange={(e) => updateItineraryItem(item.id, 'location', e.target.value)}
                                placeholder="Location"
                                className={`mt-1 ${isDashboardDarkMode ? "bg-gray-600 border-gray-500 text-white" : ""}`}
                              />
                            </div>
                          </div>

                          {/* Assigned Team Members */}
                          {assignedUsers.length > 0 && (
                            <div className={`mt-4 pt-3 border-t ${isDashboardDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                              <Label className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Assigned Team ({assignedUsers.length})
                              </Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {assignedUsers.map((user) => (
                                  <div 
                                    key={user.id}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                                      isDashboardDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"
                                    }`}
                                  >
                                    <Avatar className="w-5 h-5">
                                      <AvatarImage src={user.avatar} alt={user.name} />
                                      <AvatarFallback className="bg-[#FF8D28] text-white text-xs">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className={`text-xs font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      {user.name}
                                    </span>
                                    <Badge variant="outline" className="text-xs px-1">
                                      {user.role}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Task Status & Priority */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  item.date && new Date(item.date) < new Date() 
                                    ? "border-red-500 text-red-600" 
                                    : "border-green-500 text-green-600"
                                }`}
                              >
                                {item.date && new Date(item.date) < new Date() ? "Overdue" : "Planned"}
                              </Badge>
                              {item.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {item.location}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className={`text-xs ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {item.startTime && item.endTime 
                                  ? `${item.startTime} - ${item.endTime}`
                                  : "No time set"
                                }
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      console.log('Form Data:', formData);
      // Here you would save the data
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating IP:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className={`mb-6 ${isDashboardDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-full ${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-sm border`}>
              <Lightbulb className="w-6 h-6 text-[#FF8D28]" />
            </div>
            <div>
              <h1 className={`font-title text-3xl ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                Create Intellectual Property
              </h1>
              <p className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Step {currentStep} of {totalSteps}: {
                  currentStep === 1 ? 'Choose Project Type' :
                  currentStep === 2 ? 'Category & Details' :
                  'Requirements & Team'
                }
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Progress
              </span>
              <span className={`text-sm font-medium ${isDashboardDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <Card className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-sm`}>
          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className={`flex justify-between items-center mt-8 pt-6 border-t ${isDashboardDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={isDashboardDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i + 1 <= currentStep ? "bg-[#FF8D28]" : isDashboardDarkMode ? "bg-gray-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          
          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Create IP
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

