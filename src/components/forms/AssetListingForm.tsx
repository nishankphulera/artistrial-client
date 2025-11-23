import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Package, Upload, DollarSign, FileImage } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId } from '@/utils/supabase/info';
import { toast } from 'sonner';
import { createListingCreationEvent } from '@/utils/userEvents';
import { BackToDashboard } from '../shared/BackToDashboard';
import { uploadMultipleImagesToS3 } from '@/utils/s3Upload';
import { apiUrl } from '@/utils/api';


interface AssetFormData {
  title: string;
  category: string;
  description: string;
  price: string;
  tags: string[];
  dimensions: string;
  fileFormat: string;
  fileSize: string;
  resolution: string;
  license: string;
  isCommercialUse: boolean;
  isEditableSource: boolean;
  hasVariations: boolean;
  colorScheme: string[];
  style: string;
  software: string;
  previewImages: File[];
  sourceFiles: File[];
}

interface AssetListingFormProps {
  onClose?: () => void;
  isDashboardDarkMode?: boolean;
}

export const AssetListingForm: React.FC<AssetListingFormProps> = ({ onClose, isDashboardDarkMode = false }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<AssetFormData>({
    title: '',
    category: '',
    description: '',
    price: '',
    tags: [],
    dimensions: '',
    fileFormat: '',
    fileSize: '',
    resolution: '',
    license: '',
    isCommercialUse: false,
    isEditableSource: false,
    hasVariations: false,
    colorScheme: [],
    style: '',
    software: '',
    previewImages: [],
    sourceFiles: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.category !== '' ||
      formData.description.trim() !== '' ||
      formData.price.trim() !== '' ||
      formData.tags.length > 0 ||
      formData.dimensions.trim() !== '' ||
      formData.fileFormat !== '' ||
      formData.fileSize.trim() !== '' ||
      formData.resolution.trim() !== '' ||
      formData.license !== '' ||
      formData.isCommercialUse !== false ||
      formData.isEditableSource !== false ||
      formData.hasVariations !== false ||
      formData.colorScheme.length > 0 ||
      formData.style !== '' ||
      formData.software.trim() !== '' ||
      formData.previewImages.length > 0 ||
      formData.sourceFiles.length > 0;

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const assetCategories = [
    'Digital Art',
    'Illustrations',
    'Icons & Graphics',
    'UI/UX Kits',
    'Logos & Branding',
    'Photos & Images',
    'Patterns & Textures',
    'Templates',
    'Mockups',
    'Fonts',
    '3D Models',
    'Audio',
    'Video',
    'Other'
  ];

  const licenseTypes = [
    'Standard License',
    'Extended License',
    'Commercial License',
    'Royalty Free',
    'Creative Commons',
    'Custom License'
  ];

  const fileFormats = [
    'JPG/JPEG',
    'PNG',
    'SVG',
    'AI',
    'PSD',
    'FIGMA',
    'SKETCH',
    'PDF',
    'EPS',
    'MP4',
    'MP3',
    'WAV',
    'Other'
  ];

  const styleOptions = [
    'Modern',
    'Minimalist',
    'Vintage',
    'Abstract',
    'Realistic',
    'Cartoon',
    'Hand-drawn',
    'Digital',
    'Photography',
    'Illustration',
    'Typography',
    'Mixed Media'
  ];

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

  const handleFileChange = (field: 'previewImages' | 'sourceFiles', files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        [field]: Array.from(files)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('access_token');
      console.log("token in asset listing form", token);
      
      // Upload preview images to S3 first
      let previewImageUrls: string[] = [];
      if (formData.previewImages.length > 0) {
        try {
          toast.info('Uploading images...');
          previewImageUrls = await uploadMultipleImagesToS3(formData.previewImages, 'assets/previews');
          toast.success(`Successfully uploaded ${previewImageUrls.length} image(s)`);
        } catch (error) {
          toast.error('Failed to upload preview images. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare asset data
      const assetData = {
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        file_format: formData.fileFormat,
        dimensions: formData.dimensions,
        file_size: formData.fileSize,
        resolution: formData.resolution,
        software: formData.software,
        style: formData.style,
        tags: formData.tags,
        color_scheme: formData.colorScheme,
        license: formData.license,
        is_commercial_use: formData.isCommercialUse,
        is_editable_source: formData.isEditableSource,
        has_variations: formData.hasVariations,
        images: previewImageUrls, // Add uploaded image URLs
        type: 'asset',
        status: 'active'
      };

      const response = await fetch(
        apiUrl('assets'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(assetData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const assetId = responseData.data?.id || responseData.id;
        
        // Create user event for asset creation
        if (assetId) {
          await createListingCreationEvent(
            user.id,
            'asset',
            assetId,
            formData.title,
            `Created asset listing: ${formData.title} in ${formData.category}`,
            {
              category: formData.category,
              price: parseFloat(formData.price),
              file_format: formData.fileFormat
            }
          );
        }
        
        toast.success('Asset listing created successfully!');
        setHasUnsavedChanges(false); // Clear unsaved changes flag
        
        // Redirect to marketplace
        setTimeout(() => {
          router.push('/marketplace');
        }, 1000);
        
        if (onClose) onClose();
        // Reset form
        setFormData({
          title: '',
          category: '',
          description: '',
          price: '',
          tags: [],
          dimensions: '',
          fileFormat: '',
          fileSize: '',
          resolution: '',
          license: '',
          isCommercialUse: false,
          isEditableSource: false,
          hasVariations: false,
          colorScheme: [],
          style: '',
          software: '',
          previewImages: [],
          sourceFiles: []
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating asset listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto p-6">
        <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <BackToDashboard hasUnsavedChanges={hasUnsavedChanges} className="mb-4" />
            <CardTitle className={`flex items-center gap-2 text-2xl font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
              <Package className="w-6 h-6 text-green-600" />
              Create Asset Listing
            </CardTitle>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Asset Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Modern UI Kit for Mobile Apps"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="29.99"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Asset Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your asset, what's included, how it can be used..."
                rows={4}
                required
              />
            </div>

            {/* File Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="fileFormat">File Format *</Label>
                <Select value={formData.fileFormat} onValueChange={(value) => setFormData(prev => ({ ...prev, fileFormat: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileFormats.map(format => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                  placeholder="1920x1080 or 300x400mm"
                />
              </div>

              <div>
                <Label htmlFor="resolution">Resolution</Label>
                <Input
                  id="resolution"
                  value={formData.resolution}
                  onChange={(e) => setFormData(prev => ({ ...prev, resolution: e.target.value }))}
                  placeholder="300 DPI, 72 DPI, etc."
                />
              </div>

              <div>
                <Label htmlFor="fileSize">File Size</Label>
                <Input
                  id="fileSize"
                  value={formData.fileSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, fileSize: e.target.value }))}
                  placeholder="25 MB, 150 KB, etc."
                />
              </div>

              <div>
                <Label htmlFor="software">Software Used</Label>
                <Input
                  id="software"
                  value={formData.software}
                  onChange={(e) => setFormData(prev => ({ ...prev, software: e.target.value }))}
                  placeholder="Adobe Illustrator, Figma, etc."
                />
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <Select value={formData.style} onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* License & Usage */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="license">License Type *</Label>
                <Select value={formData.license} onValueChange={(value) => setFormData(prev => ({ ...prev, license: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent>
                    {licenseTypes.map(license => (
                      <SelectItem key={license} value={license}>{license}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCommercialUse"
                    checked={formData.isCommercialUse}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCommercialUse: !!checked }))}
                  />
                  <Label htmlFor="isCommercialUse">Commercial use allowed</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isEditableSource"
                    checked={formData.isEditableSource}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isEditableSource: !!checked }))}
                  />
                  <Label htmlFor="isEditableSource">Editable source files</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasVariations"
                    checked={formData.hasVariations}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasVariations: !!checked }))}
                  />
                  <Label htmlFor="hasVariations">Multiple variations</Label>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="previewImages">Preview Images *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="previewImages" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload preview images</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                  <Input
                    id="previewImages"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange('previewImages', e.target.files)}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
                  {formData.previewImages.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.previewImages.length} preview image(s) selected
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="sourceFiles">Source Files *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="sourceFiles" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload source files</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                  <Input
                    id="sourceFiles"
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange('sourceFiles', e.target.files)}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">Any file type up to 100MB each</p>
                  {formData.sourceFiles.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.sourceFiles.length} source file(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Listing...' : 'Create Asset Listing'}
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
    </div>
  );
};

