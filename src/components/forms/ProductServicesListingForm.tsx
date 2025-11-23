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
import { X, Plus, Package, DollarSign, Upload, Calendar } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';
import { createListingCreationEvent } from '@/utils/userEvents';
import { apiUrl } from '@/utils/api';

interface ProductServicesFormData {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  pricingType: 'one_time' | 'subscription' | 'custom';
  subscriptionPeriod?: string;
  features: string[];
  deliveryTime: string;
  format: 'digital' | 'physical' | 'service';
  location: string;
  isShippingIncluded: boolean;
  shippingCost: string;
  images: string[];
  downloadFiles: string[];
  requirements: string;
  refundPolicy: string;
  tags: string[];
  supportIncluded: boolean;
  supportDuration: string;
}

export const ProductServicesListingForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<ProductServicesFormData>({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    pricingType: 'one_time',
    subscriptionPeriod: '',
    features: [],
    deliveryTime: '',
    format: 'digital',
    location: '',
    isShippingIncluded: false,
    shippingCost: '',
    images: [],
    downloadFiles: [],
    requirements: '',
    refundPolicy: '',
    tags: [],
    supportIncluded: false,
    supportDuration: ''
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.category !== '' ||
      formData.description.trim() !== '' ||
      formData.price.trim() !== '' ||
      formData.features.length > 0 ||
      formData.deliveryTime !== '' ||
      formData.location.trim() !== '' ||
      formData.images.length > 0 ||
      formData.tags.length > 0;

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const mainCategories = [
    { value: 'software', label: 'Software & Apps' },
    { value: 'design', label: 'Design Products' },
    { value: 'physical', label: 'Physical Products' },
    { value: 'services', label: 'Creative Services' },
    { value: 'media', label: 'Media & Content' },
    { value: 'tools', label: 'Tools & Resources' }
  ];

  const subcategoriesByCategory = {
    software: [
      'Mobile Applications',
      'Web Applications',
      'Desktop Software',
      'Plugins & Extensions',
      'SaaS Solutions',
      'Games & Entertainment'
    ],
    design: [
      'Design Templates',
      'UI Kits & Components',
      'Icon Packs',
      'Custom Fonts',
      'Graphics & Illustrations',
      'Mockups & Presentations'
    ],
    physical: [
      'Art Prints & Posters',
      'Custom Merchandise',
      'Books & Publications',
      'Handmade Crafts',
      'Professional Equipment',
      'Art & Creative Supplies'
    ],
    services: [
      'Creative Consulting',
      'Workshops & Training',
      'Mentoring & Coaching',
      'Custom Creative Work',
      'Maintenance & Support',
      'Installation Services'
    ],
    media: [
      'Stock Photography',
      'Video Content',
      'Audio & Music',
      'E-books & Guides',
      'Online Courses',
      'Presets & Filters'
    ],
    tools: [
      'Productivity Tools',
      'Automation Scripts',
      'APIs & Integrations',
      'Databases & Resources',
      'Analytics Tools',
      'Marketing Tools'
    ]
  };

  const deliveryTimeOptions = [
    'Instant Download',
    '1-2 Business Days',
    '3-5 Business Days',
    '1-2 Weeks',
    '2-4 Weeks',
    '1-2 Months',
    'Custom Timeline'
  ];

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
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

  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
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
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        price: parseFloat(formData.price),
        pricing_type: formData.pricingType,
        subscription_period: formData.subscriptionPeriod,
        features: formData.features,
        delivery_time: formData.deliveryTime,
        format: formData.format,
        location: formData.location,
        is_shipping_included: formData.isShippingIncluded,
        shipping_cost: parseFloat(formData.shippingCost) || 0,
        images: formData.images,
        download_files: formData.downloadFiles,
        requirements: formData.requirements,
        refund_policy: formData.refundPolicy,
        tags: formData.tags,
        support_included: formData.supportIncluded,
        support_duration: formData.supportDuration,
        status: 'active'
      };

      const response = await fetch(
        apiUrl('product-services'),
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
        const productServiceId = responseData.data?.id || responseData.id;
        
        // Create user event for product/service creation
        if (productServiceId) {
          await createListingCreationEvent(
            user.id,
            'product_service',
            productServiceId,
            formData.title,
            `Created product/service listing: ${formData.title} in ${formData.category}`,
            {
              category: formData.category,
              subcategory: formData.subcategory,
              price: parseFloat(formData.price),
              pricing_type: formData.pricingType,
              format: formData.format
            }
          );
        }
        
        toast.success('Product/Service listing created successfully!');
        setHasUnsavedChanges(false);
        
        // Redirect to product-services page
        setTimeout(() => {
          router.push('/product-services');
        }, 1000);
        
        if (onClose) onClose();
        // Reset form
        setFormData({
          title: '',
          category: '',
          subcategory: '',
          description: '',
          price: '',
          pricingType: 'one_time',
          subscriptionPeriod: '',
          features: [],
          deliveryTime: '',
          format: 'digital',
          location: '',
          isShippingIncluded: false,
          shippingCost: '',
          images: [],
          downloadFiles: [],
          requirements: '',
          refundPolicy: '',
          tags: [],
          supportIncluded: false,
          supportDuration: ''
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating product/service listing:', error);
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
            <Package className="w-6 h-6 text-green-600" />
            Create Product/Service Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Product/Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Premium UI Kit Collection"
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product or service, what it includes, and its benefits..."
                rows={4}
                required
              />
            </div>

            {/* Format and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="format">Format *</Label>
                <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value as 'digital' | 'physical' | 'service' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital Product</SelectItem>
                    <SelectItem value="physical">Physical Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pricingType">Pricing Type *</Label>
                <Select value={formData.pricingType} onValueChange={(value) => setFormData(prev => ({ ...prev, pricingType: value as 'one_time' | 'subscription' | 'custom' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-time Payment</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="custom">Custom Pricing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="99"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {formData.pricingType === 'subscription' && (
                <div>
                  <Label htmlFor="subscriptionPeriod">Subscription Period</Label>
                  <Select value={formData.subscriptionPeriod} onValueChange={(value) => setFormData(prev => ({ ...prev, subscriptionPeriod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <Label>Key Features</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a key feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map(feature => (
                  <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Delivery and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="deliveryTime">Delivery Time *</Label>
                <Select value={formData.deliveryTime} onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryTime: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery time" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryTimeOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country or 'Digital'"
                />
              </div>
            </div>

            {/* Shipping (for physical products) */}
            {formData.format === 'physical' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isShippingIncluded"
                    checked={formData.isShippingIncluded}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isShippingIncluded: !!checked }))}
                  />
                  <Label htmlFor="isShippingIncluded">Shipping cost included in price</Label>
                </div>

                {!formData.isShippingIncluded && (
                  <div>
                    <Label htmlFor="shippingCost">Additional Shipping Cost</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="shippingCost"
                        type="number"
                        value={formData.shippingCost}
                        onChange={(e) => setFormData(prev => ({ ...prev, shippingCost: e.target.value }))}
                        placeholder="15"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Support */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="supportIncluded"
                  checked={formData.supportIncluded}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, supportIncluded: !!checked }))}
                />
                <Label htmlFor="supportIncluded">Include customer support</Label>
              </div>

              {formData.supportIncluded && (
                <div>
                  <Label htmlFor="supportDuration">Support Duration</Label>
                  <Select value={formData.supportDuration} onValueChange={(value) => setFormData(prev => ({ ...prev, supportDuration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select support duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30-days">30 days</SelectItem>
                      <SelectItem value="90-days">90 days</SelectItem>
                      <SelectItem value="1-year">1 year</SelectItem>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <Label>Product Images</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
                <Button type="button" onClick={addImageUrl} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.images.map(url => (
                  <div key={url} className="flex items-center justify-between p-2 border rounded">
                    <img src={url} alt="Product" className="w-12 h-12 object-cover rounded mr-2" />
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate flex-1">
                      {url}
                    </a>
                    <X 
                      className="w-4 h-4 cursor-pointer hover:text-red-500 ml-2" 
                      onClick={() => removeImageUrl(url)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="requirements">Requirements/Prerequisites</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="What does the customer need to use this product/service?"
                rows={3}
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
                {isSubmitting ? 'Creating Listing...' : 'Create Product/Service Listing'}
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

