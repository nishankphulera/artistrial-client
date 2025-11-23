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
import { X, Plus, Ticket, Calendar, MapPin, Clock, DollarSign, Users, Image } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';
import { uploadMultipleImagesToS3 } from '@/utils/s3Upload';
import { apiUrl } from '@/utils/api';

interface TicketFormData {
  title: string;
  eventType: string;
  description: string;
  shortDescription: string;
  eventDate: string;
  eventTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isOnline: boolean;
  onlineLink: string;
  ticketTypes: TicketType[];
  totalCapacity: string;
  ageRestriction: string;
  category: string[];
  tags: string[];
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  socialLinks: string[];
  images: File[];
  requiresApproval: boolean;
  isRefundable: boolean;
  allowsTransfers: boolean;
  hasAccessibility: boolean;
  hasParking: boolean;
  hasFood: boolean;
  dresscode: string;
  additionalInfo: string;
}

interface TicketType {
  name: string;
  price: string;
  quantity: string;
  description: string;
  saleStartDate: string;
  saleEndDate: string;
}

export const TicketListingForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    eventType: '',
    description: '',
    shortDescription: '',
    eventDate: '',
    eventTime: '',
    endDate: '',
    endTime: '',
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    isOnline: false,
    onlineLink: '',
    ticketTypes: [{
      name: 'General Admission',
      price: '',
      quantity: '',
      description: '',
      saleStartDate: '',
      saleEndDate: ''
    }],
    totalCapacity: '',
    ageRestriction: '',
    category: [],
    tags: [],
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    socialLinks: [],
    images: [],
    requiresApproval: false,
    isRefundable: false,
    allowsTransfers: false,
    hasAccessibility: false,
    hasParking: false,
    hasFood: false,
    dresscode: '',
    additionalInfo: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSocialLink, setNewSocialLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.eventType !== '' ||
      formData.description.trim() !== '' ||
      formData.shortDescription.trim() !== '' ||
      formData.eventDate !== '' ||
      formData.eventTime !== '' ||
      formData.endDate !== '' ||
      formData.endTime !== '' ||
      formData.venue.trim() !== '' ||
      formData.address.trim() !== '' ||
      formData.city.trim() !== '' ||
      formData.state.trim() !== '' ||
      formData.country.trim() !== '' ||
      formData.isOnline !== false ||
      formData.onlineLink.trim() !== '' ||
      formData.ticketTypes.some(ticket => 
        ticket.name.trim() !== '' || ticket.price.trim() !== '' || ticket.quantity.trim() !== '' ||
        ticket.description.trim() !== '' || ticket.saleStartDate !== '' || ticket.saleEndDate !== ''
      ) ||
      formData.totalCapacity.trim() !== '' ||
      formData.ageRestriction !== '' ||
      formData.category.length > 0 ||
      formData.tags.length > 0 ||
      formData.organizer.trim() !== '' ||
      formData.contactEmail.trim() !== '' ||
      formData.contactPhone.trim() !== '' ||
      formData.website.trim() !== '' ||
      formData.socialLinks.length > 0 ||
      formData.images.length > 0 ||
      formData.requiresApproval !== false ||
      formData.isRefundable !== false ||
      formData.allowsTransfers !== false ||
      formData.hasAccessibility !== false ||
      formData.hasParking !== false ||
      formData.hasFood !== false ||
      formData.dresscode.trim() !== '' ||
      formData.additionalInfo.trim() !== '';

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const eventTypes = [
    'Art Exhibition',
    'Gallery Opening',
    'Workshop',
    'Conference',
    'Networking Event',
    'Performance',
    'Concert',
    'Film Screening',
    'Panel Discussion',
    'Masterclass',
    'Art Fair',
    'Studio Tour',
    'Auction',
    'Launch Event',
    'Social Event',
    'Other'
  ];

  const ageRestrictions = [
    'All Ages',
    '13+',
    '16+',
    '18+',
    '21+',
    'Adults Only'
  ];

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, {
        name: '',
        price: '',
        quantity: '',
        description: '',
        saleStartDate: '',
        saleEndDate: ''
      }]
    }));
  };

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: string) => {
    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const addToArray = (field: 'category' | 'tags' | 'socialLinks', value: string, setter: (value: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field: 'category' | 'tags' | 'socialLinks', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(files)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to create a listing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images to S3 first
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        try {
          toast.info('Uploading images...');
          imageUrls = await uploadMultipleImagesToS3(formData.images, 'tickets');
          toast.success(`Successfully uploaded ${imageUrls.length} image(s)`);
        } catch (error) {
          toast.error('Failed to upload images. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare ticket data for API
      const ticketData = {
        user_id: user.id,
        title: formData.title,
        event_type: formData.eventType,
        description: formData.description,
        short_description: formData.shortDescription,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        end_date: formData.endDate || null,
        end_time: formData.endTime || null,
        venue: formData.venue || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        is_online: formData.isOnline,
        online_link: formData.onlineLink || null,
        total_capacity: formData.totalCapacity ? parseInt(formData.totalCapacity) : null,
        age_restriction: formData.ageRestriction || null,
        category: formData.category,
        tags: formData.tags,
        organizer: formData.organizer,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        website: formData.website || null,
        social_links: formData.socialLinks,
        images: imageUrls, // Add uploaded image URLs
        requires_approval: formData.requiresApproval,
        is_refundable: formData.isRefundable,
        allows_transfers: formData.allowsTransfers,
        has_accessibility: formData.hasAccessibility,
        has_parking: formData.hasParking,
        has_food: formData.hasFood,
        dresscode: formData.dresscode || null,
        additional_info: formData.additionalInfo || null,
        status: 'active'
      };

      // Prepare ticket types data
      const ticketTypes = formData.ticketTypes.map(type => ({
        name: type.name,
        price: parseFloat(type.price),
        quantity: parseInt(type.quantity),
        description: type.description || null,
        features: [] // TODO: Add features support
      }));

      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to create a listing');
        return;
      }

      const response = await fetch(apiUrl('tickets'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...ticketData,
          ticket_types: ticketTypes
        }),
      });

      if (response.ok) {
        toast.success('Event listing created successfully!');
        setHasUnsavedChanges(false); // Clear unsaved changes flag
        
        // Redirect to tickets page
        setTimeout(() => {
          router.push('/tickets');
        }, 1000);
        
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating ticket listing:', error);
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
            <Ticket className="w-6 h-6 text-pink-600" />
            Create Event Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Modern Art Exhibition Opening"
                  required
                />
              </div>

              <div>
                <Label htmlFor="eventType">Event Type *</Label>
                <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="organizer">Organizer/Host *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                  placeholder="Organization or person name"
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for previews (150 characters max)"
                  rows={2}
                  maxLength={150}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.shortDescription.length}/150 characters</p>
              </div>

              <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the event, what attendees can expect..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <Label>Event Date & Time</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="eventDate">Start Date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="eventTime">Start Time *</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label>Event Location</Label>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="isOnline"
                  checked={formData.isOnline}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOnline: !!checked }))}
                />
                <Label htmlFor="isOnline">This is an online event</Label>
              </div>

              {formData.isOnline ? (
                <div>
                  <Label htmlFor="onlineLink">Event Link</Label>
                  <Input
                    id="onlineLink"
                    type="url"
                    value={formData.onlineLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, onlineLink: e.target.value }))}
                    placeholder="https://zoom.us/meeting/..."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="venue">Venue Name *</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="Gallery, Museum, Studio, etc."
                      required={!formData.isOnline}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Art Street"
                      required={!formData.isOnline}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="New York"
                      required={!formData.isOnline}
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="NY"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="United States"
                      required={!formData.isOnline}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Ticket Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ticket Types</Label>
                <Button type="button" onClick={addTicketType} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ticket Type
                </Button>
              </div>

              {formData.ticketTypes.map((ticket, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Ticket Type {index + 1}</h4>
                    {formData.ticketTypes.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTicketType(index)}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`ticket-name-${index}`}>Ticket Name *</Label>
                      <Input
                        id={`ticket-name-${index}`}
                        value={ticket.name}
                        onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                        placeholder="General Admission"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`ticket-price-${index}`}>Price *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id={`ticket-price-${index}`}
                          type="number"
                          step="0.01"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                          placeholder="25.00"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`ticket-quantity-${index}`}>Quantity Available</Label>
                      <Input
                        id={`ticket-quantity-${index}`}
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                        placeholder="100"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <Label htmlFor={`ticket-description-${index}`}>Description</Label>
                      <Input
                        id={`ticket-description-${index}`}
                        value={ticket.description}
                        onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                        placeholder="What's included with this ticket type"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`ticket-sale-start-${index}`}>Sale Start Date</Label>
                      <Input
                        id={`ticket-sale-start-${index}`}
                        type="date"
                        value={ticket.saleStartDate}
                        onChange={(e) => updateTicketType(index, 'saleStartDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`ticket-sale-end-${index}`}>Sale End Date</Label>
                      <Input
                        id={`ticket-sale-end-${index}`}
                        type="date"
                        value={ticket.saleEndDate}
                        onChange={(e) => updateTicketType(index, 'saleEndDate', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="totalCapacity">Total Event Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="totalCapacity"
                    value={formData.totalCapacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalCapacity: e.target.value }))}
                    placeholder="200 people"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ageRestriction">Age Restriction</Label>
                <Select value={formData.ageRestriction} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRestriction: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age restriction" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageRestrictions.map(age => (
                      <SelectItem key={age} value={age}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categories and Tags */}
            <div className="space-y-4">
              <div>
                <Label>Categories</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add category"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('category', newCategory, setNewCategory))}
                  />
                  <Button type="button" onClick={() => addToArray('category', newCategory, setNewCategory)} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.category.map(cat => (
                    <Badge key={cat} variant="secondary" className="flex items-center gap-1">
                      {cat}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeFromArray('category', cat)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('tags', newTag, setNewTag))}
                  />
                  <Button type="button" onClick={() => addToArray('tags', newTag, setNewTag)} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeFromArray('tags', tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="info@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Event Features */}
            <div className="space-y-4">
              <Label>Event Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAccessibility"
                    checked={formData.hasAccessibility}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasAccessibility: !!checked }))}
                  />
                  <Label htmlFor="hasAccessibility">Wheelchair Accessible</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasParking"
                    checked={formData.hasParking}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasParking: !!checked }))}
                  />
                  <Label htmlFor="hasParking">Parking Available</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFood"
                    checked={formData.hasFood}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasFood: !!checked }))}
                  />
                  <Label htmlFor="hasFood">Food & Drinks</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRefundable"
                    checked={formData.isRefundable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRefundable: !!checked }))}
                  />
                  <Label htmlFor="isRefundable">Refundable Tickets</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowsTransfers"
                    checked={formData.allowsTransfers}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowsTransfers: !!checked }))}
                  />
                  <Label htmlFor="allowsTransfers">Transfer Allowed</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresApproval"
                    checked={formData.requiresApproval}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresApproval: !!checked }))}
                  />
                  <Label htmlFor="requiresApproval">Requires Approval</Label>
                </div>
              </div>
            </div>

            {/* Event Images */}
            <div>
              <Label htmlFor="images">Event Images *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="images" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">Upload event images</span>
                  <span className="text-gray-500"> or drag and drop</span>
                </Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
                {formData.images.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    {formData.images.length} image(s) selected
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Any additional details attendees should know..."
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Event...' : 'Create Event Listing'}
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

