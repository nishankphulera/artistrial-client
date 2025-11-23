import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, User, Upload, MapPin, Globe, Phone, Mail, Building, DollarSign, Briefcase, Palette, Plus, X, Shield, FileText, Camera, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiUrl } from '@/utils/api';
import { uploadImageToS3 } from '@/utils/s3Upload';

interface ProfileFormData {
  username: string;
  full_name: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  avatar_url: string;
  profile_type: string;
  // Artist specific
  specialties: string[];
  // Venue specific
  venue_capacity: number;
  venue_amenities: string[];
  // Investor specific
  investment_range: { min: number; max: number };
  investment_focus: string[];
  // Legal specific
  legal_specialization: string[];
  bar_admission: string[];
}

interface ProfileSettingsPageProps {
  isDashboardDarkMode?: boolean;
}

const ARTIST_SPECIALTIES = [
  'Digital Art', 'Oil Painting', 'Watercolor', 'Acrylic Painting', 'Photography', 
  'Sculpture', 'Mixed Media', 'Portrait', 'Landscape', 'Abstract Art', 'Street Art',
  'Concept Art', 'Illustration', 'Graphic Design', 'Typography', 'Animation'
];

const VENUE_AMENITIES = [
  'Natural Lighting', 'Climate Control', 'Security System', 'Parking Available',
  'Catering Kitchen', 'Audio System', 'Wi-Fi', 'Accessible Entrance',
  'Storage Space', 'Loading Dock', 'Green Room', 'Bathroom Facilities'
];

const INVESTMENT_FOCUS_AREAS = [
  'Digital Art', 'Photography', 'Emerging Artists', 'NFTs', 'Traditional Art',
  'Sculpture', 'Video Art', 'Performance Art', 'Art Technology', 'Cultural Projects',
  'Art Education', 'Community Art', 'International Art', 'Contemporary Art'
];

