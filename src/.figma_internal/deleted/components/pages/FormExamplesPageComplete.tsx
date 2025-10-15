import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Toggle } from '../ui/toggle';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { cn } from '../ui/utils';
import {
  CalendarIcon,
  Clock,
  Upload,
  Plus,
  Minus,
  Star,
  Heart,
  Eye,
  EyeOff,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  Info,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  MapPin,
  Globe,
  Phone,
  Mail,
  DollarSign,
  Percent,
  Hash,
  Type,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Palette,
  ArrowRight,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Copy,
  QrCode,
  Mic,
  MicOff,
  Fingerprint,
  Timer,
  Calculator,
  Navigation,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Move,
  RotateCcw,
  Crop,
  PenTool,
  Layers,
  ChevronUp,
  ChevronRight,
  GripVertical,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  Code,
  Key,
  Keyboard,
  MousePointer,
  Smartphone,
  Wifi,
  Bluetooth,
  Camera,
  Settings2,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface FormData {
  // Basic Text Inputs
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  
  // Selection Inputs
  country: string;
  category: string;
  subcategory: string;
  priority: string;
  
  // Text Areas
  description: string;
  requirements: string;
  
  // Numbers & Pricing
  budget: number;
  quantity: number;
  rating: number;
  percentage: number;
  
  // Dates & Times
  startDate: Date | undefined;
  endDate: Date | undefined;
  deadlineDate: Date | undefined;
  
  // Boolean Inputs
  isPublic: boolean;
  acceptTerms: boolean;
  enableNotifications: boolean;
  isUrgent: boolean;
  
  // Multi-select & Arrays
  skills: string[];
  tags: string[];
  selectedColors: string[];
  attachments: File[];
  
  // Advanced Inputs
  location: string;
  timezone: string;
  currency: string;
  profileImage: File | null;
  portfolio: File[];
  
  // Rich Content
  richDescription: string;
  
  // Rating & Reviews
  overallRating: number;
  qualityRating: number;
  serviceRating: number;
}

interface FormExamplesPageProps {
  isDashboardDarkMode?: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  website: '',
  country: '',
  category: '',
  subcategory: '',
  priority: '',
  description: '',
  requirements: '',
  budget: 0,
  quantity: 1,
  rating: 0,
  percentage: 0,
  startDate: undefined,
  endDate: undefined,
  deadlineDate: undefined,
  isPublic: false,
  acceptTerms: false,
  enableNotifications: true,
  isUrgent: false,
  skills: [],
  tags: [],
  selectedColors: [],
  attachments: [],
  location: '',
  timezone: '',
  currency: 'USD',
  profileImage: null,
  portfolio: [],
  richDescription: '',
  overallRating: 0,
  qualityRating: 0,
  serviceRating: 0,
};

const skillOptions = [
  'UI/UX Design', 'Frontend Development', 'Backend Development', 'Mobile Development',
  'Graphic Design', 'Photography', 'Video Editing', 'Content Writing', 'Digital Marketing',
  'SEO', 'Social Media', 'Project Management', 'Data Analysis', 'Machine Learning'
];

const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

export function FormExamplesPage({ isDashboardDarkMode = false }: FormExamplesPageProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [tagInput, setTagInput] = useState('');
  const totalSteps = 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Form submitted successfully! This is a demo form.', {
      description: 'All input types have been demonstrated.',
    });
    console.log('Form Data:', formData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    toast.info('Form has been reset to default values.');
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      updateFormData('skills', [...formData.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    updateFormData('skills', formData.skills.filter(s => s !== skill));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      updateFormData('tags', [...formData.tags, tag.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateFormData('tags', formData.tags.filter(t => t !== tag));
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={cn(
              "p-1 rounded transition-colors",
              star <= value ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
            )}
          >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{value}/5 stars</p>
    </div>
  );

  const FileUploadArea = ({ 
    onFileSelect, 
    accept, 
    multiple = false, 
    label 
  }: { 
    onFileSelect: (files: FileList | null) => void; 
    accept: string; 
    multiple?: boolean; 
    label: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => onFileSelect(e.target.files)}
          className="hidden"
          id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <label
          htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm">Click to upload or drag and drop</span>
          <span className="text-xs text-muted-foreground">{accept.toUpperCase()}</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex-1 space-y-6 p-6 bg-background dark:bg-[#171717]">
      <div className="space-y-2">
        <h1 className="font-title text-3xl">Form Input Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive showcase of all available form input types and components for the Artistrial platform.
        </p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="font-title">Form Progress</CardTitle>
          <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Basic Information</span>
              <span>Advanced Options</span>
              <span>Review & Submit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="selection">Selection</TabsTrigger>
            <TabsTrigger value="dates">Dates</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
            <TabsTrigger value="specialized">Specialized</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Basic Input Fields */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Text Input Fields
                </CardTitle>
                <CardDescription>
                  Standard text input fields for basic information collection
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      className="pl-10"
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password Example</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <AlignLeft className="w-5 h-5" />
                  Text Areas & Long Form Text
                </CardTitle>
                <CardDescription>
                  Multi-line text inputs for detailed information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project or requirements in detail..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List any specific requirements, constraints, or special instructions..."
                    value={formData.requirements}
                    onChange={(e) => updateFormData('requirements', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Selection Input Fields */}
          <TabsContent value="selection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <ChevronDown className="w-5 h-5" />
                  Dropdown Selectors
                </CardTitle>
                <CardDescription>
                  Single and multi-select dropdown components
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(value) => updateFormData('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Radio Groups & Checkboxes
                </CardTitle>
                <CardDescription>
                  Single and multiple choice selection inputs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Project Type (Single Choice)</Label>
                  <RadioGroup
                    value={formData.subcategory}
                    onValueChange={(value) => updateFormData('subcategory', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">New Project</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="improvement" id="improvement" />
                      <Label htmlFor="improvement">Improvement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maintenance" id="maintenance" />
                      <Label htmlFor="maintenance">Maintenance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="consultation" id="consultation" />
                      <Label htmlFor="consultation">Consultation</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Project Settings (Multiple Choice)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => updateFormData('isPublic', checked)}
                      />
                      <Label htmlFor="isPublic">Make project public</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => updateFormData('acceptTerms', checked)}
                      />
                      <Label htmlFor="acceptTerms">Accept terms and conditions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableNotifications"
                        checked={formData.enableNotifications}
                        onCheckedChange={(checked) => updateFormData('enableNotifications', checked)}
                      />
                      <Label htmlFor="enableNotifications">Enable email notifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isUrgent"
                        checked={formData.isUrgent}
                        onCheckedChange={(checked) => updateFormData('isUrgent', checked)}
                      />
                      <Label htmlFor="isUrgent">Mark as urgent</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Date & Time Inputs */}
          <TabsContent value="dates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Date & Time Pickers
                </CardTitle>
                <CardDescription>
                  Calendar and time selection components
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => updateFormData('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => updateFormData('endDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !formData.deadlineDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deadlineDate ? format(formData.deadlineDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.deadlineDate}
                        onSelect={(date) => updateFormData('deadlineDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time & Duration Inputs
                </CardTitle>
                <CardDescription>
                  Time-based input fields and components
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    placeholder="4.5"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="datetime">Date & Time Combined</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Inputs */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Number & Range Inputs
                </CardTitle>
                <CardDescription>
                  Numeric inputs with validation and range controls
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="5000"
                      className="pl-10"
                      value={formData.budget || ''}
                      onChange={(e) => updateFormData('budget', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateFormData('quantity', Math.max(1, formData.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateFormData('quantity', formData.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentage">Completion Percentage</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      placeholder="75"
                      className="pl-10"
                      value={formData.percentage || ''}
                      onChange={(e) => updateFormData('percentage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="range">Progress Slider: {formData.rating}%</Label>
                  <Slider
                    id="range"
                    min={0}
                    max={100}
                    step={5}
                    value={[formData.rating]}
                    onValueChange={(value) => updateFormData('rating', value[0])}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Rating & Review Components
                </CardTitle>
                <CardDescription>
                  Interactive rating systems and feedback controls
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StarRating
                  value={formData.overallRating}
                  onChange={(value) => updateFormData('overallRating', value)}
                  label="Overall Rating"
                />
                
                <StarRating
                  value={formData.qualityRating}
                  onChange={(value) => updateFormData('qualityRating', value)}
                  label="Quality Rating"
                />
                
                <StarRating
                  value={formData.serviceRating}
                  onChange={(value) => updateFormData('serviceRating', value)}
                  label="Service Rating"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  Toggle & Switch Controls
                </CardTitle>
                <CardDescription>
                  Binary choice inputs and preference toggles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={formData.enableNotifications}
                      onCheckedChange={(checked) => updateFormData('enableNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="public">Public Profile</Label>
                    <Switch
                      id="public"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => updateFormData('isPublic', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Text Formatting Options</Label>
                  <ToggleGroup type="multiple" className="justify-start">
                    <ToggleGroupItem value="bold">
                      <Bold className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic">
                      <Italic className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="underline">
                      <Underline className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="link">
                      <Link className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-3">
                  <Label>List Type</Label>
                  <ToggleGroup type="single" className="justify-start">
                    <ToggleGroupItem value="bullet">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="numbered">
                      <ListOrdered className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media & File Inputs */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  File Upload Components
                </CardTitle>
                <CardDescription>
                  Various file upload interfaces for different media types
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadArea
                  onFileSelect={(files) => {
                    if (files && files.length > 0) {
                      updateFormData('profileImage', files[0]);
                      toast.success(`Selected: ${files[0].name}`);
                    }
                  }}
                  accept="image/*"
                  label="Profile Image"
                />

                <FileUploadArea
                  onFileSelect={(files) => {
                    if (files) {
                      const fileArray = Array.from(files);
                      updateFormData('portfolio', fileArray);
                      toast.success(`Selected ${fileArray.length} files`);
                    }
                  }}
                  accept="image/*,video/*,.pdf"
                  multiple
                  label="Portfolio Files"
                />

                <FileUploadArea
                  onFileSelect={(files) => {
                    if (files) {
                      toast.success(`Selected ${files.length} documents`);
                    }
                  }}
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  label="Documents"
                />

                <FileUploadArea
                  onFileSelect={(files) => {
                    if (files) {
                      toast.success(`Selected ${files.length} media files`);
                    }
                  }}
                  accept="video/*,audio/*"
                  multiple
                  label="Media Files"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Media Capture & Recording
                </CardTitle>
                <CardDescription>
                  Direct media capture and recording interfaces
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Camera Capture</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Camera capture interface</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Audio Recording</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Mic className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Audio recording interface</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Screen Recording</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Screen capture interface</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Video className="w-4 h-4 mr-2" />
                      Record Screen
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location Capture</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">GPS location capture</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interactive Elements */}
          <TabsContent value="interactive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Multi-Select & Tagging
                </CardTitle>
                <CardDescription>
                  Advanced selection interfaces with search and filtering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Skills Selection</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search skills..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                      {skillOptions
                        .filter(skill => 
                          skill.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(skill => (
                          <div key={skill} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={skill}
                              checked={formData.skills.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  addSkill(skill);
                                } else {
                                  removeSkill(skill);
                                }
                              }}
                            />
                            <Label htmlFor={skill} className="text-sm">{skill}</Label>
                          </div>
                        ))
                      }
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addTag(tagInput)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color & Theme Selection
                </CardTitle>
                <CardDescription>
                  Visual selection interfaces for colors and themes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Color Palette</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          formData.selectedColors.includes(color.value)
                            ? "border-foreground scale-110"
                            : "border-muted hover:scale-105"
                        )}
                        style={{ backgroundColor: color.value }}
                        onClick={() => {
                          const colors = formData.selectedColors.includes(color.value)
                            ? formData.selectedColors.filter(c => c !== color.value)
                            : [...formData.selectedColors, color.value];
                          updateFormData('selectedColors', colors);
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedColors.map(color => {
                      const colorOption = colorOptions.find(c => c.value === color);
                      return (
                        <Badge key={color} variant="outline" className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {colorOption?.name}
                          <button
                            type="button"
                            onClick={() => {
                              updateFormData('selectedColors', 
                                formData.selectedColors.filter(c => c !== color)
                              );
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Real-time & Dynamic Inputs
                </CardTitle>
                <CardDescription>
                  Interactive inputs that respond to user actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Live Character Counter</Label>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Start typing to see the character count..."
                      value={formData.richDescription}
                      onChange={(e) => updateFormData('richDescription', e.target.value)}
                      maxLength={500}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Characters: {formData.richDescription.length}/500</span>
                      <span>Words: {formData.richDescription.split(/\s+/).filter(word => word.length > 0).length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Auto-complete Search</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {formData.location || "Search locations..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search locations..." />
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            <CommandItem onSelect={() => updateFormData('location', 'New York, NY')}>
                              New York, NY
                            </CommandItem>
                            <CommandItem onSelect={() => updateFormData('location', 'Los Angeles, CA')}>
                              Los Angeles, CA
                            </CommandItem>
                            <CommandItem onSelect={() => updateFormData('location', 'Chicago, IL')}>
                              Chicago, IL
                            </CommandItem>
                            <CommandItem onSelect={() => updateFormData('location', 'Houston, TX')}>
                              Houston, TX
                            </CommandItem>
                            <CommandItem onSelect={() => updateFormData('location', 'Phoenix, AZ')}>
                              Phoenix, AZ
                            </CommandItem>
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specialized Inputs */}
          <TabsContent value="specialized" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Financial & Currency Inputs
                </CardTitle>
                <CardDescription>
                  Specialized inputs for monetary values and calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => updateFormData('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="99.99"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Rate (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tax"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="8.5"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission">Commission</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="15.00"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Geographic & Location Inputs
                </CardTitle>
                <CardDescription>
                  Location-based inputs and geographic selection
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    placeholder="10001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coordinates">Coordinates</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Latitude"
                      type="number"
                      step="any"
                    />
                    <Input
                      placeholder="Longitude"
                      type="number"
                      step="any"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>GPS Location</Label>
                  <Button variant="outline" className="w-full">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Current Location
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Technical & Code Inputs
                </CardTitle>
                <CardDescription>
                  Specialized inputs for technical data and code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="json">JSON Configuration</Label>
                  <Textarea
                    id="json"
                    placeholder='{"key": "value", "number": 123}'
                    className="font-mono text-sm"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regex">Regular Expression</Label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="regex"
                      placeholder="/^[a-zA-Z0-9]+$/"
                      className="pl-10 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apikey">API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="apikey"
                      type="password"
                      placeholder="sk-1234567890abcdef"
                      className="pl-10 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook">Webhook URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="webhook"
                      type="url"
                      placeholder="https://yourapp.com/webhook"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Inputs */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Authentication & Security
                </CardTitle>
                <CardDescription>
                  Security-focused input components and verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password-secure">Secure Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-secure"
                        type="password"
                        placeholder="Enter secure password"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Two-Factor Authentication Code</Label>
                  <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Security Questions</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a security question" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pet">What was the name of your first pet?</SelectItem>
                      <SelectItem value="school">What elementary school did you attend?</SelectItem>
                      <SelectItem value="city">In what city were you born?</SelectItem>
                      <SelectItem value="maiden">What is your mother's maiden name?</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Your answer"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  Biometric & Advanced Security
                </CardTitle>
                <CardDescription>
                  Advanced security features and biometric authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Fingerprint Authentication</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Fingerprint className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Touch sensor to authenticate</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Fingerprint className="w-4 h-4 mr-2" />
                        Scan Fingerprint
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>QR Code Scanner</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <QrCode className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Scan QR code for verification</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <QrCode className="w-4 h-4 mr-2" />
                        Scan QR Code
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="encryption-key">Encryption Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="encryption-key"
                        type="password"
                        placeholder="Enter encryption key"
                        className="pl-10 font-mono"
                      />
                    </div>
                    <Button variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Privacy Controls</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-sharing">Allow data sharing</Label>
                      <Switch id="data-sharing" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics">Enable analytics</Label>
                      <Switch id="analytics" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tracking">Allow tracking</Label>
                      <Switch id="tracking" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-title flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Verification & Compliance
                </CardTitle>
                <CardDescription>
                  Identity verification and compliance inputs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number</Label>
                  <Input
                    id="ssn"
                    type="password"
                    placeholder="XXX-XX-XXXX"
                    maxLength={11}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id-number">Government ID Number</Label>
                  <Input
                    id="id-number"
                    type="password"
                    placeholder="Enter ID number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Identity Verification Documents</Label>
                  <FileUploadArea
                    onFileSelect={(files) => {
                      if (files) {
                        toast.success(`Uploaded ${files.length} verification documents`);
                      }
                    }}
                    accept="image/*,.pdf"
                    multiple
                    label="Upload ID Documents"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Compliance Agreements</Label>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="gdpr" />
                      <Label htmlFor="gdpr" className="text-sm leading-relaxed">
                        I agree to GDPR data processing terms and conditions
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="ccpa" />
                      <Label htmlFor="ccpa" className="text-sm leading-relaxed">
                        I consent to CCPA privacy policy requirements
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="kyc" />
                      <Label htmlFor="kyc" className="text-sm leading-relaxed">
                        I agree to Know Your Customer (KYC) verification process
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-title">Form Actions</CardTitle>
            <CardDescription>
              Submit, reset, and navigation controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset Form
                </Button>
                <Button type="button" variant="outline">
                  Save Draft
                </Button>
              </div>

              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    style={{ backgroundColor: '#FF8D28', borderColor: '#FF8D28' }}
                    className="text-white hover:bg-[#FF8D28]/90"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#FF8D28', borderColor: '#FF8D28' }}
                    className="text-white hover:bg-[#FF8D28]/90"
                  >
                    Submit Form
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

