import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, GraduationCap, DollarSign, Calendar, Users, Clock } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId } from '@/utils/supabase/info';
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';
import { createListingCreationEvent } from '@/utils/userEvents';

interface EducationFormData {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  pricingType: 'free' | 'one_time' | 'subscription' | 'tiered';
  level: string;
  format: string;
  duration: string;
  maxStudents: string;
  languages: string[];
  curriculum: string[];
  prerequisites: string;
  objectives: string[];
  materials: string[];
  schedule: string;
  startDate: string;
  endDate: string;
  location: string;
  isRecorded: boolean;
  certificateIncluded: boolean;
  supportIncluded: boolean;
  groupDiscounts: boolean;
  refundPolicy: string;
  instructorBio: string;
  tags: string[];
  thumbnailUrl: string;
}

export const EducationListingForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<EducationFormData>({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    pricingType: 'one_time',
    level: '',
    format: '',
    duration: '',
    maxStudents: '',
    languages: ['English'],
    curriculum: [],
    prerequisites: '',
    objectives: [],
    materials: [],
    schedule: '',
    startDate: '',
    endDate: '',
    location: '',
    isRecorded: false,
    certificateIncluded: false,
    supportIncluded: false,
    groupDiscounts: false,
    refundPolicy: '',
    instructorBio: '',
    tags: [],
    thumbnailUrl: ''
  });
  
  const [newCurriculumItem, setNewCurriculumItem] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.category !== '' ||
      formData.description.trim() !== '' ||
      formData.price.trim() !== '' ||
      formData.curriculum.length > 0 ||
      formData.objectives.length > 0 ||
      formData.duration !== '' ||
      formData.instructorBio.trim() !== '' ||
      formData.tags.length > 0;

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const mainCategories = [
    { value: 'art_design', label: 'Art & Design' },
    { value: 'photography', label: 'Photography & Video' },
    { value: 'music_audio', label: 'Music & Audio' },
    { value: 'writing', label: 'Writing & Content' },
    { value: 'business', label: 'Creative Business' },
    { value: 'technology', label: 'Creative Technology' }
  ];

  const subcategoriesByCategory = {
    art_design: [
      'Digital Art & Illustration',
      'Traditional Art Techniques',
      'Graphic Design',
      'UI/UX Design',
      'Branding & Identity',
      'Typography'
    ],
    photography: [
      'Portrait Photography',
      'Landscape Photography',
      'Commercial Photography',
      'Videography',
      'Video Editing',
      'Cinematography'
    ],
    music_audio: [
      'Music Production',
      'Sound Design',
      'Mixing & Mastering',
      'Instrument Lessons',
      'Vocal Training',
      'Audio Engineering'
    ],
    writing: [
      'Creative Writing',
      'Copywriting',
      'Screenwriting',
      'Content Marketing',
      'Journalism',
      'Technical Writing'
    ],
    business: [
      'Freelancing Essentials',
      'Portfolio Building',
      'Client Management',
      'Pricing Strategy',
      'Creative Marketing',
      'Business Development'
    ],
    technology: [
      'Web Development',
      'App Development',
      '3D Modeling',
      'Animation',
      'Game Development',
      'AR/VR Development'
    ]
  };

  const skillLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'All Levels'
  ];

  const courseFormats = [
    'Online Live',
    'Online Self-Paced',
    'In-Person',
    'Hybrid',
    'Workshop',
    'Masterclass',
    'Bootcamp'
  ];

  const durationOptions = [
    '1-2 hours',
    '3-5 hours',
    '1 day',
    '2-3 days',
    '1 week',
    '2-4 weeks',
    '1-2 months',
    '3-6 months',
    'Ongoing'
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Russian'
  ];

  const addCurriculumItem = () => {
    if (newCurriculumItem.trim() && !formData.curriculum.includes(newCurriculumItem.trim())) {
      setFormData(prev => ({
        ...prev,
        curriculum: [...prev.curriculum, newCurriculumItem.trim()]
      }));
      setNewCurriculumItem('');
    }
  };

  const removeCurriculumItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter(i => i !== item)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim() && !formData.objectives.includes(newObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(o => o !== objective)
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m !== material)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    if (formData.languages.length > 1) { // Keep at least one language
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.filter(l => l !== language)
      }));
    }
  };

  const getAvailableSubcategories = () => {
    if (!formData.category) return [];
    return subcategoriesByCategory[formData.category as keyof typeof subcategoriesByCategory] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      const listingData = {
        ...formData,
        userId: user.id,
        instructorId: user.id,
        type: 'education',
        price: formData.pricingType === 'free' ? 0 : parseFloat(formData.price),
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : null,
        status: 'active'
      };

      const response = await fetch(
        `http://localhost:5001/api/education`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(listingData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const educationId = responseData.data?.id || responseData.id;
        
        // Create user event for education creation
        if (educationId) {
          await createListingCreationEvent(
            user.id,
            'education',
            educationId,
            formData.title,
            `Created education listing: ${formData.title} in ${formData.category}`,
            {
              category: formData.category,
              subcategory: formData.subcategory,
              price: formData.pricingType === 'free' ? 0 : parseFloat(formData.price),
              level: formData.level,
              format: formData.format,
              start_date: formData.startDate
            }
          );
        }
        
        toast.success('Education listing created successfully!');
        setHasUnsavedChanges(false);
        if (onClose) onClose();
        // Reset form
        setFormData({
          title: '',
          category: '',
          subcategory: '',
          description: '',
          price: '',
          pricingType: 'one_time',
          level: '',
          format: '',
          duration: '',
          maxStudents: '',
          languages: ['English'],
          curriculum: [],
          prerequisites: '',
          objectives: [],
          materials: [],
          schedule: '',
          startDate: '',
          endDate: '',
          location: '',
          isRecorded: false,
          certificateIncluded: false,
          supportIncluded: false,
          groupDiscounts: false,
          refundPolicy: '',
          instructorBio: '',
          tags: [],
          thumbnailUrl: ''
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating education listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <BackToDashboard hasUnsavedChanges={hasUnsavedChanges} className="mb-4" />
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            Create Education Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Course/Workshop Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Complete Digital Illustration Masterclass"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Main Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: '' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSubcategories().map(subcategory => (
                      <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what students will learn, the course structure, and key benefits..."
                rows={4}
                required
              />
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="level">Skill Level *</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Course Format *</Label>
                <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseFormats.map(format => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration *</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map(duration => (
                      <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <Label>Pricing *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['free', 'one_time', 'subscription', 'tiered'].map((type) => (
                  <div key={type}>
                    <Label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pricingType"
                        value={type}
                        checked={formData.pricingType === type}
                        onChange={(e) => setFormData(prev => ({ ...prev, pricingType: e.target.value as any }))}
                      />
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                    </Label>
                  </div>
                ))}
              </div>
              
              {formData.pricingType !== 'free' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="199"
                        className="pl-10"
                        required={!['free'].includes(formData.pricingType)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxStudents">Max Students</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="maxStudents"
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: e.target.value }))}
                        placeholder="25"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Schedule and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                  placeholder="e.g., Weekdays 9am-12pm EST"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Online, City/Country, or Studio Address"
                />
              </div>
            </div>

            {/* Languages */}
            <div>
              <Label>Languages</Label>
              <div className="flex gap-2 mb-2">
                <Select value={newLanguage} onValueChange={setNewLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.filter(lang => !formData.languages.includes(lang)).map(language => (
                      <SelectItem key={language} value={language}>{language}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addLanguage} size="sm" disabled={!newLanguage}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map(language => (
                  <Badge key={language} variant="secondary" className="flex items-center gap-1">
                    {language}
                    {formData.languages.length > 1 && (
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeLanguage(language)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <Label>Curriculum</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCurriculumItem}
                  onChange={(e) => setNewCurriculumItem(e.target.value)}
                  placeholder="Add curriculum topic"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCurriculumItem())}
                />
                <Button type="button" onClick={addCurriculumItem} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.curriculum.map((item, index) => (
                  <div key={item} className="flex items-center gap-2 p-2 border rounded">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="flex-1">{item}</span>
                    <X 
                      className="w-4 h-4 cursor-pointer hover:text-red-500" 
                      onClick={() => removeCurriculumItem(item)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <Label>Learning Objectives</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="What will students learn?"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                />
                <Button type="button" onClick={addObjective} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.objectives.map(objective => (
                  <Badge key={objective} variant="outline" className="flex items-center gap-1">
                    {objective}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeObjective(objective)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <Label>Required Materials</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Software, tools, or materials needed"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                />
                <Button type="button" onClick={addMaterial} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.materials.map(material => (
                  <Badge key={material} variant="outline" className="flex items-center gap-1">
                    {material}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeMaterial(material)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                value={formData.prerequisites}
                onChange={(e) => setFormData(prev => ({ ...prev, prerequisites: e.target.value }))}
                placeholder="What knowledge or experience should students have before taking this course?"
                rows={3}
              />
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <Label>Additional Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRecorded"
                    checked={formData.isRecorded}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecorded: !!checked }))}
                  />
                  <Label htmlFor="isRecorded">Sessions will be recorded</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificateIncluded"
                    checked={formData.certificateIncluded}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, certificateIncluded: !!checked }))}
                  />
                  <Label htmlFor="certificateIncluded">Certificate of completion</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="supportIncluded"
                    checked={formData.supportIncluded}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, supportIncluded: !!checked }))}
                  />
                  <Label htmlFor="supportIncluded">Ongoing support included</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="groupDiscounts"
                    checked={formData.groupDiscounts}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, groupDiscounts: !!checked }))}
                  />
                  <Label htmlFor="groupDiscounts">Group discounts available</Label>
                </div>
              </div>
            </div>

            {/* Instructor Bio */}
            <div>
              <Label htmlFor="instructorBio">Instructor Bio</Label>
              <Textarea
                id="instructorBio"
                value={formData.instructorBio}
                onChange={(e) => setFormData(prev => ({ ...prev, instructorBio: e.target.value }))}
                placeholder="Tell students about your background and expertise..."
                rows={4}
              />
            </div>

            {/* Thumbnail */}
            <div>
              <Label htmlFor="thumbnailUrl">Course Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                placeholder="https://example.com/course-thumbnail.jpg"
              />
            </div>

            {/* Refund Policy */}
            <div>
              <Label htmlFor="refundPolicy">Refund Policy</Label>
              <Textarea
                id="refundPolicy"
                value={formData.refundPolicy}
                onChange={(e) => setFormData(prev => ({ ...prev, refundPolicy: e.target.value }))}
                placeholder="Describe your refund policy..."
                rows={3}
              />
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Listing...' : 'Create Education Listing'}
              </Button>
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

