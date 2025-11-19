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
import { toast } from 'sonner';
import { BackToDashboard } from '../shared/BackToDashboard';
import { apiUrl } from '@/utils/api';

interface InvestorFormData {
  company_name: string;
  bio: string;
  investment_focus: string;
  website: string;
  investment_types: string[];
  investment_range_min: string;
  investment_range_max: string;
  investment_focus_areas: string[];
  preferred_stages: string[];
  geographic_focus: string[];
  portfolio_companies: string[];
  contact_email: string;
  phone: string;
  location: string;
  years_experience: string;
  certifications: string[];
  languages: string[];
  minimum_investment: string;
  maximum_investment: string;
  investment_terms: string;
  portfolio_url: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  website_url: string;
}

export const InvestorListingForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<InvestorFormData>({
    company_name: '',
    bio: '',
    investment_focus: '',
    website: '',
    investment_types: [],
    investment_range_min: '',
    investment_range_max: '',
    investment_focus_areas: [],
    preferred_stages: [],
    geographic_focus: [],
    portfolio_companies: [],
    contact_email: '',
    phone: '',
    location: '',
    years_experience: '',
    certifications: [],
    languages: ['English'],
    minimum_investment: '',
    maximum_investment: '',
    investment_terms: '',
    portfolio_url: '',
    linkedin_url: '',
    twitter_url: '',
    instagram_url: '',
    website_url: ''
  });
  
  const [newIndustry, setNewIndustry] = useState('');
  const [newUseOfFunds, setNewUseOfFunds] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track form changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.company_name.trim() !== '' ||
      formData.bio.trim() !== '' ||
      formData.investment_focus.trim() !== '' ||
      formData.website.trim() !== '' ||
      formData.investment_types.length > 0 ||
      formData.investment_range_min.trim() !== '' ||
      formData.investment_range_max.trim() !== '' ||
      formData.investment_focus_areas.length > 0 ||
      formData.preferred_stages.length > 0 ||
      formData.geographic_focus.length > 0 ||
      formData.portfolio_companies.length > 0 ||
      formData.contact_email.trim() !== '' ||
      formData.phone.trim() !== '' ||
      formData.location.trim() !== '' ||
      formData.years_experience.trim() !== '' ||
      formData.certifications.length > 0 ||
      formData.languages.length > 1 || // More than just 'English'
      formData.minimum_investment.trim() !== '' ||
      formData.maximum_investment.trim() !== '' ||
      formData.investment_terms.trim() !== '' ||
      formData.portfolio_url.trim() !== '' ||
      formData.linkedin_url.trim() !== '' ||
      formData.twitter_url.trim() !== '' ||
      formData.instagram_url.trim() !== '' ||
      formData.website_url.trim() !== '';

    setHasUnsavedChanges(hasChanges);
  }, [formData]);

  const investmentTypes = [
    'equity',
    'debt',
    'revenue_share',
    'royalty',
    'grants',
    'loans'
  ];

  const focusAreas = [
    'music',
    'film',
    'art',
    'gaming',
    'technology',
    'media',
    'publishing',
    'fashion'
  ];

  const stages = [
    'pre_seed',
    'seed',
    'series_a',
    'series_b',
    'series_c',
    'growth',
    'late_stage'
  ];

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Russian'
  ];

  const addToArray = (field: 'investment_types' | 'investment_focus_areas' | 'preferred_stages' | 'geographic_focus' | 'portfolio_companies' | 'certifications' | 'languages', value: string, setter: (value: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field: 'investment_types' | 'investment_focus_areas' | 'preferred_stages' | 'geographic_focus' | 'portfolio_companies' | 'certifications' | 'languages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const investorData = {
        user_id: user.id,
        company_name: formData.company_name,
        bio: formData.bio,
        investment_focus: formData.investment_focus,
        website: formData.website,
        investment_types: formData.investment_types,
        investment_range_min: formData.investment_range_min ? parseFloat(formData.investment_range_min) : undefined,
        investment_range_max: formData.investment_range_max ? parseFloat(formData.investment_range_max) : undefined,
        investment_focus_areas: formData.investment_focus_areas,
        preferred_stages: formData.preferred_stages,
        geographic_focus: formData.geographic_focus,
        portfolio_companies: formData.portfolio_companies,
        contact_email: formData.contact_email,
        phone: formData.phone,
        location: formData.location,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : undefined,
        certifications: formData.certifications,
        languages: formData.languages,
        minimum_investment: formData.minimum_investment ? parseFloat(formData.minimum_investment) : undefined,
        maximum_investment: formData.maximum_investment ? parseFloat(formData.maximum_investment) : undefined,
        investment_terms: formData.investment_terms,
        portfolio_url: formData.portfolio_url,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        instagram_url: formData.instagram_url,
        website_url: formData.website_url
      };

      const response = await fetch(apiUrl('investors'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investorData),
      });

      if (response.ok) {
        toast.success('Investor profile created successfully!');
        setHasUnsavedChanges(false);
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create investor profile');
      }
    } catch (error) {
      console.error('Error creating investor profile:', error);
      toast.error('Failed to create investor profile');
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
            Create Investor Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="company_name">Company/Firm Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="e.g., Acme Ventures, Creative Capital"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="contact@company.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1-555-0123"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="San Francisco, CA or Remote"
                />
              </div>
            </div>

            {/* Bio and Investment Focus */}
            <div>
              <Label htmlFor="bio">Bio/About *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about your investment firm, experience, and approach..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="investment_focus">Investment Focus *</Label>
              <Textarea
                id="investment_focus"
                value={formData.investment_focus}
                onChange={(e) => setFormData(prev => ({ ...prev, investment_focus: e.target.value }))}
                placeholder="Describe your investment focus, thesis, and what you look for in investments..."
                rows={3}
                required
              />
            </div>

            {/* Investment Types */}
            <div>
              <Label>Investment Types</Label>
              <div className="flex gap-2 mb-2">
                <Select onValueChange={(value) => addToArray('investment_types', value, () => {})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.investment_types.map(type => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('investment_types', type)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Investment Focus Areas */}
            <div>
              <Label>Investment Focus Areas</Label>
              <div className="flex gap-2 mb-2">
                <Select onValueChange={(value) => addToArray('investment_focus_areas', value, () => {})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    {focusAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.investment_focus_areas.map(area => (
                  <Badge key={area} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('investment_focus_areas', area)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preferred Stages */}
            <div>
              <Label>Preferred Investment Stages</Label>
              <div className="flex gap-2 mb-2">
                <Select onValueChange={(value) => addToArray('preferred_stages', value, () => {})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferred_stages.map(stage => (
                  <Badge key={stage} variant="secondary" className="flex items-center gap-1">
                    {stage}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('preferred_stages', stage)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Investment Amounts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="investment_range_min">Minimum Investment Range</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="investment_range_min"
                    type="number"
                    step="0.01"
                    value={formData.investment_range_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, investment_range_min: e.target.value }))}
                    placeholder="25000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="investment_range_max">Maximum Investment Range</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="investment_range_max"
                    type="number"
                    step="0.01"
                    value={formData.investment_range_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, investment_range_max: e.target.value }))}
                    placeholder="500000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value }))}
                  placeholder="10"
                />
              </div>
            </div>

            {/* Portfolio Companies */}
            <div>
              <Label>Portfolio Companies</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  placeholder="Add portfolio company"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('portfolio_companies', newIndustry, setNewIndustry))}
                />
                <Button type="button" onClick={() => addToArray('portfolio_companies', newIndustry, setNewIndustry)} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.portfolio_companies.map(company => (
                  <Badge key={company} variant="secondary" className="flex items-center gap-1">
                    {company}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('portfolio_companies', company)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <Label>Certifications</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newUseOfFunds}
                  onChange={(e) => setNewUseOfFunds(e.target.value)}
                  placeholder="Add certification (e.g., CFA, Series 7)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('certifications', newUseOfFunds, setNewUseOfFunds))}
                />
                <Button type="button" onClick={() => addToArray('certifications', newUseOfFunds, setNewUseOfFunds)} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map(cert => (
                  <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                    {cert}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('certifications', cert)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <Label>Languages</Label>
              <div className="flex gap-2 mb-2">
                <Select onValueChange={(value) => addToArray('languages', value, () => {})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map(lang => (
                  <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                    {lang}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeFromArray('languages', lang)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Investment Terms */}
            <div>
              <Label htmlFor="investment_terms">Investment Terms</Label>
              <Textarea
                id="investment_terms"
                value={formData.investment_terms}
                onChange={(e) => setFormData(prev => ({ ...prev, investment_terms: e.target.value }))}
                placeholder="Describe your typical investment terms, conditions, and requirements..."
                rows={3}
              />
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/company/company-name"
                />
              </div>

              <div>
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                  placeholder="https://twitter.com/companyhandle"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/companyhandle"
                />
              </div>

              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  placeholder="https://company.com"
                />
              </div>
            </div>

            {/* Portfolio URL */}
            <div>
              <Label htmlFor="portfolio_url">Portfolio URL</Label>
              <Input
                id="portfolio_url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                placeholder="https://company.com/portfolio"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating Profile...' : 'Create Investor Profile'}
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

