import React, { useState } from "react";
import {
  Package,
  Target,
  Upload,
  Plus,
  Minus,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Tag,
  FileText,
  Users,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  projectId,
  publicAnonKey,
} from '@/utils/supabase/info';

interface ProductAndServicesListingFormProps {
  isDashboardDarkMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductAndServicesListingForm({
  isDashboardDarkMode = false,
  onSuccess,
  onCancel,
}: ProductAndServicesListingFormProps) {
  const { user } = useAuth();
  const [listingType, setListingType] = useState<"product" | "service" | "">("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Common form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    location: "",
    tags: [""],
    images: [],
    delivery_time: "",
    availability: "available",
    
    // Product specific
    product_condition: "new",
    shipping_included: true,
    quantity_available: "1",
    dimensions: "",
    weight: "",
    material: "",
    warranty_period: "",
    
    // Service specific
    service_type: "one-time",
    duration: "",
    experience_level: "intermediate",
    languages: [""],
    certifications: [""],
    portfolio_links: [""],
    consultation_available: false,
    remote_available: false,
    on_site_available: false,
  });

  const productCategories = [
    { value: "artwork", label: "Artwork & Prints" },
    { value: "photography", label: "Photography" },
    { value: "digital", label: "Digital Products" },
    { value: "crafts", label: "Handmade Crafts" },
    { value: "supplies", label: "Art Supplies" },
    { value: "equipment", label: "Equipment" },
    { value: "books", label: "Books & Guides" },
    { value: "apparel", label: "Art Apparel" },
    { value: "home", label: "Home Decor" },
    { value: "other", label: "Other" },
  ];

