import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Users, DollarSign, Clock, MapPin } from 'lucide-react';
import { projectId } from '@/utils/supabase/info';
import { toast } from 'sonner';

interface CollaborationRequirement {
  role: string;
  quantityNeeded: number;
  budget?: string;
  timing?: string;
  location?: string;
  skills: string[];
  description?: string;
}

interface CreateCollaborationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateCollaborationForm({ onSuccess, onCancel }: CreateCollaborationFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<CollaborationRequirement[]>([
    {
      role: '',
      quantityNeeded: 1,
      skills: [],
    }
  ]);

  const addRequirement = () => {
    setRequirements([...requirements, {
      role: '',
      quantityNeeded: 1,
      skills: [],
    }]);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const updateRequirement = (index: number, field: keyof CollaborationRequirement, value: any) => {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    setRequirements(updated);
  };

  const addSkill = (requirementIndex: number, skill: string) => {
    if (!skill.trim()) return;
    
    const updated = [...requirements];
    const currentSkills = updated[requirementIndex].skills;
    if (!currentSkills.includes(skill.trim())) {
      updated[requirementIndex].skills = [...currentSkills, skill.trim()];
      setRequirements(updated);
    }
  };

  const removeSkill = (requirementIndex: number, skillToRemove: string) => {
    const updated = [...requirements];
    updated[requirementIndex].skills = updated[requirementIndex].skills.filter(
      skill => skill !== skillToRemove
    );
    setRequirements(updated);
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, requirementIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      addSkill(requirementIndex, input.value);
      input.value = '';
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Please enter a project title');
      return false;
    }

    if (requirements.some(req => !req.role.trim())) {
      toast.error('Please fill in all role fields');
      return false;
    }

    if (requirements.some(req => req.quantityNeeded < 1)) {
      toast.error('Quantity needed must be at least 1');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to create a collaboration');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const collaborationData = {
        title: title.trim(),
        description: description.trim() || undefined,
        requirements: requirements.map(req => ({
          ...req,
          role: req.role.trim(),
          budget: req.budget?.trim() || undefined,
          timing: req.timing?.trim() || undefined,
          location: req.location?.trim() || undefined,
          description: req.description?.trim() || undefined,
        })),
      };

      console.log('Creating collaboration with data:', collaborationData);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f6985a91/collaborations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(collaborationData),
        }
      );

      if (response.ok) {
        toast.success('Collaboration project created successfully!');
        
        // Reset form
        setTitle('');
        setDescription('');
        setRequirements([{
          role: '',
          quantityNeeded: 1,
          skills: [],
        }]);
        
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create collaboration');
      }
    } catch (error) {
      console.error('Error creating collaboration:', error);
      toast.error('Failed to create collaboration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-title text-2xl">Create Collaboration Project</CardTitle>
        <p className="text-muted-foreground">
          Set up a new collaboration project and specify the roles you need to fill.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Wedding Shoot Campaign"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your collaboration project, goals, and expectations..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-title text-lg">Role Requirements</h3>
              <Button type="button" variant="outline" onClick={addRequirement}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </div>

            <div className="space-y-6">
              {requirements.map((requirement, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Role {index + 1}</h4>
                      {requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Role/Skill *</Label>
                        <Input
                          value={requirement.role}
                          onChange={(e) => updateRequirement(index, 'role', e.target.value)}
                          placeholder="e.g., Photographer, Videographer"
                          required
                        />
                      </div>

                      <div>
                        <Label>Quantity Needed *</Label>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="1"
                            value={requirement.quantityNeeded}
                            onChange={(e) => updateRequirement(index, 'quantityNeeded', parseInt(e.target.value) || 1)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Budget (optional)</Label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            value={requirement.budget || ''}
                            onChange={(e) => updateRequirement(index, 'budget', e.target.value)}
                            placeholder="e.g., $500-1000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Timing (optional)</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            value={requirement.timing || ''}
                            onChange={(e) => updateRequirement(index, 'timing', e.target.value)}
                            placeholder="e.g., Next weekend"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Location (optional)</Label>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            value={requirement.location || ''}
                            onChange={(e) => updateRequirement(index, 'location', e.target.value)}
                            placeholder="e.g., New York City"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Skills (press Enter to add)</Label>
                      <Input
                        placeholder="Type a skill and press Enter..."
                        onKeyPress={(e) => handleSkillKeyPress(e, index)}
                      />
                      {requirement.skills.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {requirement.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="gap-2">
                              {skill}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeSkill(index, skill)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Additional Details (optional)</Label>
                      <Textarea
                        value={requirement.description || ''}
                        onChange={(e) => updateRequirement(index, 'description', e.target.value)}
                        placeholder="Specific requirements, experience level, equipment needs..."
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Collaboration'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

