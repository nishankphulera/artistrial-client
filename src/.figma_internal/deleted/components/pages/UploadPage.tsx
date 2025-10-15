// This file has been removed as noted in temp_removed_uploadpage.txt
// The upload artwork functionality has been completely removed from the application.

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'audio';
  progress: number;
  uploaded: boolean;
}

const CATEGORIES = [
  'Digital Art', 'Photography', 'Painting', 'Sculpture', 'Mixed Media',
  'Street Art', 'Abstract', 'Portrait', 'Landscape', 'Still Life',
  'Conceptual', 'Installation', 'Performance', 'Video Art', 'Audio Art'
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' }
];

export const UploadPage: React.FC = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    customTag: '',
    isForSale: false,
    price: '',
    currency: 'USD',
    isPublic: true,
    allowDownloads: false
  });

  React.useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
  }, [user, navigate]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    selectedFiles.forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' :
                      file.type.startsWith('video/') ? 'video' :
                      file.type.startsWith('audio/') ? 'audio' : null;
      
      if (!fileType) {
        toast.error(`Unsupported file type: ${file.name}`);
        return;
      }

      const preview = fileType === 'image' || fileType === 'video' 
        ? URL.createObjectURL(file) 
        : '';

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        type: fileType,
        progress: 0,
        uploaded: false
      };

      setFiles(prev => [...prev, uploadedFile]);
    });
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const addTag = () => {
    const tag = formData.customTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        customTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be signed in to upload artworks');
      return;
    }

    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please provide a title for your artwork');
      return;
    }

    setUploading(true);

    try {
      // Simulate file upload progress
      const uploadPromises = files.map(async (file, index) => {
        return new Promise<string>((resolve) => {
          const interval = setInterval(() => {
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: Math.min(f.progress + 10, 100) }
                : f
            ));
          }, 200);

          setTimeout(() => {
            clearInterval(interval);
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: 100, uploaded: true }
                : f
            ));
            resolve(`https://example.com/uploaded/${file.file.name}`);
          }, 2000);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Save artwork to database
      const artworkData = {
        title: formData.title,
        description: formData.description,
        media_type: files.length === 1 ? files[0].type : 'mixed',
        image_url: uploadedUrls[0], // Use first uploaded file as main image
        file_url: uploadedUrls[0], // For digital delivery
        tags: formData.tags,
        category: formData.category,
        is_for_sale: formData.isForSale,
        price: formData.isForSale ? parseFloat(formData.price) : null,
        currency: formData.currency,
        is_public: formData.isPublic,
        allow_downloads: formData.allowDownloads,
        artist_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/artworks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(artworkData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save artwork');
      }

      const savedArtwork = await response.json();
      console.log('Artwork saved:', savedArtwork);
      
      toast.success('Artwork uploaded successfully! Redirecting to marketplace...');
      
      // Redirect to marketplace after a short delay
      setTimeout(() => {
        router.push('/marketplace');
      }, 1500);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload artwork. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />;
      case 'video':
        return <Video className="w-8 h-8 text-red-500" />;
      case 'audio':
        return <Music className="w-8 h-8 text-green-500" />;
      default:
        return <Upload className="w-8 h-8 text-gray-500" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Artwork</h1>
          <p className="text-gray-600">Share your creative work with the Artistrial community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Support for images, videos, and audio files (max 50MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload">
                  <Button type="button" className="cursor-pointer" disabled={uploading}>
                    Select Files
                  </Button>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {file.type === 'image' && file.preview ? (
                          <img 
                            src={file.preview} 
                            alt={file.file.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(file.file.size / (1024 * 1024)).toFixed(1)} MB • {file.type}
                        </p>
                        {file.progress > 0 && (
                          <Progress value={file.progress} className="mt-2" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Artwork Details */}
          <Card>
            <CardHeader>
              <CardTitle>Artwork Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your artwork a compelling title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your artwork, inspiration, or technique..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={formData.customTag}
                    onChange={(e) => setFormData(prev => ({ ...prev, customTag: e.target.value }))}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Tag className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isForSale"
                  checked={formData.isForSale}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isForSale: checked }))}
                />
                <Label htmlFor="isForSale">This artwork is for sale</Label>
              </div>

              {formData.isForSale && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      required={formData.isForSale}
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(currency => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="isPublic">Make this artwork publicly visible</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowDownloads"
                  checked={formData.allowDownloads}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowDownloads: checked }))}
                />
                <Label htmlFor="allowDownloads">Allow downloads (for free artworks)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || files.length === 0 || !formData.title}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : 'Publish Artwork'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