  const serviceCategories = [
    { value: "design", label: "Design Services" },
    { value: "photography", label: "Photography Services" },
    { value: "video", label: "Video Production" },
    { value: "writing", label: "Writing & Content" },
    { value: "marketing", label: "Marketing & Promotion" },
    { value: "consulting", label: "Creative Consulting" },
    { value: "education", label: "Education & Training" },
    { value: "technical", label: "Technical Services" },
    { value: "event", label: "Event Services" },
    { value: "other", label: "Other Services" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const updatedArray = [...((formData as any)[field] as string[])];
    updatedArray[index] = value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayItem = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...((formData as any)[field] as string[]), ""],
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const updatedArray = ((formData as any)[field] as string[]).filter(
      (_, i) => i !== index,
    );
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !listingType) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/listings/product-services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            listing_type: listingType,
            user_id: user.id,
          }),
        },
      );

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          // Reset form
          setFormData({
            title: "",
            description: "",
            price: "",
            category: "",
            subcategory: "",
            location: "",
            tags: [""],
            images: [],
            delivery_time: "",
            availability: "available",
            product_condition: "new",
            shipping_included: true,
            quantity_available: "1",
            dimensions: "",
            weight: "",
            material: "",
            warranty_period: "",
            service_type: "one-time",
            duration: "",
            experience_level: "intermediate",
            languages: [""],
            certifications: [""],
            portfolio_links: [""],
            consultation_available: false,
            remote_available: false,
            on_site_available: false,
          });
          setListingType("");
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to create listing"}`);
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
        <Card className={`w-full max-w-md ${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className={`font-title text-xl ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                {listingType === "product" ? "Product" : "Service"} Listed Successfully!
              </h3>
              <p className={isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}>
                Your {listingType} has been submitted and is now live on the marketplace.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${isDashboardDarkMode ? "bg-[#171717]" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className={`font-title text-2xl lg:text-3xl mb-2 ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
            List Product or Service
          </h1>
          <p className={`${isDashboardDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Share your products or services with the Artistrial community
          </p>
        </div>

        {/* Listing Type Selection */}
        {!listingType && (
          <Card className={`mb-6 ${isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                What would you like to list?
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className={`h-auto p-6 flex flex-col items-center gap-4 ${
                  isDashboardDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setListingType("product")}
              >
                <Package className="w-8 h-8 text-indigo-600" />
                <div className="text-center">
                  <h3 className={`font-title text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    Product
                  </h3>
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Sell physical or digital products
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className={`h-auto p-6 flex flex-col items-center gap-4 ${
                  isDashboardDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setListingType("service")}
              >
                <Target className="w-8 h-8 text-pink-600" />
                <div className="text-center">
                  <h3 className={`font-title text-lg ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    Service
                  </h3>
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Offer professional services
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        {listingType && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Type Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {listingType === "product" ? <Package className="w-4 h-4 mr-1" /> : <Target className="w-4 h-4 mr-1" />}
                {listingType === "product" ? "Product Listing" : "Service Listing"}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setListingType("")}
                className={isDashboardDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}
              >
                Change Type
              </Button>
            </div>

            {/* Basic Information */}
            <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder={`Enter your ${listingType} title`}
                    required
                    className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder={`Describe your ${listingType} in detail...`}
                    rows={4}
                    required
                    className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {(listingType === "product" ? productCategories : serviceCategories).map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="0.00"
                        className={`pl-10 ${isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="City, State / Remote"
                      className={`pl-10 ${isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product-specific fields */}
            {listingType === "product" && (
              <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader>
                  <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={formData.product_condition} onValueChange={(value) => handleInputChange("product_condition", value)}>
                        <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="used-good">Used - Good</SelectItem>
                          <SelectItem value="used-fair">Used - Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity Available</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity_available}
                        onChange={(e) => handleInputChange("quantity_available", e.target.value)}
                        className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange("dimensions", e.target.value)}
                        placeholder="L x W x H (inches)"
                        className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="Weight (lbs)"
                        className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="material">Material/Medium</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => handleInputChange("material", e.target.value)}
                      placeholder="e.g., Canvas, Acrylic, Digital Print"
                      className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="shipping"
                      checked={formData.shipping_included}
                      onCheckedChange={(checked) => handleInputChange("shipping_included", checked)}
                    />
                    <Label htmlFor="shipping">Shipping included in price</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service-specific fields */}
            {listingType === "service" && (
              <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
                <CardHeader>
                  <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service_type">Service Type</Label>
                      <Select value={formData.service_type} onValueChange={(value) => handleInputChange("service_type", value)}>
                        <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-time">One-time Project</SelectItem>
                          <SelectItem value="ongoing">Ongoing Service</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="package">Service Package</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select value={formData.experience_level} onValueChange={(value) => handleInputChange("experience_level", value)}>
                        <SelectTrigger className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                          <SelectItem value="expert">Expert (6-10 years)</SelectItem>
                          <SelectItem value="master">Master (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Typical Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="e.g., 2-3 weeks, 1 day, 2 hours"
                      className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Service Delivery Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remote"
                          checked={formData.remote_available}
                          onCheckedChange={(checked) => handleInputChange("remote_available", checked)}
                        />
                        <Label htmlFor="remote">Remote/Online</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="onsite"
                          checked={formData.on_site_available}
                          onCheckedChange={(checked) => handleInputChange("on_site_available", checked)}
                        />
                        <Label htmlFor="onsite">On-site</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="consultation"
                          checked={formData.consultation_available}
                          onCheckedChange={(checked) => handleInputChange("consultation_available", checked)}
                        />
                        <Label htmlFor="consultation">Free consultation available</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Details */}
            <Card className={isDashboardDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <CardHeader>
                <CardTitle className={`font-title ${isDashboardDarkMode ? "text-white" : "text-gray-900"}`}>
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tags</Label>
                  <p className={`text-sm ${isDashboardDarkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>
                    Add relevant tags to help people find your {listingType}
                  </p>
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                        placeholder="Enter a tag"
                        className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem("tags", index)}
                        disabled={formData.tags.length === 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("tags")}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                  </Button>
                </div>

                <div>
                  <Label htmlFor="delivery_time">
                    {listingType === "product" ? "Processing Time" : "Delivery Timeline"}
                  </Label>
                  <Input
                    id="delivery_time"
                    value={formData.delivery_time}
                    onChange={(e) => handleInputChange("delivery_time", e.target.value)}
                    placeholder={listingType === "product" ? "e.g., 3-5 business days" : "e.g., 1-2 weeks"}
                    className={isDashboardDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              <Button type="submit" size="lg" onClick={onSuccess}>
                <Package className="mr-2 h-4 w-4" />
                List Product/Service
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

