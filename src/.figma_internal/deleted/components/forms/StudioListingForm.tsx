import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { X, Plus, Building, Camera, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';

interface StudioFormData {
  title: string;
  studioType: string;
  description: string;
  hourlyRate: string;
  dailyRate: string;
  weeklyRate: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  size: string;
  capacity: string;
  amenities: string[];
  equipment: string[];
  rules: string[];
  availability: string[];
  bookingAdvance: string;
  cancellationPolicy: string;
  accessInstructions: string;
  parkingInfo: string;
  publicTransport: string;
  nearbyLandmarks: string;
  images: File[];
  hasNaturalLight: boolean;
  hasAirConditioning: boolean;
  hasKitchen: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  isAccessible: boolean;
  allowsEvents: boolean;
  allowsCommercial: boolean;
  allowsFood: boolean;
}

interface StudioListingFormProps {
  onClose?: () => void;
  isDashboardDarkMode?: boolean;
}

export const StudioListingForm: React.FC<StudioListingFormProps> = ({ onClose, isDashboardDarkMode = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<StudioFormData>({
    title: '',
    studioType: '',
    description: '',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    size: '',
    capacity: '',
    amenities: [],
    equipment: [],
    rules: [],
    availability: [],
    bookingAdvance: '',
    cancellationPolicy: '',
    accessInstructions: '',
    parkingInfo: '',
    publicTransport: '',
    nearbyLandmarks: '',
    images: [],
    hasNaturalLight: false,
    hasAirConditioning: false,
    hasKitchen: false,
    hasWifi: false,
    hasParking: false,
    isAccessible: false,
    allowsEvents: false,
    allowsCommercial: false,
    allowsFood: false
  });
  
  const [newAmenity, setNewAmenity] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newRule, setNewRule] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.studioType !== '' ||
      formData.description.trim() !== '' ||
      formData.hourlyRate.trim() !== '' ||
      formData.dailyRate.trim() !== '' ||
      formData.weeklyRate.trim() !== '' ||
      formData.address.trim() !== '' ||
      formData.city.trim() !== '' ||
      formData.state.trim() !== '' ||
      formData.country.trim() !== '' ||
      formData.zipCode.trim() !== '' ||
      formData.size.trim() !== '' ||
      formData.capacity.trim() !== '' ||
      formData.amenities.length > 0 ||
      formData.equipment.length > 0 ||
      formData.rules.length > 0 ||
      formData.availability.length > 0 ||
      formData.bookingAdvance !== '' ||
      formData.cancellationPolicy !== '' ||
      formData.accessInstructions.trim() !== '' ||
      formData.parkingInfo.trim() !== '' ||
      formData.publicTransport.trim() !== '' ||
      formData.nearbyLandmarks.trim() !== '' ||
      formData.images.length > 0 ||
      formData.hasNaturalLight !== false ||
      formData.hasAirConditioning !== false ||
      formData.hasKitchen !== false ||
      formData.hasWifi !== false ||
      formData.hasParking !== false ||
      formData.isAccessible !== false ||
      formData.allowsEvents !== false ||
      formData.allowsCommercial !== false ||
      formData.allowsFood !== false;

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const studioTypes = [
    'Photography Studio',
    'Video Production Studio',
    'Recording Studio',
    'Art Studio',
    'Dance Studio',
    'Rehearsal Space',
    'Event Space',
    'Maker Space',
    'Co-working Space',
    'Meeting Room',
    'Workshop Space',
    'Other'
  ];

  const availabilityOptions = [
    'Monday - Friday',
    'Weekends',
    '24/7',
    'Evenings Only',
    'Daytime Only',
    'By Appointment'
  ];

  const cancellationPolicies = [
    'Flexible (24 hours)',
    'Moderate (3 days)',
    'Strict (7 days)',
    'Super Strict (14 days)',
    'No Cancellation'
  ];

  const addToArray = (field: 'amenities' | 'equipment' | 'rules', value: string, setter: (value: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field: 'amenities' | 'equipment' | 'rules', value: string) => {
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
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      const listingData = {
        ...formData,
        userId: user.id,
        type: 'studio',
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        dailyRate: parseFloat(formData.dailyRate) || 0,
        weeklyRate: parseFloat(formData.weeklyRate) || 0,
        status: 'active'
      };

      // Remove images field from listing data
      const { images, ...textData } = listingData;
      formDataToSend.append('data', JSON.stringify(textData));

      // Add images
      formData.images.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/listings/studio`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success('Studio listing created successfully!');
        setHasUnsavedChanges(false); // Clear unsaved changes flag
        if (onClose) onClose();
        // Reset form would go here
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating studio listing:', error);
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
              <Building className="w-6 h-6 text-purple-600" />
              Create Studio Listing
            </CardTitle>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Studio Name *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Bright Photography Studio in Downtown"
                  required
                />
              </div>

              <div>
                <Label htmlFor="studioType">Studio Type *</Label>
                <Select value={formData.studioType} onValueChange={(value) => setFormData(prev => ({ ...prev, studioType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select studio type" />
                  </SelectTrigger>
                  <SelectContent>
                    {studioTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size">Studio Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="e.g., 1000 sq ft, 30x20 ft"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Studio Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your studio space, what it's best used for, unique features..."
                rows={4}
                required
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <Label>Rental Rates</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="hourlyRate"
                      type="number"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                      placeholder="50"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dailyRate">Daily Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="dailyRate"
                      type="number"
                      step="0.01"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dailyRate: e.target.value }))}
                      placeholder="300"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weeklyRate">Weekly Rate</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="weeklyRate"
                      type="number"
                      step="0.01"
                      value={formData.weeklyRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, weeklyRate: e.target.value }))}
                      placeholder="1500"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label>Location</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Studio Lane"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="New York"
                    required
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

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="United States"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Studio Features */}
            <div className="space-y-4">
              <Label>Studio Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasNaturalLight"
                    checked={formData.hasNaturalLight}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasNaturalLight: !!checked }))}
                  />
                  <Label htmlFor="hasNaturalLight">Natural Light</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAirConditioning"
                    checked={formData.hasAirConditioning}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasAirConditioning: !!checked }))}
                  />
                  <Label htmlFor="hasAirConditioning">Air Conditioning</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasKitchen"
                    checked={formData.hasKitchen}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasKitchen: !!checked }))}
                  />
                  <Label htmlFor="hasKitchen">Kitchen/Refreshments</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWifi"
                    checked={formData.hasWifi}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasWifi: !!checked }))}
                  />
                  <Label htmlFor="hasWifi">WiFi</Label>
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
                    id="isAccessible"
                    checked={formData.isAccessible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAccessible: !!checked }))}
                  />
                  <Label htmlFor="isAccessible">Wheelchair Accessible</Label>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity">Maximum Capacity</Label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="10 people"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Equipment */}
            <div>
              <Label>Available Equipment</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  placeholder="Add equipment"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('equipment', newEquipment, setNewEquipment))}
                />
                <Button type="button" onClick={() => addToArray('equipment', newEquipment, setNewEquipment)} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.equipment.map(item => (
                  <Badge key={item} variant="secondary" className="flex items-center gap-1">
                    {item}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('equipment', item)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label>Additional Amenities</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add amenity"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('amenities', newAmenity, setNewAmenity))}
                />
                <Button type="button" onClick={() => addToArray('amenities', newAmenity, setNewAmenity)} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map(amenity => (
                  <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                    {amenity}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('amenities', amenity)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Booking Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bookingAdvance">Minimum Booking Notice</Label>
                <Select value={formData.bookingAdvance} onValueChange={(value) => setFormData(prev => ({ ...prev, bookingAdvance: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notice period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same-day">Same day</SelectItem>
                    <SelectItem value="1-day">1 day</SelectItem>
                    <SelectItem value="2-days">2 days</SelectItem>
                    <SelectItem value="1-week">1 week</SelectItem>
                    <SelectItem value="2-weeks">2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Select value={formData.cancellationPolicy} onValueChange={(value) => setFormData(prev => ({ ...prev, cancellationPolicy: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {cancellationPolicies.map(policy => (
                      <SelectItem key={policy} value={policy}>{policy}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Studio Images */}
            <div>
              <Label htmlFor="images">Studio Images *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="images" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">Upload studio images</span>
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

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Listing...' : 'Create Studio Listing'}
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

