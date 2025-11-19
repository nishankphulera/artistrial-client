'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  ArrowLeft,
  Camera,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/AuthProvider';
import { apiUrl } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { uploadImageToS3 } from '@/utils/s3Upload';

const gigFormInitialState = {
  title: '',
  description: '',
  gigType: 'freelance',
  category: '',
  experienceLevel: '',
  budgetMin: '',
  budgetMax: '',
  budgetCurrency: 'USD',
  rateType: '',
  location: '',
  isRemote: false,
  applicationDeadline: '',
  contactEmail: '',
  applicationLink: '',
  skills: '',
  bannerImage: '',
};

type GigFormState = typeof gigFormInitialState;

interface GigRoleForm {
  id: string;
  name: string;
  requiredSlots: number;
  description: string;
}

const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export default function CreateCommunityGigPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [gigForm, setGigForm] = useState<GigFormState>(() => ({ ...gigFormInitialState }));
  const [gigRoles, setGigRoles] = useState<GigRoleForm[]>([]);
  const [roleNameInput, setRoleNameInput] = useState('');
  const [roleSlotsInput, setRoleSlotsInput] = useState('1');
  const [roleDescriptionDrafts, setRoleDescriptionDrafts] = useState<Record<string, string>>({});
  const [isCreatingGig, setIsCreatingGig] = useState(false);

  const [gigSelectedImage, setGigSelectedImage] = useState<File | null>(null);
  const [gigImagePreview, setGigImagePreview] = useState<string | null>(null);
  const [gigUploadingImage, setGigUploadingImage] = useState(false);
  const [showGigImageEditor, setShowGigImageEditor] = useState(false);
  const [gigCrop, setGigCrop] = useState<Crop>();
  const [gigCompletedCrop, setGigCompletedCrop] = useState<PixelCrop>();
  const gigImgRef = useRef<HTMLImageElement>(null);
  const gigAspectRatio = 16 / 9;

  const gigTypes = useMemo(
    () => [
      { value: 'freelance', label: 'Freelance / Contract' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'full-time', label: 'Full-time' },
      { value: 'collaboration', label: 'Collaboration' },
    ],
    []
  );

  const experienceLevels = useMemo(
    () => [
      { value: 'junior', label: 'Junior' },
      { value: 'mid', label: 'Mid-level' },
      { value: 'senior', label: 'Senior' },
      { value: 'expert', label: 'Expert' },
    ],
    []
  );

  const rateTypes = useMemo(
    () => [
      { value: 'per project', label: 'Per project' },
      { value: 'per hour', label: 'Per hour' },
      { value: 'per day', label: 'Per day' },
      { value: 'royalty', label: 'Royalty / Revenue share' },
    ],
    []
  );

  const currencyOptions = useMemo(() => ['USD', 'EUR', 'GBP', 'INR'], []);

  const resetGigForm = useCallback(() => {
    setGigForm({ ...gigFormInitialState });
    setGigRoles([]);
    setRoleNameInput('');
    setRoleSlotsInput('1');
    setGigSelectedImage(null);
    setShowGigImageEditor(false);
    setGigUploadingImage(false);
    setGigCrop(undefined);
    setGigCompletedCrop(undefined);
    setGigImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, []);

  const handleGigFieldChange = useCallback(
    (field: keyof GigFormState, value: GigFormState[keyof GigFormState]) => {
      setGigForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleAddGigRole = useCallback(() => {
    const trimmedName = roleNameInput.trim();

    if (!trimmedName) {
      toast.error('Please enter a role or category name before adding.');
      return;
    }

    const parsedSlots = parseInt(roleSlotsInput, 10);
    const requiredSlots = Number.isFinite(parsedSlots) && parsedSlots >= 0 ? parsedSlots : 1;
    const id = generateId();

    setGigRoles((prev) => {
      const exists = prev.find((role) => role.name.toLowerCase() === trimmedName.toLowerCase());
      if (exists) {
        return prev.map((role) =>
          role.id === exists.id ? { ...role, requiredSlots } : role
        );
      }

      return [...prev, { id, name: trimmedName, requiredSlots, description: '' }];
    });

    setRoleDescriptionDrafts((prev) => ({ ...prev, [id]: '' }));

    setRoleNameInput('');
    setRoleSlotsInput('1');
  }, [roleNameInput, roleSlotsInput]);

  const handleRemoveGigRole = useCallback((roleId: string) => {
    setGigRoles((prev) => prev.filter((role) => role.id !== roleId));
    setRoleDescriptionDrafts((prev) => {
      if (!(roleId in prev)) return prev;
      const next = { ...prev };
      delete next[roleId];
      return next;
    });
  }, []);

  const handleUpdateGigRoleSlots = useCallback((roleId: string, nextSlots: number) => {
    if (!Number.isFinite(nextSlots) || nextSlots < 0) {
      return;
    }
    setGigRoles((prev) =>
      prev.map((role) =>
        role.id === roleId ? { ...role, requiredSlots: Math.floor(nextSlots) } : role
      )
    );
  }, []);

  const handleUpdateGigRoleDescription = useCallback((roleId: string, nextDescription: string) => {
    setGigRoles((prev) =>
      prev.map((role) =>
        role.id === roleId ? { ...role, description: nextDescription } : role
      )
    );
  }, []);

  const handleRoleSlotsInputChange = useCallback((value: string) => {
    if (/^\d*$/.test(value)) {
      setRoleSlotsInput(value);
    }
  }, []);

  const handleRoleDescriptionChange = useCallback((roleId: string, value: string) => {
    setRoleDescriptionDrafts((prev) => ({ ...prev, [roleId]: value }));
  }, []);

  const handleSaveGigRoleDescription = useCallback((roleId: string) => {
    const draft = (roleDescriptionDrafts[roleId] ?? '').trim();

    setGigRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) {
          return role;
        }
        return {
          ...role,
          description: draft,
        };
      })
    );

    setRoleDescriptionDrafts((prev) => ({
      ...prev,
      [roleId]: draft,
    }));

    toast.success('Role description saved');
  }, [roleDescriptionDrafts]);

  useEffect(() => {
    setRoleDescriptionDrafts((prev) => {
      let changed = false;
      const next: Record<string, string> = { ...prev };

      for (const role of gigRoles) {
        if (!(role.id in next)) {
          next[role.id] = role.description ?? '';
          changed = true;
        }
      }

      for (const roleId of Object.keys(next)) {
        if (!gigRoles.some((role) => role.id === roleId)) {
          delete next[roleId];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [gigRoles]);

  const getCroppedImg = useCallback(
    (
      image: HTMLImageElement,
      pixelCrop: PixelCrop,
      fileName: string,
      mimeType: string = 'image/jpeg'
    ): Promise<File> => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const cropWidth = Math.round(pixelCrop.width * scaleX);
      const cropHeight = Math.round(pixelCrop.height * scaleY);

      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      ctx.drawImage(
        image,
        Math.round(pixelCrop.x * scaleX),
        Math.round(pixelCrop.y * scaleY),
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            const file = new File([blob], fileName, { type: blob.type });
            resolve(file);
          },
          mimeType,
          0.95
        );
      });
    },
    []
  );

  const uploadImageWithToast = useCallback(
    async (
      file: File,
      folder: string,
      setLoadingState: (value: boolean) => void
    ): Promise<string | null> => {
      try {
        setLoadingState(true);
        toast.info('Uploading image to S3...');
        const imageUrl = await uploadImageToS3(file, folder);
        toast.success('Image uploaded successfully!');
        return imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
        return null;
      } finally {
        setLoadingState(false);
      }
    },
    []
  );

  const handleGigImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setGigSelectedImage(file);
    handleGigFieldChange('bannerImage', '');
    setGigImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setGigImagePreview(reader.result as string);
      setShowGigImageEditor(true);
      setGigCrop(undefined);
      setGigCompletedCrop(undefined);
    };
    reader.readAsDataURL(file);
  };

  const onGigImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        gigAspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setGigCrop(initialCrop);
  };

  const handleGigCropComplete = async () => {
    if (!gigImgRef.current || !gigCompletedCrop || !gigSelectedImage) {
      toast.error('Please select a crop area');
      return;
    }

    try {
      const croppedFile = await getCroppedImg(
        gigImgRef.current,
        gigCompletedCrop,
        gigSelectedImage.name,
        gigSelectedImage.type || 'image/jpeg'
      );
      setGigSelectedImage(croppedFile);
      setGigImagePreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev);
        }
        return URL.createObjectURL(croppedFile);
      });
      setShowGigImageEditor(false);
      toast.success('Gig banner cropped successfully');
    } catch (error) {
      console.error('Error cropping gig banner:', error);
      toast.error('Failed to crop banner image');
    }
  };

  const clearGigImage = useCallback(() => {
    setGigSelectedImage(null);
    setGigImagePreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setGigCrop(undefined);
    setGigCompletedCrop(undefined);
    setShowGigImageEditor(false);
    handleGigFieldChange('bannerImage', '');
    const input = document.getElementById('gig-banner') as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  }, [handleGigFieldChange]);

  const handleCreateGig = async () => {
    if (!user) {
      toast.error('Please log in to create a gig');
      router.push('/auth');
      return;
    }

    const trimmedTitle = gigForm.title.trim();
    const trimmedDescription = gigForm.description.trim();
    const trimmedLocation = gigForm.location.trim();
    const trimmedContactEmail = gigForm.contactEmail.trim();
    const trimmedApplicationLink = gigForm.applicationLink.trim();

    if (!trimmedTitle || !trimmedDescription) {
      toast.error('Please add a title and description for the gig');
      return;
    }

    if (!gigForm.isRemote && !trimmedLocation) {
      toast.error('Please provide a location or mark the gig as remote');
      return;
    }

    if (!trimmedContactEmail && !trimmedApplicationLink) {
      toast.error('Please provide a contact email or an application link');
      return;
    }

    const budgetMin = gigForm.budgetMin ? Number(gigForm.budgetMin) : null;
    const budgetMax = gigForm.budgetMax ? Number(gigForm.budgetMax) : null;

    if ((budgetMin !== null && Number.isNaN(budgetMin)) || (budgetMax !== null && Number.isNaN(budgetMax))) {
      toast.error('Budget fields must be numeric');
      return;
    }

    if (budgetMin !== null && budgetMax !== null && budgetMin > budgetMax) {
      toast.error('Minimum budget cannot be greater than maximum budget');
      return;
    }

    setIsCreatingGig(true);
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        toast.error('Please log in to create a gig');
        router.push('/auth');
        return;
      }

      const skillsArray = gigForm.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      const rolesPayload = gigRoles.map((role) => ({
        name: role.name,
        requiredSlots: role.requiredSlots,
        description: role.description.trim() ? role.description.trim() : null,
      }));

      const primaryCategory =
        rolesPayload.length > 0
          ? rolesPayload[0].name
          : gigForm.category.trim()
          ? gigForm.category.trim()
          : null;

      let bannerImageUrl = gigForm.bannerImage ? gigForm.bannerImage : null;

      if (gigSelectedImage) {
        const uploadedBanner = await uploadImageWithToast(
          gigSelectedImage,
          'community/gigs',
          setGigUploadingImage
        );
        if (!uploadedBanner) {
          throw new Error('Failed to upload gig banner');
        }
        bannerImageUrl = uploadedBanner;
        handleGigFieldChange('bannerImage', uploadedBanner);
      }

      const response = await fetch(apiUrl('community/gigs'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
          gig_type: gigForm.gigType,
          category: primaryCategory,
          experience_level: gigForm.experienceLevel || null,
          budget_min: budgetMin,
          budget_max: budgetMax,
          budget_currency: gigForm.budgetCurrency || 'USD',
          rate_type: gigForm.rateType || null,
          location: gigForm.isRemote ? null : trimmedLocation || null,
          is_remote: gigForm.isRemote,
          application_deadline: gigForm.applicationDeadline || null,
          contact_email: trimmedContactEmail || null,
          application_link: trimmedApplicationLink || null,
          skills_required: skillsArray,
          banner_image: bannerImageUrl,
          roles: rolesPayload,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Failed to create gig');
      }

      toast.success('Gig created successfully!');
      resetGigForm();
      router.push('/community');
    } catch (error) {
      console.error('Error creating gig:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create gig');
    } finally {
      setIsCreatingGig(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <div className="border-b border-slate-800 bg-black/30 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" asChild>
              <Link href="/community">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Community
              </Link>
            </Button>
            <h1 className="text-lg font-semibold text-white sm:text-xl">Create a New Gig</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/40 bg-purple-500/10 text-purple-100 hover:bg-purple-500/20"
            onClick={() => router.push('/community')}
          >
            Cancel
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card className="border-slate-800 bg-black/40 text-slate-200 shadow-2xl shadow-purple-500/10">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-2xl font-bold text-white">
              Share an opportunity with the Artistrial community
            </CardTitle>
            <p className="mt-2 text-sm text-slate-400">
              Provide as much detail as you can so the right collaborators can apply.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 py-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gig-title">Gig Title *</Label>
                <Input
                  id="gig-title"
                  placeholder="Looking for a concept artist..."
                  value={gigForm.title}
                  onChange={(e) => handleGigFieldChange('title', e.target.value)}
                  maxLength={255}
                />
                <p className="text-xs text-slate-500">{gigForm.title.length}/255 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Gig Type *</Label>
                <Select
                  value={gigForm.gigType}
                  onValueChange={(value) => handleGigFieldChange('gigType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gig type" />
                  </SelectTrigger>
                  <SelectContent>
                    {gigTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gig-category">Primary Category (optional)</Label>
                <Input
                  id="gig-category"
                  placeholder="e.g. Illustration, UI/UX, Audio Engineering"
                  value={gigForm.category}
                  onChange={(e) => handleGigFieldChange('category', e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  If you add specific roles below, the first role will automatically become the gig&apos;s primary category.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select
                  value={gigForm.experienceLevel || undefined}
                  onValueChange={(value) => handleGigFieldChange('experienceLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <Label>Roles / Categories Needed</Label>
                {gigRoles.length > 0 && (
                  <span className="text-xs text-slate-500">
                    {gigRoles[0].name} will be used as the default category.
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Add every creative role you need for this gig and optionally set how many collaborators you can approve for each.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="e.g. Director, Dancer, Cinematographer"
                  value={roleNameInput}
                  onChange={(e) => setRoleNameInput(e.target.value)}
                />
                <Input
                  type="number"
                  min="0"
                  value={roleSlotsInput}
                  onChange={(e) => handleRoleSlotsInputChange(e.target.value)}
                  className="sm:w-32"
                  placeholder="Slots"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddGigRole}
                  className="sm:w-auto"
                >
                  Add role
                </Button>
              </div>

              {gigRoles.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-700 px-3 py-2 text-xs text-slate-500">
                  Example: add roles like &quot;Actor&quot;, &quot;Audio Engineer&quot;, &quot;Cinematographer&quot;. Set slots to the number of collaborators you plan to approve for each role.
                </div>
              ) : (
                <div className="space-y-2">
                  {gigRoles.map((role) => (
                    <div
                      key={role.id}
                      className="flex flex-col gap-3 rounded-md border border-slate-800 px-3 py-2"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{role.name}</p>
                          <p className="text-xs text-slate-500">
                            {role.requiredSlots === 0
                              ? 'Unlimited collaborators can be approved for this role.'
                              : `${role.requiredSlots} collaborator${role.requiredSlots === 1 ? '' : 's'} can be approved.`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={role.requiredSlots}
                            onChange={(e) => handleUpdateGigRoleSlots(role.id, Number(e.target.value))}
                            className="w-24"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleRemoveGigRole(role.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Describe the responsibilities, skills, or expectations for this role."
                          value={roleDescriptionDrafts[role.id] ?? role.description ?? ''}
                          onChange={(e) => handleRoleDescriptionChange(role.id, e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveGigRoleDescription(role.id)}
                            disabled={
                              (roleDescriptionDrafts[role.id] ?? role.description ?? '').trim() ===
                              (role.description ?? '').trim()
                            }
                          >
                            Save Description
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gig-description">Description *</Label>
              <Textarea
                id="gig-description"
                placeholder="Describe the project, responsibilities, expectations, and any important details."
                value={gigForm.description}
                onChange={(e) => handleGigFieldChange('description', e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-slate-500">{gigForm.description.length} characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gig-banner">Gig Banner (optional)</Label>
              <p className="text-xs text-slate-500">
                Recommended 16:9 image. This will be shown at the top of your gig card.
              </p>
              <div className="rounded-lg border-2 border-dashed border-slate-700 p-6 text-center transition-colors hover:border-purple-400">
                {!gigImagePreview ? (
                  <>
                    <Camera className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <Label htmlFor="gig-banner" className="cursor-pointer">
                      <span className="font-medium text-purple-400 hover:text-purple-300">Upload a banner</span>
                      <span className="text-slate-500"> or drag and drop</span>
                    </Label>
                    <Input
                      id="gig-banner"
                      type="file"
                      accept="image/*"
                      onChange={handleGigImageSelect}
                      className="hidden"
                    />
                    <p className="mt-2 text-xs text-slate-500">PNG, JPG up to 10MB</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg border-2 border-slate-800">
                      <img
                        src={gigImagePreview}
                        alt="Gig banner preview"
                        className="h-48 w-full bg-slate-900 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2"
                        onClick={clearGigImage}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('gig-banner') as HTMLInputElement | null;
                          input?.click();
                        }}
                      >
                        Change Image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGigCrop(undefined);
                          setGigCompletedCrop(undefined);
                          setShowGigImageEditor(true);
                        }}
                      >
                        Edit Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gig-location">Location</Label>
                <Input
                  id="gig-location"
                  placeholder="City, Country"
                  value={gigForm.location}
                  onChange={(e) => handleGigFieldChange('location', e.target.value)}
                  disabled={gigForm.isRemote}
                />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <input
                    id="gig-remote"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                    checked={gigForm.isRemote}
                    onChange={(e) => handleGigFieldChange('isRemote', e.target.checked)}
                  />
                  <Label htmlFor="gig-remote" className="text-xs font-normal text-slate-400">
                    This gig can be done remotely
                  </Label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gig-budget-min">Budget Minimum</Label>
                  <Input
                    id="gig-budget-min"
                    type="number"
                    placeholder="e.g. 500"
                    value={gigForm.budgetMin}
                    onChange={(e) => handleGigFieldChange('budgetMin', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gig-budget-max">Budget Maximum</Label>
                  <Input
                    id="gig-budget-max"
                    type="number"
                    placeholder="e.g. 1500"
                    value={gigForm.budgetMax}
                    onChange={(e) => handleGigFieldChange('budgetMax', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Budget Currency</Label>
                <Select
                  value={gigForm.budgetCurrency}
                  onValueChange={(value) => handleGigFieldChange('budgetCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rate Type</Label>
                <Select
                  value={gigForm.rateType || undefined}
                  onValueChange={(value) => handleGigFieldChange('rateType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent>
                    {rateTypes.map((rate) => (
                      <SelectItem key={rate.value} value={rate.value}>
                        {rate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gig-deadline">Application Deadline</Label>
                <Input
                  id="gig-deadline"
                  type="date"
                  value={gigForm.applicationDeadline}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleGigFieldChange('applicationDeadline', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gig-contact-email">Contact Email</Label>
                <Input
                  id="gig-contact-email"
                  type="email"
                  placeholder="you@email.com"
                  value={gigForm.contactEmail}
                  onChange={(e) => handleGigFieldChange('contactEmail', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gig-application-link">Application Link</Label>
                <Input
                  id="gig-application-link"
                  placeholder="https://"
                  value={gigForm.applicationLink}
                  onChange={(e) => handleGigFieldChange('applicationLink', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gig-skills">Skills Required (comma separated)</Label>
                <Input
                  id="gig-skills"
                  placeholder="Storyboarding, Unreal Engine, 3D Animation"
                  value={gigForm.skills}
                  onChange={(e) => handleGigFieldChange('skills', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <div className="text-xs text-slate-500">
                Need help?{' '}
                <Link href="/community" className="text-purple-400 hover:text-purple-300">
                  Explore existing gigs for inspiration
                </Link>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push('/community');
                  }}
                  disabled={isCreatingGig || gigUploadingImage}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateGig}
                  disabled={isCreatingGig || gigUploadingImage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isCreatingGig ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Gig'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showGigImageEditor && gigImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl md:h-[85vh]">
            <div className="border-b border-slate-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Crop gig banner</h2>
              <p className="text-sm text-slate-400">Crop and adjust your banner before uploading. A widescreen (16:9) crop works best.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div
                className="flex items-center justify-center overflow-hidden rounded-lg bg-slate-900"
                style={{ minHeight: '400px', maxHeight: '600px' }}
              >
                <ReactCrop
                  crop={gigCrop}
                  onChange={(_, percentCrop) => setGigCrop(percentCrop)}
                  onComplete={(c) => setGigCompletedCrop(c)}
                  aspect={gigAspectRatio}
                  minWidth={50}
                  minHeight={50}
                  className="max-h-[600px] max-w-full"
                >
                  <img
                    ref={gigImgRef}
                    alt="Gig banner"
                    src={gigImagePreview}
                    style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
                    onLoad={onGigImageLoad}
                  />
                </ReactCrop>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGigImageEditor(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleGigCropComplete}
                disabled={!gigCompletedCrop}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

