import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Package, Building, TrendingUp, Ticket, Gavel, Plus, ShoppingBag, GraduationCap } from 'lucide-react';
import { TalentListingForm } from './TalentListingForm';
import { AssetListingForm } from './AssetListingForm';
import { StudioListingForm } from './StudioListingForm';
import { InvestorListingForm } from './InvestorListingForm';
import { TicketListingForm } from './TicketListingForm';
import { LegalListingForm } from './LegalListingForm';
import { ProductServicesListingForm } from './ProductServicesListingForm';
import { EducationListingForm } from './EducationListingForm';

type ListingType = 'talent' | 'asset' | 'studio' | 'investor' | 'ticket' | 'legal' | 'product_service' | 'education' | null;

interface ListingOption {
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

// Shared listing options configuration
const listingOptions: ListingOption[] = [
  {
    type: 'talent',
    title: 'Talent Services',
    description: 'Offer your skills and expertise to clients',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  {
    type: 'asset',
    title: 'Digital Assets',
    description: 'Sell digital artwork, designs, and creative assets',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  {
    type: 'studio',
    title: 'Studio Space',
    description: 'Rent out your creative space or studio',
    icon: Building,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  },
  {
    type: 'investor',
    title: 'Investment',
    description: 'Seek funding or offer investment opportunities',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100'
  },
  {
    type: 'ticket',
    title: 'Event Tickets',
    description: 'Create and sell tickets for your events',
    icon: Ticket,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100'
  },
  {
    type: 'legal',
    title: 'Legal Services',
    description: 'Offer legal consultation and services',
    icon: Gavel,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100'
  },
  {
    type: 'product_service',
    title: 'Products & Services',
    description: 'Sell digital products, physical items, or creative services',
    icon: ShoppingBag,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 hover:bg-teal-100'
  },
  {
    type: 'education',
    title: 'Education & Learning',
    description: 'Create courses, workshops, and educational content',
    icon: GraduationCap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100'
  }
];

// Dropdown component that navigates directly to specific listing forms
export const ListingFormsManager: React.FC = () => {
  const router = useRouter();

  const handleListingTypeSelect = (value: string) => {
    if (value) {
      router.push(`/create-listing?type=${value}`);
    }
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleListingTypeSelect}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <SelectValue placeholder="Create New Listing" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {listingOptions.map((option) => (
            <SelectItem key={option.type} value={option.type}>
              <div className="flex items-center gap-3 py-1">
                <div className={`p-1.5 rounded ${option.bgColor.replace('hover:', '')}`}>
                  <option.icon className={`w-4 h-4 ${option.color}`} />
                </div>
                <div>
                  <div className="font-medium text-sm">{option.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-48">{option.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Main create listing page component that handles form selection and rendering
interface CreateListingPageProps {
  isDashboardDarkMode?: boolean;
}

export const CreateListingPage: React.FC<CreateListingPageProps> = ({ isDashboardDarkMode = false }) => {
  const [selectedType, setSelectedType] = useState<ListingType>(null);
  const router = useRouter();
  
  // Check URL parameters for direct form access
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type') as ListingType;
    if (typeParam && ['talent', 'asset', 'studio', 'investor', 'ticket', 'legal', 'product_service', 'education'].includes(typeParam)) {
      setSelectedType(typeParam);
    }
  }, []);

  const handleListingTypeSelect = (value: string) => {
    const type = value as ListingType;
    setSelectedType(type);
    // Update URL without causing a full page refresh
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('type', value);
    window.history.pushState({}, '', newUrl.toString());
  };

  const handleFormClose = () => {
    // Navigate back to dashboard or previous page
    router.push('/dashboard');
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'talent':
        return <TalentListingForm onClose={handleFormClose} />;
      case 'asset':
        return <AssetListingForm onClose={handleFormClose} isDashboardDarkMode={isDashboardDarkMode} />;
      case 'studio':
        return <StudioListingForm onClose={handleFormClose} isDashboardDarkMode={isDashboardDarkMode} />;
      case 'investor':
        return <InvestorListingForm onClose={handleFormClose} />;
      case 'ticket':
        return <TicketListingForm onClose={handleFormClose} />;
      case 'legal':
        return <LegalListingForm onClose={handleFormClose} />;
      case 'product_service':
        return <ProductServicesListingForm onClose={handleFormClose} />;
      case 'education':
        return <EducationListingForm onClose={handleFormClose} />;
      default:
        return null;
    }
  };

  const getSelectedOption = () => {
    return listingOptions.find(option => option.type === selectedType);
  };

  if (selectedType) {
    const selectedOption = getSelectedOption();
    return (
      <div className={`h-full w-full ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} shadow-sm border`}>
                {selectedOption?.icon && <selectedOption.icon className={`w-6 h-6 ${selectedOption.color}`} />}
              </div>
              <div>
                <h1 className={`font-title text-3xl ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>Create {selectedOption?.title} Listing</h1>
                <p className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>Fill out the form below to create your {selectedOption?.title?.toLowerCase()} listing.</p>
              </div>
            </div>
          </div>
          
          {/* Form rendered directly on the page */}
          <div className={`${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"} rounded-lg shadow-sm ${isDashboardDarkMode ? "border" : ""}`}>
            {renderForm()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`font-title text-3xl mb-4 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>Create New Listing</h1>
          <p className={`text-lg ${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"} mb-8`}>
            Choose what you'd like to create and start building your presence on Artistrial
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <Select onValueChange={handleListingTypeSelect} value={selectedType || ""}>
            <SelectTrigger className={`w-full h-12 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}`}>
              <div className="flex items-center gap-2">
                <Plus className={`w-5 h-5 ${isDashboardDarkMode ? "text-gray-300" : ""}`} />
                <SelectValue placeholder="Select listing type..." />
              </div>
            </SelectTrigger>
            <SelectContent className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              {listingOptions.map((option) => (
                <SelectItem 
                  key={option.type} 
                  value={option.type}
                  className={isDashboardDarkMode ? "text-white hover:bg-gray-700 focus:bg-gray-700" : ""}
                >
                  <div className="flex items-center gap-3 py-2">
                    <div className={`p-2 rounded ${isDashboardDarkMode ? "bg-gray-700" : option.bgColor.replace('hover:', '')}`}>
                      <option.icon className={`w-5 h-5 ${option.color}`} />
                    </div>
                    <div>
                      <div className="font-medium">{option.title}</div>
                      <div className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>{option.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listingOptions.map((option) => (
            <Card 
              key={option.type} 
              className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
                isDashboardDarkMode 
                  ? "bg-gray-800 border-gray-700 hover:border-[#FF8D28] hover:bg-gray-750" 
                  : `hover:border-gray-300 ${option.bgColor}`
              }`}
              onClick={() => handleListingTypeSelect(option.type)}
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isDashboardDarkMode ? "bg-gray-700" : "bg-white"} mb-6 shadow-sm`}>
                  <option.icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <h3 className={`font-title text-xl ${isDashboardDarkMode ? "text-white" : "text-gray-900"} mb-3`}>{option.title}</h3>
                <p className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

