import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Gavel, Scale, Clock, DollarSign, MapPin, Award } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';
import { createListingCreationEvent } from '@/utils/userEvents';

interface LegalFormData {
  title: string;
  serviceType: string;
  specializations: string[];
  description: string;
  experience: string;
  education: string[];
  certifications: string[];
  hourlyRate: string;
  consultationFee: string;
  flatRateFees: FlatRateService[];
  languages: string[];
  jurisdiction: string[];
  officeLocation: string;
  city: string;
  state: string;
  country: string;
  availability: string;
  responseTime: string;
  practiceAreas: string[];
  clientTypes: string[];
  caseTypes: string[];
  isBarAdmitted: boolean;
  barNumbers: string[];
  hasInsurance: boolean;
  insuranceAmount: string;
  acceptsLegalAid: boolean;
  offersContingency: boolean;
  hasVirtualConsultation: boolean;
  offersFreeConsultation: boolean;
  freeConsultationDuration: string;
  minimumCaseValue: string;
  maxCaseLoad: string;
  references: string[];
  awards: string[];
  publications: string[];
  website: string;
  linkedIn: string;
  bio: string;
}

interface FlatRateService {
  serviceName: string;
  description: string;
  price: string;
  timeline: string;
}

export const LegalListingForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<LegalFormData>({
    title: '',
    serviceType: '',
    specializations: [],
    description: '',
    experience: '',
    education: [],
    certifications: [],
    hourlyRate: '',
    consultationFee: '',
    flatRateFees: [],
    languages: ['English'],
    jurisdiction: [],
    officeLocation: '',
    city: '',
    state: '',
    country: '',
    availability: '',
    responseTime: '',
    practiceAreas: [],
    clientTypes: [],
    caseTypes: [],
    isBarAdmitted: false,
    barNumbers: [],
    hasInsurance: false,
    insuranceAmount: '',
    acceptsLegalAid: false,
    offersContingency: false,
    hasVirtualConsultation: false,
    offersFreeConsultation: false,
    freeConsultationDuration: '',
    minimumCaseValue: '',
    maxCaseLoad: '',
    references: [],
    awards: [],
    publications: [],
    website: '',
    linkedIn: '',
    bio: ''
  });
  
  const [newItem, setNewItem] = useState('');
  const [currentField, setCurrentField] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.serviceType !== '' ||
      formData.specializations.length > 0 ||
      formData.description.trim() !== '' ||
      formData.experience !== '' ||
      formData.education.length > 0 ||
      formData.certifications.length > 0 ||
      formData.hourlyRate.trim() !== '' ||
      formData.consultationFee.trim() !== '' ||
      formData.flatRateFees.length > 0 ||
      formData.languages.length > 1 || // More than just default 'English'
      formData.jurisdiction.length > 0 ||
      formData.officeLocation.trim() !== '' ||
      formData.city.trim() !== '' ||
      formData.state.trim() !== '' ||
      formData.country.trim() !== '' ||
      formData.availability !== '' ||
      formData.responseTime !== '' ||
      formData.practiceAreas.length > 0 ||
      formData.clientTypes.length > 0 ||
      formData.caseTypes.length > 0 ||
      formData.isBarAdmitted !== false ||
      formData.barNumbers.length > 0 ||
      formData.hasInsurance !== false ||
      formData.insuranceAmount.trim() !== '' ||
      formData.acceptsLegalAid !== false ||
      formData.offersContingency !== false ||
      formData.hasVirtualConsultation !== false ||
      formData.offersFreeConsultation !== false ||
      formData.freeConsultationDuration.trim() !== '' ||
      formData.minimumCaseValue.trim() !== '' ||
      formData.maxCaseLoad.trim() !== '' ||
      formData.references.length > 0 ||
      formData.awards.length > 0 ||
      formData.publications.length > 0 ||
      formData.website.trim() !== '' ||
      formData.linkedIn.trim() !== '' ||
      formData.bio.trim() !== '';

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const serviceTypes = [
    'Law Firm',
    'Solo Practitioner',
    'Legal Consultant',
    'Contract Attorney',
    'Paralegal Services',
    'Legal Document Preparation',
    'Mediation Services',
    'Legal Research',
    'Compliance Consulting',
    'Other'
  ];

  const experienceLevels = [
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10-15 years',
    '15-20 years',
    '20+ years'
  ];

  const availabilityOptions = [
    'Business Hours Only',
    'Extended Hours',
    'Weekends Available',
    'Emergency Availability',
    '24/7 Availability',
    'By Appointment Only'
  ];

  const responseTimeOptions = [
    'Same Day',
    'Within 24 hours',
    'Within 48 hours',
    'Within 1 week',
    'Varies by case'
  ];

  const commonPracticeAreas = [
    'Intellectual Property',
    'Entertainment Law',
    'Art Law',
    'Contract Law',
    'Business Formation',
    'Employment Law',
    'Copyright & Trademark',
    'Privacy Law',
    'Media Law',
    'Real Estate',
    'Immigration',
    'Tax Law',
    'Estate Planning',
    'Litigation',
    'Corporate Law'
  ];

  const clientTypeOptions = [
    'Individual Artists',
    'Creative Agencies',
    'Startups',
    'Small Businesses',
    'Large Corporations',
    'Non-profits',
    'Entertainment Companies',
    'Galleries & Museums',
    'Publishers',
    'Tech Companies'
  ];

  const addFlatRateService = () => {
    setFormData(prev => ({
      ...prev,
      flatRateFees: [...prev.flatRateFees, {
        serviceName: '',
        description: '',
        price: '',
        timeline: ''
      }]
    }));
  };

  const removeFlatRateService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      flatRateFees: prev.flatRateFees.filter((_, i) => i !== index)
    }));
  };

  const updateFlatRateService = (index: number, field: keyof FlatRateService, value: string) => {
    setFormData(prev => ({
      ...prev,
      flatRateFees: prev.flatRateFees.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addToArray = (field: keyof LegalFormData, value: string) => {
    if (value.trim() && Array.isArray(formData[field])) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, value.trim()]
        }));
        setNewItem('');
      }
    }
  };

  const removeFromArray = (field: keyof LegalFormData, value: string) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: (formData[field] as string[]).filter(item => item !== value)
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to create a listing');
        return;
      }

      // Prepare legal service data for API
      const legalServiceData = {
        user_id: user.id,
        title: formData.title,
        service_type: formData.serviceType,
        specializations: formData.specializations,
        description: formData.description,
        experience: formData.experience,
        education: formData.education,
        certifications: formData.certifications,
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        consultation_fee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
        languages: formData.languages,
        jurisdiction: formData.jurisdiction,
        office_location: formData.officeLocation || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        availability: formData.availability,
        response_time: formData.responseTime,
        practice_areas: formData.practiceAreas,
        client_types: formData.clientTypes,
        case_types: formData.caseTypes,
        is_bar_admitted: formData.isBarAdmitted,
        bar_numbers: formData.barNumbers,
        has_insurance: formData.hasInsurance,
        insurance_amount: formData.insuranceAmount ? parseFloat(formData.insuranceAmount) : null,
        accepts_legal_aid: formData.acceptsLegalAid,
        offers_contingency: formData.offersContingency,
        has_virtual_consultation: formData.hasVirtualConsultation,
        offers_free_consultation: formData.offersFreeConsultation,
        free_consultation_duration: formData.freeConsultationDuration || null,
        minimum_case_value: formData.minimumCaseValue ? parseFloat(formData.minimumCaseValue) : null,
        max_case_load: formData.maxCaseLoad ? parseInt(formData.maxCaseLoad) : null,
        references_list: formData.references,
        awards: formData.awards,
        publications: formData.publications,
        website: formData.website || null,
        linkedin: formData.linkedIn || null,
        bio: formData.bio,
        status: 'active'
      };

      // Prepare flat rate services data
      const flatRateServices = formData.flatRateFees.map(service => ({
        service_name: service.serviceName,
        description: service.description || null,
        price: parseFloat(service.price),
        timeline: service.timeline || null
      }));

      const response = await fetch('http://localhost:5001/api/legal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...legalServiceData,
          flat_rate_services: flatRateServices
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const legalServiceId = responseData.data?.id || responseData.id;
        
        // Create user event for legal service creation
        if (legalServiceId) {
          await createListingCreationEvent(
            user.id,
            'legal',
            legalServiceId,
            formData.title,
            `Created legal service listing: ${formData.title}`,
            {
              service_type: formData.serviceType,
              practice_areas: formData.practiceAreas,
              hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
              city: formData.city,
              state: formData.state
            }
          );
        }
        
        toast.success('Legal services listing created successfully!');
        setHasUnsavedChanges(false); // Clear unsaved changes flag
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating legal listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderArrayInput = (field: keyof LegalFormData, label: string, placeholder: string, suggestions?: string[]) => (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={currentField === field ? newItem : ''}
          onChange={(e) => {
            setNewItem(e.target.value);
            setCurrentField(field);
          }}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray(field, newItem))}
        />
        <Button type="button" onClick={() => addToArray(field, newItem)} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {suggestions && (
        <div className="flex flex-wrap gap-1 mb-2">
          {suggestions.map(suggestion => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addToArray(field, suggestion)}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {(formData[field] as string[]).map(item => (
          <Badge key={item} variant="secondary" className="flex items-center gap-1">
            {item}
            <X 
              className="w-3 h-3 cursor-pointer hover:text-red-500" 
              onClick={() => removeFromArray(field, item)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <BackToDashboard hasUnsavedChanges={hasUnsavedChanges} className="mb-4" />
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Gavel className="w-6 h-6 text-indigo-600" />
            Create Legal Services Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Entertainment Law & IP Protection Services"
                  required
                />
              </div>

              <div>
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
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

            {/* Description */}
            <div>
              <Label htmlFor="description">Service Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your legal services, expertise, and how you can help clients..."
                rows={4}
                required
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell clients about your background, approach, and what makes you unique..."
                rows={3}
              />
            </div>

            {/* Practice Areas */}
            {renderArrayInput('practiceAreas', 'Practice Areas *', 'Add practice area', commonPracticeAreas)}

            {/* Specializations */}
            {renderArrayInput('specializations', 'Specializations', 'Add specialization')}

            {/* Pricing */}
            <div className="space-y-4">
              <Label>Pricing Structure</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="250"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="consultationFee">Initial Consultation Fee</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="consultationFee"
                      type="number"
                      step="0.01"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                      placeholder="150"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="offersFreeConsultation"
                  checked={formData.offersFreeConsultation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, offersFreeConsultation: !!checked }))}
                />
                <Label htmlFor="offersFreeConsultation">Offer free initial consultation</Label>
              </div>

              {formData.offersFreeConsultation && (
                <div>
                  <Label htmlFor="freeConsultationDuration">Free Consultation Duration</Label>
                  <Input
                    id="freeConsultationDuration"
                    value={formData.freeConsultationDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, freeConsultationDuration: e.target.value }))}
                    placeholder="30 minutes"
                  />
                </div>
              )}
            </div>

            {/* Flat Rate Services */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Flat Rate Services</Label>
                <Button type="button" onClick={addFlatRateService} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {formData.flatRateFees.map((service, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Flat Rate Service {index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeFlatRateService(index)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`service-name-${index}`}>Service Name</Label>
                      <Input
                        id={`service-name-${index}`}
                        value={service.serviceName}
                        onChange={(e) => updateFlatRateService(index, 'serviceName', e.target.value)}
                        placeholder="Contract Review"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`service-price-${index}`}>Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id={`service-price-${index}`}
                          type="number"
                          step="0.01"
                          value={service.price}
                          onChange={(e) => updateFlatRateService(index, 'price', e.target.value)}
                          placeholder="500"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`service-timeline-${index}`}>Timeline</Label>
                      <Input
                        id={`service-timeline-${index}`}
                        value={service.timeline}
                        onChange={(e) => updateFlatRateService(index, 'timeline', e.target.value)}
                        placeholder="3-5 business days"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`service-description-${index}`}>Description</Label>
                      <Input
                        id={`service-description-${index}`}
                        value={service.description}
                        onChange={(e) => updateFlatRateService(index, 'description', e.target.value)}
                        placeholder="What's included in this service"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Credentials */}
            <div className="space-y-4">
              <Label>Professional Credentials</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isBarAdmitted"
                  checked={formData.isBarAdmitted}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBarAdmitted: !!checked }))}
                />
                <Label htmlFor="isBarAdmitted">Licensed Attorney (Bar Admitted)</Label>
              </div>

              {formData.isBarAdmitted && renderArrayInput('barNumbers', 'Bar Admission Numbers', 'Add bar number')}
              {renderArrayInput('jurisdiction', 'Licensed Jurisdictions', 'Add jurisdiction (state/country)')}
              {renderArrayInput('education', 'Education', 'Add degree/institution')}
              {renderArrayInput('certifications', 'Certifications', 'Add certification')}
            </div>

            {/* Insurance */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasInsurance: !!checked }))}
                />
                <Label htmlFor="hasInsurance">Professional Liability Insurance</Label>
              </div>

              {formData.hasInsurance && (
                <div>
                  <Label htmlFor="insuranceAmount">Insurance Coverage Amount</Label>
                  <Input
                    id="insuranceAmount"
                    value={formData.insuranceAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, insuranceAmount: e.target.value }))}
                    placeholder="$1,000,000"
                  />
                </div>
              )}
            </div>

            {/* Client Information */}
            {renderArrayInput('clientTypes', 'Client Types', 'Add client type', clientTypeOptions)}
            {renderArrayInput('caseTypes', 'Case Types Handled', 'Add case type')}

            {/* Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="responseTime">Response Time</Label>
                <Select value={formData.responseTime} onValueChange={(value) => setFormData(prev => ({ ...prev, responseTime: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response time" />
                  </SelectTrigger>
                  <SelectContent>
                    {responseTimeOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="officeLocation">Office Address</Label>
                <Input
                  id="officeLocation"
                  value={formData.officeLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, officeLocation: e.target.value }))}
                  placeholder="123 Legal Street"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="New York"
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
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="United States"
                />
              </div>
            </div>

            {/* Service Options */}
            <div className="space-y-4">
              <Label>Service Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasVirtualConsultation"
                    checked={formData.hasVirtualConsultation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasVirtualConsultation: !!checked }))}
                  />
                  <Label htmlFor="hasVirtualConsultation">Virtual consultations available</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptsLegalAid"
                    checked={formData.acceptsLegalAid}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptsLegalAid: !!checked }))}
                  />
                  <Label htmlFor="acceptsLegalAid">Accept legal aid clients</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offersContingency"
                    checked={formData.offersContingency}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, offersContingency: !!checked }))}
                  />
                  <Label htmlFor="offersContingency">Contingency fee arrangements</Label>
                </div>
              </div>
            </div>

            {/* Languages */}
            {renderArrayInput('languages', 'Languages Spoken', 'Add language')}

            {/* Professional Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://lawfirm.com"
                />
              </div>

              <div>
                <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                <Input
                  id="linkedIn"
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                  placeholder="https://linkedin.com/in/lawyer"
                />
              </div>
            </div>

            {/* Professional Recognition */}
            {renderArrayInput('awards', 'Awards & Recognition', 'Add award')}
            {renderArrayInput('publications', 'Publications', 'Add publication')}
            {renderArrayInput('references', 'Professional References', 'Add reference')}

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Listing...' : 'Create Legal Services Listing'}
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