const LEGAL_SPECIALIZATIONS = [
  'Intellectual Property', 'Contract Law', 'Entertainment Law', 'Copyright',
  'Trademark', 'Arts Law', 'Media Law', 'Publishing Law', 'Gallery Law',
  'Artist Rights', 'Estate Planning', 'Business Formation', 'International Law'
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ 
  isDashboardDarkMode = false 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newFocus, setNewFocus] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newBarAdmission, setNewBarAdmission] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const governmentIdInputRef = useRef<HTMLInputElement>(null);
  const proofOfAddressInputRef = useRef<HTMLInputElement>(null);
  const businessRegistrationInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocuments, setUploadingDocuments] = useState({
    governmentId: false,
    proofOfAddress: false,
    businessRegistration: false
  });
  
  // KYC state
  const [kycData, setKycData] = useState({
    legal_name: '',
    date_of_birth: '',
    nationality: '',
    tax_id: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    government_id_url: '',
    proof_of_address_url: '',
    business_name: '',
    business_ein: '',
    business_type: '',
    business_registration_url: ''
  });

  const handleDocumentUpload = async (
    file: File,
    documentType: 'governmentId' | 'proofOfAddress' | 'businessRegistration'
  ) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, or PDF file');
      return;
    }

    try {
      setUploadingDocuments(prev => ({ ...prev, [documentType]: true }));
      toast.info(`Uploading ${documentType === 'governmentId' ? 'government ID' : documentType === 'proofOfAddress' ? 'proof of address' : 'business registration'}...`);
      
      const folder = documentType === 'governmentId' ? 'kyc/government-id' : 
                     documentType === 'proofOfAddress' ? 'kyc/proof-of-address' : 
                     'kyc/business-registration';
      const uploadedUrl = await uploadImageToS3(file, folder);
      
      if (documentType === 'governmentId') {
        setKycData(prev => ({ ...prev, government_id_url: uploadedUrl }));
      } else if (documentType === 'proofOfAddress') {
        setKycData(prev => ({ ...prev, proof_of_address_url: uploadedUrl }));
      } else {
        setKycData(prev => ({ ...prev, business_registration_url: uploadedUrl }));
      }
      
      toast.success('Document uploaded successfully!');
    } catch (error) {
      console.error(`Error uploading ${documentType}:`, error);
      toast.error('Failed to upload document');
    } finally {
      setUploadingDocuments(prev => ({ ...prev, [documentType]: false }));
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        // Get user ID from user or localStorage
        let userId = user.id;
        if (!userId && typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              userId = parsedUser?.id;
            } catch (e) {
              console.error('Error parsing stored user:', e);
            }
          }
        }
        
        if (!userId) {
          console.error('No user ID available');
          toast.error('Unable to load profile');
          setLoading(false);
          return;
        }
        
        // Fetch user profile from server API
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch both user data and user profile data
        const [userResponse, profileResponse] = await Promise.all([
          fetch(apiUrl(`users/${userId}`), { headers }),
          fetch(apiUrl(`user-profiles/user/${userId}`), { headers })
        ]);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User data received:', userData);
          
          let profileData: any = {
            location: '',
            website: '',
            phone: '',
            specialties: [],
            venue_capacity: 0,
            venue_amenities: [],
            investment_range_min: 0,
            investment_range_max: 0,
            investment_focus: [],
            legal_specialization: [],
            bar_admission: []
          };
          
          // If profile exists, use it
          if (profileResponse.ok) {
            const profileResponseData = await profileResponse.json();
            // Handle different response formats - could be wrapped in 'data' or direct object
            profileData = profileResponseData.data || profileResponseData || profileData;
            console.log('Profile data received:', profileData);
          }
          
          // Convert server data to profile format
          // Ensure arrays are properly handled (could be null from database)
          const safeArray = (arr: any) => Array.isArray(arr) ? arr : (arr ? [arr] : []);
          
          setProfileData({
            username: userData.username || userData.email?.split('@')[0] || '',
            full_name: userData.display_name || userData.username || '',
            bio: userData.bio || '',
            location: profileData.location || '',
            website: profileData.website || '',
            phone: profileData.phone || '',
            avatar_url: userData.avatar_url || '',
            profile_type: userData.role || 'Artist',
            specialties: safeArray(profileData.specialties),
            venue_capacity: profileData.venue_capacity || 0,
            venue_amenities: safeArray(profileData.venue_amenities),
            investment_range: { 
              min: profileData.investment_range_min || 0, 
              max: profileData.investment_range_max || 0 
            },
            investment_focus: safeArray(profileData.investment_focus),
            legal_specialization: safeArray(profileData.legal_specialization),
            bar_admission: safeArray(profileData.bar_admission)
          });
        } else if (userResponse.status === 404) {
          // User not found, create default profile from current user data
          console.log('User not found in database, creating default profile...');
          const storedUser = localStorage.getItem('user');
          let currentUser = user;
          
          if (!currentUser && storedUser) {
            try {
              currentUser = JSON.parse(storedUser);
            } catch (e) {
              console.error('Error parsing stored user:', e);
            }
          }
          
          if (currentUser) {
            setProfileData({
              username: currentUser.username || currentUser.email?.split('@')[0] || '',
              full_name: currentUser.display_name || currentUser.email?.split('@')[0] || '',
              bio: '',
              location: '',
              website: '',
              phone: '',
              avatar_url: '',
              profile_type: currentUser.role || 'Artist',
              specialties: [],
              venue_capacity: 0,
              venue_amenities: [],
              investment_range: { min: 0, max: 0 },
              investment_focus: [],
              legal_specialization: [],
              bar_admission: []
            });
          } else {
            toast.error('Unable to load profile data');
          }
        } else {
          console.error('Failed to fetch profile:', userResponse.status);
          toast.error('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    if (!profileData) return;
    
    setProfileData(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user || !profileData) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      
      // Get user ID
      let userId = user.id;
      if (!userId && typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?.id;
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }
      
      if (!userId) {
        toast.error('Unable to identify user');
        setSaving(false);
        return;
      }
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Update user basic info
      const userUpdateData = {
        username: profileData.username,
        display_name: profileData.full_name,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        role: profileData.profile_type
      };
      
      // Update user profile extended info
      const profileUpdateData = {
        location: profileData.location,
        website: profileData.website,
        phone: profileData.phone,
        specialties: profileData.specialties,
        venue_capacity: profileData.venue_capacity,
        venue_amenities: profileData.venue_amenities,
        investment_range_min: profileData.investment_range.min,
        investment_range_max: profileData.investment_range.max,
        investment_focus: profileData.investment_focus,
        legal_specialization: profileData.legal_specialization,
        bar_admission: profileData.bar_admission
      };
      
      // Update user first
      const userResponse = await fetch(apiUrl(`users/${userId}`), {
        method: 'PUT',
        headers,
        body: JSON.stringify(userUpdateData)
      });

      if (!userResponse.ok) {
        const error = await userResponse.json().catch(() => ({}));
        toast.error(error.message || 'Failed to update user information');
        setSaving(false);
        return;
      }

      // Check if profile exists, then update or create
      const checkProfileResponse = await fetch(apiUrl(`user-profiles/user/${userId}`), {
        method: 'GET',
        headers
      });

      let profileResponse;
      if (checkProfileResponse.ok) {
        // Profile exists, update it
        profileResponse = await fetch(apiUrl(`user-profiles/user/${userId}`), {
          method: 'PUT',
          headers,
          body: JSON.stringify(profileUpdateData)
        });
      } else {
        // Profile doesn't exist, create it
        profileResponse = await fetch(apiUrl(`user-profiles/user/${userId}`), {
          method: 'POST',
          headers,
          body: JSON.stringify(profileUpdateData)
        });
      }

      if (profileResponse.ok) {
        toast.success('Profile updated successfully!');
        // Refresh the profile data
        window.location.reload();
      } else {
        const error = await profileResponse.json().catch(() => ({}));
        toast.error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleKYCSubmit = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('access_token');
      
      // Get user ID
      let userId = user.id;
      if (!userId && typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser?.id;
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }
      
      if (!userId) {
        toast.error('Unable to identify user');
        return;
      }
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        apiUrl(`user-profiles/user/${userId}/kyc`),
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ kycData })
        }
      );

      if (response.ok) {
        toast.success('KYC information submitted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit KYC information');
      }
    } catch (error) {
      console.error('Error submitting KYC:', error);
      toast.error('Failed to submit KYC information');
    }
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim() || !profileData) return;
    
    if (!profileData.specialties.includes(newSpecialty)) {
      handleInputChange('specialties', [...profileData.specialties, newSpecialty]);
    }
    setNewSpecialty('');
  };

  const removeSpecialty = (specialty: string) => {
    if (!profileData) return;
    handleInputChange('specialties', profileData.specialties.filter(s => s !== specialty));
  };

  const addAmenity = () => {
    if (!newAmenity.trim() || !profileData) return;
    
    if (!profileData.venue_amenities.includes(newAmenity)) {
      handleInputChange('venue_amenities', [...profileData.venue_amenities, newAmenity]);
    }
    setNewAmenity('');
  };

  const removeAmenity = (amenity: string) => {
    if (!profileData) return;
    handleInputChange('venue_amenities', profileData.venue_amenities.filter(a => a !== amenity));
  };

  const addFocus = () => {
    if (!newFocus.trim() || !profileData) return;
    
    if (!profileData.investment_focus.includes(newFocus)) {
      handleInputChange('investment_focus', [...profileData.investment_focus, newFocus]);
    }
    setNewFocus('');
  };

  const removeFocus = (focus: string) => {
    if (!profileData) return;
    handleInputChange('investment_focus', profileData.investment_focus.filter(f => f !== focus));
  };

  const addSpecialization = () => {
    if (!newSpecialization.trim() || !profileData) return;
    
    if (!profileData.legal_specialization.includes(newSpecialization)) {
      handleInputChange('legal_specialization', [...profileData.legal_specialization, newSpecialization]);
    }
    setNewSpecialization('');
  };

  const removeSpecialization = (specialization: string) => {
    if (!profileData) return;
    handleInputChange('legal_specialization', profileData.legal_specialization.filter(s => s !== specialization));
  };

  const addBarAdmission = () => {
    if (!newBarAdmission.trim() || !profileData) return;
    
    if (!profileData.bar_admission.includes(newBarAdmission)) {
      handleInputChange('bar_admission', [...profileData.bar_admission, newBarAdmission]);
    }
    setNewBarAdmission('');
  };

  const removeBarAdmission = (bar: string) => {
    if (!profileData) return;
    handleInputChange('bar_admission', profileData.bar_admission.filter(b => b !== bar));
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4 ${
            isDashboardDarkMode ? 'border-white' : 'border-gray-900'
          }`}></div>
          <p className={isDashboardDarkMode ? 'text-white' : 'text-gray-900'}>
            Loading profile settings...
          </p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <h2 className={`text-2xl font-title mb-4 ${
            isDashboardDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Profile Not Found</h2>
          <p className={`mb-4 ${
            isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Unable to load your profile data.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-title ${
              isDashboardDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Profile Settings</h1>
            <p className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Customize your profile to showcase your work and connect with others
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact & Social</TabsTrigger>
            <TabsTrigger value="profile-type">Profile Type</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
                      <AvatarFallback className="text-xl">
                        {profileData.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="avatar_upload">Profile Picture</Label>
                    <input
                      ref={avatarFileInputRef}
                      id="avatar_upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error('Image size must be less than 10MB');
                            return;
                          }
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            toast.error('Please select a valid image file');
                            return;
                          }
                          try {
                            setUploadingAvatar(true);
                            toast.info('Uploading profile picture...');
                            const uploadedUrl = await uploadImageToS3(file, 'avatars');
                            handleInputChange('avatar_url', uploadedUrl);
                            toast.success('Profile picture uploaded successfully!');
                          } catch (error) {
                            console.error('Error uploading avatar:', error);
                            toast.error('Failed to upload profile picture');
                          } finally {
                            setUploadingAvatar(false);
                          }
                        }
                      }}
                    />
                    <div className="mt-2">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => avatarFileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="flex items-center gap-2"
                      >
                        {uploadingAvatar ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {profileData.avatar_url ? 'Change Picture' : 'Upload Picture'}
                          </>
                        )}
                      </Button>
                      {profileData.avatar_url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInputChange('avatar_url', '')}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click the button above to select an image from your device (PNG, JPG up to 10MB)
                    </p>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={profileData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="your_username"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be your unique identifier on Artistrial
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell others about yourself, your work, and what makes you unique..."
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State/Country"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact & Social Tab */}
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title">Contact & Social Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your phone number will only be visible to users you interact with
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Type Specific Tab */}
          <TabsContent value="profile-type" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title">Profile Type Settings</CardTitle>
                <p className="text-sm text-gray-600">
                  Your profile type helps others understand your primary role. You can still use all features regardless of your type.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Type Selector */}
                <div>
                  <Label htmlFor="profile_type">Profile Type</Label>
                  <Select 
                    value={profileData.profile_type} 
                    onValueChange={(value) => handleInputChange('profile_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Artist">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          <span>Artist - Create and sell artwork</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Venue">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span>Venue - Rent out studio/gallery space</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Investor">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Investor - Fund creative projects</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Legal">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          <span>Legal - Provide legal services</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Artist Specific Fields */}
                {profileData.profile_type === 'Artist' && (
                  <div>
                    <Label>Artistic Specialties</Label>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Select value={newSpecialty} onValueChange={setNewSpecialty}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {ARTIST_SPECIALTIES.filter(s => !profileData.specialties.includes(s)).map(specialty => (
                              <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={addSpecialty} variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profileData.specialties.map(specialty => (
                          <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                            {specialty}
                            <X 
                              className="w-3 h-3 cursor-pointer" 
                              onClick={() => removeSpecialty(specialty)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Venue Specific Fields */}
                {profileData.profile_type === 'Venue' && (
                  <>
                    <div>
                      <Label htmlFor="venue_capacity">Venue Capacity (people)</Label>
                      <Input
                        id="venue_capacity"
                        type="number"
                        value={profileData.venue_capacity}
                        onChange={(e) => handleInputChange('venue_capacity', parseInt(e.target.value) || 0)}
                        placeholder="50"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label>Available Amenities</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Select value={newAmenity} onValueChange={setNewAmenity}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select an amenity" />
                            </SelectTrigger>
                            <SelectContent>
                              {VENUE_AMENITIES.filter(a => !profileData.venue_amenities.includes(a)).map(amenity => (
                                <SelectItem key={amenity} value={amenity}>{amenity}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={addAmenity} variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.venue_amenities.map(amenity => (
                            <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                              {amenity}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => removeAmenity(amenity)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Investor Specific Fields */}
                {profileData.profile_type === 'Investor' && (
                  <>
                    <div>
                      <Label>Investment Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="investment_min">Minimum ($)</Label>
                          <Input
                            id="investment_min"
                            type="number"
                            value={profileData.investment_range.min}
                            onChange={(e) => handleInputChange('investment_range', {
                              ...profileData.investment_range,
                              min: parseInt(e.target.value) || 0
                            })}
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="investment_max">Maximum ($)</Label>
                          <Input
                            id="investment_max"
                            type="number"
                            value={profileData.investment_range.max}
                            onChange={(e) => handleInputChange('investment_range', {
                              ...profileData.investment_range,
                              max: parseInt(e.target.value) || 0
                            })}
                            placeholder="100000"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Investment Focus Areas</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Select value={newFocus} onValueChange={setNewFocus}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select a focus area" />
                            </SelectTrigger>
                            <SelectContent>
                              {INVESTMENT_FOCUS_AREAS.filter(f => !profileData.investment_focus.includes(f)).map(focus => (
                                <SelectItem key={focus} value={focus}>{focus}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={addFocus} variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.investment_focus.map(focus => (
                            <Badge key={focus} variant="secondary" className="flex items-center gap-1">
                              {focus}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => removeFocus(focus)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Legal Specific Fields */}
                {profileData.profile_type === 'Legal' && (
                  <>
                    <div>
                      <Label>Legal Specializations</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Select value={newSpecialization} onValueChange={setNewSpecialization}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select a specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              {LEGAL_SPECIALIZATIONS.filter(s => !profileData.legal_specialization.includes(s)).map(spec => (
                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={addSpecialization} variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.legal_specialization.map(spec => (
                            <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                              {spec}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => removeSpecialization(spec)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Bar Admissions</Label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Select value={newBarAdmission} onValueChange={setNewBarAdmission}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                            <SelectContent>
                              {US_STATES.filter(state => !profileData.bar_admission.includes(state)).map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={addBarAdmission} variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.bar_admission.map(bar => (
                            <Badge key={bar} variant="outline" className="flex items-center gap-1">
                              {bar}
                              <X 
                                className="w-3 h-3 cursor-pointer" 
                                onClick={() => removeBarAdmission(bar)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc" className="mt-6">
            <div className="space-y-6">
              {/* KYC Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-title flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Know Your Customer (KYC) Verification
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Complete your identity verification to unlock premium features, higher transaction limits, and enhanced security.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-800">Verification Pending</p>
                        <p className="text-sm text-yellow-600">Complete the steps below to verify your identity</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                      In Progress
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-title flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="legal_name">Legal Full Name *</Label>
                      <Input
                        id="legal_name"
                        placeholder="As shown on government ID"
                        value={kycData.legal_name}
                        onChange={(e) => setKycData({...kycData, legal_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="date_of_birth"
                          type="date"
                          className="pl-10"
                          value={kycData.date_of_birth}
                          onChange={(e) => setKycData({...kycData, date_of_birth: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tax_id">Tax ID / SSN</Label>
                      <Input
                        id="tax_id"
                        placeholder="XXX-XX-XXXX"
                        type="password"
                        value={kycData.tax_id}
                        onChange={(e) => setKycData({...kycData, tax_id: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Required for tax reporting purposes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-title flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address Information
                    <AlertCircle className="w-4 h-4 text-yellow-500 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street_address">Street Address *</Label>
                    <Input
                      id="street_address"
                      placeholder="123 Main Street"
                      value={kycData.street_address}
                      onChange={(e) => setKycData({...kycData, street_address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={kycData.city}
                        onChange={(e) => setKycData({...kycData, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={kycData.state}
                        onChange={(e) => setKycData({...kycData, state: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code *</Label>
                      <Input
                        id="postal_code"
                        placeholder="10001"
                        value={kycData.postal_code}
                        onChange={(e) => setKycData({...kycData, postal_code: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-title flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Identity Documents
                    <AlertCircle className="w-4 h-4 text-gray-400 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Government ID */}
                  <div>
                    <Label>Government-Issued Photo ID *</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload a clear photo of your driver's license, passport, or national ID card
                    </p>
                    <input
                      ref={governmentIdInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, 'governmentId');
                        }
                      }}
                    />
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        uploadingDocuments.governmentId 
                          ? 'border-[#FF8D28] bg-[#FF8D28]/5' 
                          : kycData.government_id_url
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-[#FF8D28]'
                      }`}
                      onClick={() => !uploadingDocuments.governmentId && governmentIdInputRef.current?.click()}
                    >
                      {uploadingDocuments.governmentId ? (
                        <>
                          <div className="w-8 h-8 border-2 border-[#FF8D28] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : kycData.government_id_url ? (
                        <>
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-green-600">Document uploaded</p>
                          <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                        </>
                      ) : (
                        <>
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Proof of Address */}
                  <div>
                    <Label>Proof of Address *</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload a recent utility bill, bank statement, or government correspondence (not older than 3 months)
                    </p>
                    <input
                      ref={proofOfAddressInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, 'proofOfAddress');
                        }
                      }}
                    />
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        uploadingDocuments.proofOfAddress 
                          ? 'border-[#FF8D28] bg-[#FF8D28]/5' 
                          : kycData.proof_of_address_url
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-[#FF8D28]'
                      }`}
                      onClick={() => !uploadingDocuments.proofOfAddress && proofOfAddressInputRef.current?.click()}
                    >
                      {uploadingDocuments.proofOfAddress ? (
                        <>
                          <div className="w-8 h-8 border-2 border-[#FF8D28] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : kycData.proof_of_address_url ? (
                        <>
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-green-600">Document uploaded</p>
                          <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Information (for business accounts) */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-title flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Business Information
                    <Badge variant="outline" className="ml-auto">Optional</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Required only if you're operating as a business entity
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business_name">Business Legal Name</Label>
                      <Input
                        id="business_name"
                        placeholder="Artistrial LLC"
                      />
                    </div>
                    <div>
                      <Label htmlFor="business_ein">EIN / Business Tax ID</Label>
                      <Input
                        id="business_ein"
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="business_type">Business Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llc">LLC</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Business Document Upload */}
                  <div>
                    <Label>Business Registration Documents</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload your certificate of incorporation, business license, or articles of organization
                    </p>
                    <input
                      ref={businessRegistrationInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, 'businessRegistration');
                        }
                      }}
                    />
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        uploadingDocuments.businessRegistration 
                          ? 'border-[#FF8D28] bg-[#FF8D28]/5' 
                          : kycData.business_registration_url
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-[#FF8D28]'
                      }`}
                      onClick={() => !uploadingDocuments.businessRegistration && businessRegistrationInputRef.current?.click()}
                    >
                      {uploadingDocuments.businessRegistration ? (
                        <>
                          <div className="w-8 h-8 border-2 border-[#FF8D28] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </>
                      ) : kycData.business_registration_url ? (
                        <>
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-green-600">Document uploaded</p>
                          <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                        </>
                      ) : (
                        <>
                          <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-title">Submit for Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">Review Process</p>
                        <p className="text-blue-700">
                          Your documents will be reviewed within 1-3 business days. 
                          You'll receive an email notification once verification is complete.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        disabled
                      >
                        Save Draft
                      </Button>
                      <Button 
                        className="flex-1 bg-[#FF8D28] hover:bg-[#FF8D28]/90"
                        onClick={handleKYCSubmit}
                      >
                        Submit for Verification
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      By submitting, you agree to our verification process and confirm that all information provided is accurate.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-title">Account Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Additional preferences coming soon!</p>
                  <p className="text-sm">Notification settings, privacy controls, and more.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

