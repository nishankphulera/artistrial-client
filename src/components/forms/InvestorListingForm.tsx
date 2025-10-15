import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, TrendingUp, DollarSign, Target, Users } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { projectId } from '@/utils/supabase/info';
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';

interface InvestorFormData {
  title: string;
  listingType: 'seeking-investment' | 'offering-investment';
  projectType: string;
  description: string;
  fundingGoal: string;
  minimumInvestment: string;
  maximumInvestment: string;
  equityOffered: string;
  expectedReturn: string;
  timeline: string;
  stage: string;
  industry: string[];
  riskLevel: string;
  investmentType: string;
  useOfFunds: string[];
  targetMarket: string;
  businessModel: string;
  traction: string;
  teamSize: string;
  location: string;
  documents: File[];
  pitchDeck: File[];
  requiresAccreditation: boolean;
  isPublic: boolean;
  allowsPartialFunding: boolean;
  hasExitStrategy: boolean;
}

export const InvestorListingForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<InvestorFormData>({
    title: '',
    listingType: 'seeking-investment',
    projectType: '',
    description: '',
    fundingGoal: '',
    minimumInvestment: '',
    maximumInvestment: '',
    equityOffered: '',
    expectedReturn: '',
    timeline: '',
    stage: '',
    industry: [],
    riskLevel: '',
    investmentType: '',
    useOfFunds: [],
    targetMarket: '',
    businessModel: '',
    traction: '',
    teamSize: '',
    location: '',
    documents: [],
    pitchDeck: [],
    requiresAccreditation: false,
    isPublic: true,
    allowsPartialFunding: false,
    hasExitStrategy: false
  });
  
  const [newIndustry, setNewIndustry] = useState('');
  const [newUseOfFunds, setNewUseOfFunds] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title.trim() !== '' ||
      formData.projectType !== '' ||
      formData.description.trim() !== '' ||
      formData.fundingGoal.trim() !== '' ||
      formData.minimumInvestment.trim() !== '' ||
      formData.maximumInvestment.trim() !== '' ||
      formData.equityOffered.trim() !== '' ||
      formData.expectedReturn.trim() !== '' ||
      formData.timeline !== '' ||
      formData.stage !== '' ||
      formData.industry.length > 0 ||
      formData.riskLevel !== '' ||
      formData.investmentType !== '' ||
      formData.useOfFunds.length > 0 ||
      formData.targetMarket.trim() !== '' ||
      formData.businessModel.trim() !== '' ||
      formData.traction.trim() !== '' ||
      formData.teamSize.trim() !== '' ||
      formData.location.trim() !== '' ||
      formData.documents.length > 0 ||
      formData.pitchDeck.length > 0 ||
      formData.requiresAccreditation !== false ||
      formData.isPublic !== true ||
      formData.allowsPartialFunding !== false ||
      formData.hasExitStrategy !== false;

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const projectTypes = [
    'Startup',
    'Art Project',
    'Film/Video',
    'Music/Audio',
    'Tech Platform',
    'Creative Agency',
    'Art Gallery',
    'Event Production',
    'Product Development',
    'Real Estate',
    'Social Impact',
    'Other'
  ];

  const stages = [
    'Idea Stage',
    'Prototype/MVP',
    'Early Revenue',
    'Growth Stage',
    'Scaling',
    'Established Business'
  ];

  const investmentTypes = [
    'Equity Investment',
    'Debt Financing',
    'Revenue Share',
    'Convertible Note',
    'Safe Note',
    'Grant/Donation',
    'Royalty Investment',
    'Partnership'
  ];

  const riskLevels = [
    'Low Risk',
    'Medium Risk',
    'High Risk',
    'Very High Risk'
  ];

  const timelineOptions = [
    '3-6 months',
    '6-12 months',
    '1-2 years',
    '2-5 years',
    '5+ years',
    'Ongoing'
  ];

  const addToArray = (field: 'industry' | 'useOfFunds', value: string, setter: (value: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field: 'industry' | 'useOfFunds', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleFileChange = (field: 'documents' | 'pitchDeck', files: FileList | null) => {
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
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      const listingData = {
        ...formData,
        userId: user.id,
        type: 'investment',
        fundingGoal: parseFloat(formData.fundingGoal) || 0,
        minimumInvestment: parseFloat(formData.minimumInvestment) || 0,
        maximumInvestment: parseFloat(formData.maximumInvestment) || 0,
        status: 'active'
      };

      // Remove file fields from listing data
      const { documents, pitchDeck, ...textData } = listingData;
      formDataToSend.append('data', JSON.stringify(textData));

      // Add files
      formData.documents.forEach(file => {
        formDataToSend.append('documents', file);
      });
      
      formData.pitchDeck.forEach(file => {
        formDataToSend.append('pitchDeck', file);
      });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/listings/investor`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success('Investment listing created successfully!');
        setHasUnsavedChanges(false); // Clear unsaved changes flag
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating investment listing:', error);
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
            <TrendingUp className="w-6 h-6 text-orange-600" />
            {formData.listingType === 'seeking-investment' ? 'Seek Investment' : 'Offer Investment'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Listing Type */}
            <div>
              <Label>Listing Type *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="listingType"
                      value="seeking-investment"
                      checked={formData.listingType === 'seeking-investment'}
                      onChange={(e) => setFormData(prev => ({ ...prev, listingType: e.target.value as 'seeking-investment' }))}
                    />
                    <span>Seeking Investment</span>
                  </Label>
                  <p className="text-sm text-gray-500 ml-6">Looking for investors for my project</p>
                </div>
                <div>
                  <Label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="listingType"
                      value="offering-investment"
                      checked={formData.listingType === 'offering-investment'}
                      onChange={(e) => setFormData(prev => ({ ...prev, listingType: e.target.value as 'offering-investment' }))}
                    />
                    <span>Offering Investment</span>
                  </Label>
                  <p className="text-sm text-gray-500 ml-6">I'm an investor looking for opportunities</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">
                  {formData.listingType === 'seeking-investment' ? 'Project/Company Name' : 'Investment Opportunity Title'} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={formData.listingType === 'seeking-investment' ? 
                    "e.g., Revolutionary Art Platform Startup" : 
                    "e.g., Seeking Art Tech Startups for Investment"
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="projectType">
                  {formData.listingType === 'seeking-investment' ? 'Project Type' : 'Investment Focus'} *
                </Label>
                <Select value={formData.projectType} onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stage">
                  {formData.listingType === 'seeking-investment' ? 'Current Stage' : 'Preferred Stage'}
                </Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">
                {formData.listingType === 'seeking-investment' ? 'Project Description' : 'Investment Criteria'} *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={formData.listingType === 'seeking-investment' ? 
                  "Describe your project, vision, market opportunity..." :
                  "Describe what types of projects you're looking to invest in..."
                }
                rows={4}
                required
              />
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <Label>Financial Details</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fundingGoal">
                    {formData.listingType === 'seeking-investment' ? 'Funding Goal' : 'Investment Budget'}
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="fundingGoal"
                      type="number"
                      step="0.01"
                      value={formData.fundingGoal}
                      onChange={(e) => setFormData(prev => ({ ...prev, fundingGoal: e.target.value }))}
                      placeholder="100000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="minimumInvestment">Minimum Investment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="minimumInvestment"
                      type="number"
                      step="0.01"
                      value={formData.minimumInvestment}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimumInvestment: e.target.value }))}
                      placeholder="5000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maximumInvestment">Maximum Investment</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="maximumInvestment"
                      type="number"
                      step="0.01"
                      value={formData.maximumInvestment}
                      onChange={(e) => setFormData(prev => ({ ...prev, maximumInvestment: e.target.value }))}
                      placeholder="50000"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investmentType">Investment Type</Label>
                  <Select value={formData.investmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, investmentType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select value={formData.riskLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevels.map(risk => (
                        <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.listingType === 'seeking-investment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equityOffered">Equity Offered (%)</Label>
                    <Input
                      id="equityOffered"
                      type="number"
                      step="0.1"
                      value={formData.equityOffered}
                      onChange={(e) => setFormData(prev => ({ ...prev, equityOffered: e.target.value }))}
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      step="0.1"
                      value={formData.expectedReturn}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedReturn: e.target.value }))}
                      placeholder="20"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <Label htmlFor="timeline">
                {formData.listingType === 'seeking-investment' ? 'Project Timeline' : 'Investment Timeline'}
              </Label>
              <Select value={formData.timeline} onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map(timeline => (
                    <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industries */}
            <div>
              <Label>Industries/Sectors</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  placeholder="Add industry"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('industry', newIndustry, setNewIndustry))}
                />
                <Button type="button" onClick={() => addToArray('industry', newIndustry, setNewIndustry)} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.industry.map(industry => (
                  <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                    {industry}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('industry', industry)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {formData.listingType === 'seeking-investment' && (
              <>
                {/* Use of Funds */}
                <div>
                  <Label>Use of Funds</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newUseOfFunds}
                      onChange={(e) => setNewUseOfFunds(e.target.value)}
                      placeholder="e.g., Product Development, Marketing, Team Expansion"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('useOfFunds', newUseOfFunds, setNewUseOfFunds))}
                    />
                    <Button type="button" onClick={() => addToArray('useOfFunds', newUseOfFunds, setNewUseOfFunds)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.useOfFunds.map(use => (
                      <Badge key={use} variant="secondary" className="flex items-center gap-1">
                        {use}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeFromArray('useOfFunds', use)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="targetMarket">Target Market</Label>
                    <Input
                      id="targetMarket"
                      value={formData.targetMarket}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                      placeholder="Who are your customers?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessModel">Business Model</Label>
                    <Input
                      id="businessModel"
                      value={formData.businessModel}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessModel: e.target.value }))}
                      placeholder="How do you make money?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="traction">Current Traction</Label>
                    <Input
                      id="traction"
                      value={formData.traction}
                      onChange={(e) => setFormData(prev => ({ ...prev, traction: e.target.value }))}
                      placeholder="Revenue, users, partnerships, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="teamSize"
                        value={formData.teamSize}
                        onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                        placeholder="5 people"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country or Remote"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <Label>Additional Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: !!checked }))}
                  />
                  <Label htmlFor="isPublic">Public listing</Label>
                </div>

                {formData.listingType === 'seeking-investment' && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowsPartialFunding"
                        checked={formData.allowsPartialFunding}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowsPartialFunding: !!checked }))}
                      />
                      <Label htmlFor="allowsPartialFunding">Accept partial funding</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasExitStrategy"
                        checked={formData.hasExitStrategy}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasExitStrategy: !!checked }))}
                      />
                      <Label htmlFor="hasExitStrategy">Have exit strategy</Label>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresAccreditation"
                    checked={formData.requiresAccreditation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresAccreditation: !!checked }))}
                  />
                  <Label htmlFor="requiresAccreditation">Requires accredited investors</Label>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="pitchDeck">Pitch Deck / Presentation</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="pitchDeck" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload pitch deck</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                  <Input
                    id="pitchDeck"
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx"
                    onChange={(e) => handleFileChange('pitchDeck', e.target.files)}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">PDF, PPT files up to 25MB</p>
                  {formData.pitchDeck.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.pitchDeck.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="documents">Additional Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="documents" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload documents</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange('documents', e.target.files)}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">Any file type up to 25MB each</p>
                  {formData.documents.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.documents.length} document(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Listing...' : 'Create Investment Listing'}
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

