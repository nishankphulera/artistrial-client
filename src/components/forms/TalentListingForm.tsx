import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  X, 
  Plus, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  ArrowLeft, 
  ArrowRight,
  Check,
  User,
  Settings,
  FolderOpen,
  Star,
  MapPin,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId } from '@/utils/supabase/info';
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';
import { createListingCreationEvent } from '@/utils/userEvents';
import { apiUrl } from '@/utils/api';

interface TalentFormData {
  title: string;
  category: string;
  description: string;
  hourlyRate: string;
  fixedPrice: string;
  pricingType: 'hourly' | 'fixed' | 'both';
  skills: string[];
  experience: string;
  availability: string;
  deliveryTime: string;
  location: string;
  isRemote: boolean;
  portfolio: string[];
  languages: string[];
}

export const TalentListingForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TalentFormData>({
    title: '',
    category: '',
    description: '',
    hourlyRate: '',
    fixedPrice: '',
    pricingType: 'hourly',
    skills: [],
    experience: '',
    availability: '',
    deliveryTime: '',
    location: '',
    isRemote: false,
    portfolio: [],
    languages: ['English']
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.category !== '' ||
      formData.description.trim() !== '' ||
      formData.hourlyRate.trim() !== '' ||
      formData.fixedPrice.trim() !== '' ||
      formData.skills.length > 0 ||
      formData.experience !== '' ||
      formData.availability !== '' ||
      formData.deliveryTime !== '' ||
      formData.location.trim() !== '' ||
      formData.isRemote !== false ||
      formData.portfolio.length > 0 ||
      formData.languages.length > 1; // More than just default 'English'

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const talentCategories = [
    'UI/UX Design',
    'Graphic Design',
    'Web Development',
    'Mobile Development',
    'Digital Marketing',
    'Content Writing',
    'Video Production',
    'Photography',
    'Illustration',
    'Animation',
    'Music Production',
    'Voice Acting',
    'Consulting',
    'Other'
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (2-5 years)', 
    'Senior Level (5-10 years)',
    'Expert Level (10+ years)'
  ];

  const steps = [
    { number: 1, title: 'Basic Info', icon: User, description: 'Service details' },
    { number: 2, title: 'Skills & Pricing', icon: Settings, description: 'Expertise & rates' },
    { number: 3, title: 'Portfolio & Review', icon: FolderOpen, description: 'Showcase & submit' }
  ];

  const getStepProgress = () => (currentStep / steps.length) * 100;

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addPortfolioUrl = () => {
    if (newPortfolioUrl.trim() && !formData.portfolio.includes(newPortfolioUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, newPortfolioUrl.trim()]
      }));
      setNewPortfolioUrl('');
    }
  };

  const removePortfolioUrl = (url: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(p => p !== url)
    }));
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return formData.title.trim() !== '' && 
               formData.category !== '' && 
               formData.description.trim() !== '' &&
               formData.experience !== '';
      case 3:
        return formData.skills.length > 0 && 
               (formData.hourlyRate.trim() !== '' || formData.fixedPrice.trim() !== '');
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length && canProceedToStep(currentStep + 1)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to create a talent listing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      // Debug: Log user object to see what we're working with
      console.log('User object:', user);
      console.log('User ID:', user.id, 'Type:', typeof user.id);
      
      // Ensure user_id is properly handled
      let userId = typeof user.id === 'number' ? user.id : parseInt(user.id);
      if (!userId || isNaN(userId)) {
        console.error('Invalid user ID:', user.id);
        // For testing purposes, use a default user ID if not logged in
        userId = 14; // Test user ID
        console.log('Using default user ID for testing:', userId);
        toast.warning('Using test user ID. Please log in for production use.');
      }
      
      const listingData = {
        user_id: userId,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        fixed_price: formData.fixedPrice ? parseFloat(formData.fixedPrice) : null,
        pricing_type: formData.pricingType,
        skills: formData.skills,
        experience: formData.experience,
        availability: formData.availability || null,
        delivery_time: formData.deliveryTime || null,
        location: formData.location || null,
        is_remote: formData.isRemote,
        portfolio_urls: formData.portfolio,
        languages: formData.languages,
        status: 'active'
      };

      // Debug: Log the final payload
      console.log('Talent creation payload:', listingData);

      const response = await fetch(
        apiUrl('talents'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listingData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const talentId = responseData.data?.id || responseData.id;
        
        // Create user event for talent creation
        if (talentId) {
          await createListingCreationEvent(
            userId,
            'talent',
            talentId,
            formData.title,
            `Created talent listing: ${formData.title} in ${formData.category}`,
            {
              category: formData.category,
              pricing_type: formData.pricingType,
              skills: formData.skills,
              experience: formData.experience
            }
          );
        }
        
        toast.success('Talent listing created successfully!');
        setHasUnsavedChanges(false);
        if (onClose) onClose();
        // Reset form
        setFormData({
          title: '',
          category: '',
          description: '',
          hourlyRate: '',
          fixedPrice: '',
          pricingType: 'hourly',
          skills: [],
          experience: '',
          availability: '',
          deliveryTime: '',
          location: '',
          isRemote: false,
          portfolio: [],
          languages: ['English']
        });
        setCurrentStep(1);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating talent listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate preview data for the talent card
  const generatePreviewData = () => {
    const basePrice = formData.pricingType === 'fixed' ? 
      parseFloat(formData.fixedPrice) || 0 : 
      parseFloat(formData.hourlyRate) || 0;

    return {
      id: 'preview',
      name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'Your Name',
      profession: formData.title || 'Your Service Title',
      location: formData.location || 'Your Location',
      rating: 4.8,
      hourlyRate: basePrice,
      skills: formData.skills.length > 0 ? formData.skills : ['Add skills in step 2'],
      experience: formData.experience || 'Select experience level',
      avatar: user?.user_metadata?.avatar_url || '',
      availability: 'Available' as const,
      portfolio: formData.portfolio,
      bio: formData.description || 'Add your service description...',
      totalReviews: 0,
      totalProjects: 0,
      responseTime: '< 1h',
      status: 'active' as const,
      featuredImage: formData.portfolio[0] || undefined
    };
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              currentStep >= step.number 
                ? 'bg-[#FF8D28] border-[#FF8D28] text-white' 
                : 'border-gray-300 text-gray-500'
            }`}>
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-0.5 mx-2 transition-all ${
                currentStep > step.number ? 'bg-[#FF8D28]' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <h2 className="font-title text-xl mb-1">
          Step {currentStep}: {steps[currentStep - 1].title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep - 1].description}
        </p>
      </div>
      
      <div className="mt-4">
        <Progress value={getStepProgress()} className="w-full h-2" />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-base font-medium mb-2 block">Service Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Professional UI/UX Design Services"
          className="text-base"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category" className="text-base font-medium mb-2 block">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {talentCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="experience" className="text-base font-medium mb-2 block">Experience Level *</Label>
          <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium mb-2 block">Service Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your services, expertise, and what clients can expect..."
          rows={4}
          className="text-base resize-none"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          {formData.description.length}/500 characters
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <Label className="text-base font-medium mb-2 block">Skills & Expertise *</Label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="text-base"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} size="sm" className="bg-[#FF8D28] hover:bg-[#FF8D28]/90">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map(skill => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1 text-sm py-1 px-2">
              {skill}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
        {formData.skills.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">Add at least one skill to continue</p>
        )}
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <Label className="text-base font-medium mb-2 block">Pricing Structure *</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <Label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="pricingType"
                value="hourly"
                checked={formData.pricingType === 'hourly'}
                onChange={(e) => setFormData(prev => ({ ...prev, pricingType: e.target.value as 'hourly' }))}
                className="text-[#FF8D28] focus:ring-[#FF8D28]"
              />
              <span className="font-medium">Hourly Rate</span>
            </Label>
            {formData.pricingType === 'hourly' && (
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  placeholder="50"
                  className="pl-10 text-base"
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="pricingType"
                value="fixed"
                checked={formData.pricingType === 'fixed'}
                onChange={(e) => setFormData(prev => ({ ...prev, pricingType: e.target.value as 'fixed' }))}
                className="text-[#FF8D28] focus:ring-[#FF8D28]"
              />
              <span className="font-medium">Fixed Price</span>
            </Label>
            {formData.pricingType === 'fixed' && (
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={formData.fixedPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, fixedPrice: e.target.value }))}
                  placeholder="500"
                  className="pl-10 text-base"
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="pricingType"
                value="both"
                checked={formData.pricingType === 'both'}
                onChange={(e) => setFormData(prev => ({ ...prev, pricingType: e.target.value as 'both' }))}
                className="text-[#FF8D28] focus:ring-[#FF8D28]"
              />
              <span className="font-medium">Both Options</span>
            </Label>
            {formData.pricingType === 'both' && (
              <div className="space-y-2">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="Hourly rate"
                    className="pl-10 text-base"
                    required
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={formData.fixedPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixedPrice: e.target.value }))}
                    placeholder="Fixed price"
                    className="pl-10 text-base"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Availability & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="availability" className="text-base font-medium mb-2 block">Availability</Label>
          <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time (40+ hours/week)</SelectItem>
              <SelectItem value="part-time">Part-time (20-40 hours/week)</SelectItem>
              <SelectItem value="project-based">Project-based</SelectItem>
              <SelectItem value="weekends">Weekends only</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="deliveryTime" className="text-base font-medium mb-2 block">Typical Delivery Time</Label>
          <Select value={formData.deliveryTime} onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryTime: value }))}>
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Select delivery time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3-days">1-3 days</SelectItem>
              <SelectItem value="1-week">1 week</SelectItem>
              <SelectItem value="2-weeks">2 weeks</SelectItem>
              <SelectItem value="1-month">1 month</SelectItem>
              <SelectItem value="3-months">3+ months</SelectItem>
              <SelectItem value="depends">Depends on project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <Label htmlFor="location" className="text-base font-medium mb-2 block">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, Country"
            className="text-base"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRemote"
            checked={formData.isRemote}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRemote: !!checked }))}
          />
          <Label htmlFor="isRemote" className="text-base cursor-pointer">Available for remote work</Label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Portfolio */}
      <div>
        <Label className="text-base font-medium mb-2 block">Portfolio URLs</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Add links to your best work (optional but recommended)
        </p>
        <div className="flex gap-2 mb-3">
          <Input
            value={newPortfolioUrl}
            onChange={(e) => setNewPortfolioUrl(e.target.value)}
            placeholder="https://example.com/portfolio"
            type="url"
            className="text-base"
          />
          <Button type="button" onClick={addPortfolioUrl} size="sm" className="bg-[#FF8D28] hover:bg-[#FF8D28]/90">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {formData.portfolio.map(url => (
            <div key={url} className="flex items-center justify-between p-3 border rounded-lg">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FF8D28] hover:underline truncate flex-1 mr-2"
              >
                {url}
              </a>
              <X 
                className="w-4 h-4 cursor-pointer hover:text-red-500 flex-shrink-0" 
                onClick={() => removePortfolioUrl(url)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-title text-lg mb-4">Review Your Listing</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium">{formData.title || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">{formData.category || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Experience:</span>
            <span className="font-medium">{formData.experience || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Skills:</span>
            <span className="font-medium">{formData.skills.length} skills</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pricing:</span>
            <span className="font-medium">
              {formData.pricingType === 'hourly' && formData.hourlyRate ? `$${formData.hourlyRate}/hr` :
               formData.pricingType === 'fixed' && formData.fixedPrice ? `$${formData.fixedPrice}` :
               formData.pricingType === 'both' ? 'Both options' : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Portfolio:</span>
            <span className="font-medium">{formData.portfolio.length} items</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepNavigation = () => (
    <div className="flex items-center justify-between pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex gap-3">
        {currentStep < steps.length ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceedToStep(currentStep + 1)}
            className="flex items-center gap-2 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Listing
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  const previewData = generatePreviewData();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <Card>
            <CardHeader>
              <BackToDashboard hasUnsavedChanges={hasUnsavedChanges} className="mb-4" />
              <CardTitle className="flex items-center gap-2 font-title text-2xl">
                <Briefcase className="w-6 h-6 text-[#FF8D28]" />
                Create Talent Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderStepIndicator()}
                
                <div className="min-h-[400px]">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </div>

                {renderStepNavigation()}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Section */}
        <div className="lg:sticky lg:top-6">
          <div className="mb-4">
            <h3 className="font-title text-lg mb-2">Live Preview</h3>
            <p className="text-sm text-muted-foreground">
              See how your listing will appear to clients
            </p>
          </div>
          
          {/* Preview Card */}
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Header with Avatar and Basic Info */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 ring-2 ring-border">
                    <AvatarImage src={previewData.avatar} alt={previewData.name} />
                    <AvatarFallback className="bg-[#FF8D28] text-white">
                      {previewData.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <h3 className="font-title font-semibold truncate">
                        {previewData.profession}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">by {previewData.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{previewData.location || 'Location not set'}</span>
                    </div>
                  </div>
                </div>

                {/* Rating and Availability Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{previewData.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({previewData.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs bg-[#FF8D28] hover:bg-[#FF8D28]/90">
                      {previewData.availability}
                    </Badge>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {previewData.experience} • {previewData.totalProjects} projects completed
                  </p>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {previewData.bio}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {previewData.skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {previewData.skills && previewData.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{previewData.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${previewData.hourlyRate || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formData.pricingType === 'fixed' ? 'Fixed Price' : 'Per Hour'}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {previewData.responseTime}
                    </div>
                    <div className="text-xs text-muted-foreground">Response</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {previewData.totalProjects}
                    </div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white" disabled>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <h4 className="font-title text-sm mb-2">Tips for a great listing:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use a clear, descriptive service title</li>
                <li>• Add relevant skills that clients search for</li>
                <li>• Set competitive but fair pricing</li>
                <li>• Include portfolio links to showcase your work</li>
                <li>• Write a compelling service description</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

