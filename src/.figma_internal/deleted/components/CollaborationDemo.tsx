// This file has been removed as it's not used in the application.
// Collaboration functionality is handled by other components in the /pages directory.

interface CollaborationRequirement {
  id: string;
  collaborationId: string;
  role: string;
  quantityNeeded: number;
  quantityFilled: number;
  budget?: string;
  timing?: string;
  location?: string;
  skills?: string[];
  description?: string;
  status: 'open' | 'closed';
  applications?: Application[];
}

interface Collaboration {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
  requirements: CollaborationRequirement[];
}

interface Application {
  id: string;
  requirementId: string;
  applicantId: string;
  applicantName: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export function CollaborationDemo() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [openRequirements, setOpenRequirements] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Demo data
  const [demoCollaborations] = useState<Collaboration[]>([
    {
      id: 'demo-collab-1',
      title: 'Wedding Shoot Campaign',
      description: 'Looking for talented professionals for a luxury wedding campaign shoot in Napa Valley',
      creatorId: 'demo-creator-1',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'active',
      requirements: [
        {
          id: 'demo-req-1',
          collaborationId: 'demo-collab-1',
          role: 'Photographer',
          quantityNeeded: 2,
          quantityFilled: 1,
          budget: '$800-1200 per day',
          timing: 'June 15-16, 2024',
          location: 'Napa Valley, CA',
          skills: ['Wedding Photography', 'Portrait Photography', 'Adobe Lightroom'],
          description: 'Experienced wedding photographer needed for luxury campaign shoot',
          status: 'open',
          applications: [
            {
              id: 'app-1',
              requirementId: 'demo-req-1',
              applicantId: 'demo-applicant-1',
              applicantName: 'Sarah Johnson',
              message: 'I have 8 years of wedding photography experience and specialize in luxury weddings.',
              status: 'pending',
              appliedAt: new Date(Date.now() - 43200000).toISOString(),
            }
          ]
        },
        {
          id: 'demo-req-2',
          collaborationId: 'demo-collab-1',
          role: 'Makeup Artist',
          quantityNeeded: 1,
          quantityFilled: 0,
          budget: '$500-700 per day',
          timing: 'June 15-16, 2024',
          location: 'Napa Valley, CA',
          skills: ['Bridal Makeup', 'Editorial Makeup', 'Airbrush'],
          description: 'Professional makeup artist for bridal and editorial looks',
          status: 'open',
          applications: []
        }
      ]
    },
    {
      id: 'demo-collab-2',
      title: 'Fashion Brand Lookbook',
      description: 'Creating a spring/summer lookbook for emerging fashion brand',
      creatorId: 'demo-creator-2',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'active',
      requirements: [
        {
          id: 'demo-req-3',
          collaborationId: 'demo-collab-2',
          role: 'Fashion Photographer',
          quantityNeeded: 1,
          quantityFilled: 0,
          budget: '$600-900 per day',
          timing: 'March 20-22, 2024',
          location: 'Los Angeles, CA',
          skills: ['Fashion Photography', 'Studio Lighting', 'Retouching'],
          description: 'Fashion photographer with editorial experience',
          status: 'open',
          applications: []
        },
        {
          id: 'demo-req-4',
          collaborationId: 'demo-collab-2',
          role: 'Stylist',
          quantityNeeded: 1,
          quantityFilled: 1,
          budget: '$400-600 per day',
          timing: 'March 20-22, 2024',
          location: 'Los Angeles, CA',
          skills: ['Fashion Styling', 'Wardrobe Coordination', 'Trend Forecasting'],
          description: 'Creative stylist for contemporary fashion lookbook',
          status: 'closed',
          applications: [
            {
              id: 'app-2',
              requirementId: 'demo-req-4',
              applicantId: 'demo-applicant-2',
              applicantName: 'Maria Garcia',
              message: 'Fashion stylist with 5 years experience working with emerging brands.',
              status: 'accepted',
              appliedAt: new Date(Date.now() - 259200000).toISOString(),
            }
          ]
        }
      ]
    }
  ];

  const [collaborations, setCollaborations] = useState<Collaboration[]>(demoCollaborations);
  const [applicationMessage, setApplicationMessage] = useState('');

  const toggleRequirement = (requirementId: string) => {
    const newOpen = new Set(openRequirements);
    if (newOpen.has(requirementId)) {
      newOpen.delete(requirementId);
    } else {
      newOpen.add(requirementId);
    }
    setOpenRequirements(newOpen);
  };

  const handleApply = async (requirement: CollaborationRequirement) => {
    if (!user) {
      toast.error('Please sign in to apply for collaborations');
      return;
    }

    if (!applicationMessage.trim()) {
      toast.error('Please write an application message');
      return;
    }

    // Simulate application submission
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      requirementId: requirement.id,
      applicantId: user.id,
      applicantName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      message: applicationMessage,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    // Update the collaborations state
    setCollaborations(prev => 
      prev.map(collab => 
        collab.id === requirement.collaborationId
          ? {
              ...collab,
              requirements: collab.requirements.map(req =>
                req.id === requirement.id
                  ? {
                      ...req,
                      applications: [...(req.applications || []), newApplication]
                    }
                  : req
              )
            }
          : collab
      )
    );

    setApplicationMessage('');
    toast.success('Application submitted successfully! (Demo mode)');
  };

  const handleApplicationAction = (collaborationId: string, requirementId: string, applicationId: string, action: 'accept' | 'reject') => {
    // Update application status and requirement filled count
    setCollaborations(prev => 
      prev.map(collab => 
        collab.id === collaborationId
          ? {
              ...collab,
              requirements: collab.requirements.map(req =>
                req.id === requirementId
                  ? {
                      ...req,
                      quantityFilled: action === 'accept' ? req.quantityFilled + 1 : req.quantityFilled,
                      status: action === 'accept' && req.quantityFilled + 1 >= req.quantityNeeded ? 'closed' : req.status,
                      applications: req.applications?.map(app =>
                        app.id === applicationId
                          ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' }
                          : app
                      ) || []
                    }
                  : req
              )
            }
          : collab
      )
    );

    toast.success(`Application ${action}ed successfully! (Demo mode)`);
  };

  const getProgressPercentage = (filled: number, needed: number) => {
    return Math.round((filled / needed) * 100);
  };

  const canApply = (requirement: CollaborationRequirement) => {
    if (!user) return false;
    if (requirement.status === 'closed') return false;
    if (requirement.quantityFilled >= requirement.quantityNeeded) return false;
    
    // Check if user already applied
    const userApplication = requirement.applications?.find(app => app.applicantId === user.id);
    return !userApplication;
  };

  // Filter collaborations based on active tab
  const getFilteredCollaborations = () => {
    if (activeTab === 'browse') {
      return collaborations;
    } else if (activeTab === 'my-projects') {
      // For demo, show projects if user is signed in
      return user ? collaborations.filter(c => c.creatorId === user.id) : [];
    }
    return [];
  };

  const filteredCollaborations = getFilteredCollaborations();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-title text-3xl mb-2">Collaborations (Demo)</h1>
        <p className="text-muted-foreground">
          Find creative collaborators and join exciting projects in the art community.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="browse">Browse Projects</TabsTrigger>
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="create">Create Project</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="space-y-6">
          {filteredCollaborations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-title text-lg mb-2">No Projects Available</h3>
                <p className="text-muted-foreground">
                  No collaboration projects are currently available. Check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredCollaborations.map((collaboration) => (
                <Card key={collaboration.id}>
                  <CardHeader>
                    <CardTitle className="font-title text-xl">{collaboration.title}</CardTitle>
                    {collaboration.description && (
                      <p className="text-muted-foreground">{collaboration.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collaboration.requirements.map((requirement) => (
                      <Collapsible
                        key={requirement.id}
                        open={openRequirements.has(requirement.id)}
                        onOpenChange={() => toggleRequirement(requirement.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-semibold">{requirement.role}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{requirement.quantityFilled} of {requirement.quantityNeeded} filled</span>
                                </div>
                              </div>
                              <Progress 
                                value={getProgressPercentage(requirement.quantityFilled, requirement.quantityNeeded)} 
                                className="w-24" 
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={requirement.status === 'open' ? 'default' : 'secondary'}>
                                {requirement.status}
                              </Badge>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <div className="space-y-3">
                            {requirement.description && (
                              <p className="text-sm">{requirement.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              {requirement.budget && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{requirement.budget}</span>
                                </div>
                              )}
                              {requirement.timing && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{requirement.timing}</span>
                                </div>
                              )}
                              {requirement.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{requirement.location}</span>
                                </div>
                              )}
                            </div>

                            {requirement.skills && requirement.skills.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {requirement.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            )}

                            {canApply(requirement) && (
                              <div className="space-y-3 pt-3 border-t">
                                <Label>Application Message</Label>
                                <Textarea
                                  placeholder="Tell the project creator why you're a good fit for this role..."
                                  value={applicationMessage}
                                  onChange={(e) => setApplicationMessage(e.target.value)}
                                  rows={3}
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApply(requirement)}
                                  disabled={!applicationMessage.trim()}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Submit Application
                                </Button>
                              </div>
                            )}

                            {!canApply(requirement) && requirement.status === 'open' && user && (
                              <Badge variant="secondary">
                                {requirement.applications?.find(app => app.applicantId === user.id) 
                                  ? 'Already Applied' 
                                  : 'Position Filled'
                                }
                              </Badge>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-projects" className="space-y-6">
          {!user ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="font-title text-lg mb-2">Sign In Required</h3>
                <p className="text-muted-foreground">
                  Please sign in to view your collaboration projects.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredCollaborations.map((collaboration) => (
                <Card key={collaboration.id}>
                  <CardHeader>
                    <CardTitle className="font-title text-xl">{collaboration.title}</CardTitle>
                    {collaboration.description && (
                      <p className="text-muted-foreground">{collaboration.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collaboration.requirements.map((requirement) => (
                      <Collapsible
                        key={requirement.id}
                        open={openRequirements.has(requirement.id)}
                        onOpenChange={() => toggleRequirement(requirement.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-semibold">{requirement.role}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{requirement.quantityFilled} of {requirement.quantityNeeded} filled</span>
                                </div>
                              </div>
                              <Progress 
                                value={getProgressPercentage(requirement.quantityFilled, requirement.quantityNeeded)} 
                                className="w-24" 
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={requirement.status === 'open' ? 'default' : 'secondary'}>
                                {requirement.status}
                              </Badge>
                              <Badge variant="outline">
                                {requirement.applications?.length || 0} applications
                              </Badge>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {requirement.description && (
                              <p className="text-sm">{requirement.description}</p>
                            )}
                            
                            {requirement.applications && requirement.applications.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="font-semibold">Applications</h5>
                                {requirement.applications.map((application) => (
                                  <div key={application.id} className="border rounded p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h6 className="font-medium">{application.applicantName}</h6>
                                        <p className="text-xs text-muted-foreground">
                                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <Badge variant={
                                        application.status === 'accepted' ? 'default' :
                                        application.status === 'rejected' ? 'destructive' :
                                        'secondary'
                                      }>
                                        {application.status}
                                      </Badge>
                                    </div>
                                    {application.message && (
                                      <p className="text-sm">{application.message}</p>
                                    )}
                                    {application.status === 'pending' && user && collaboration.creatorId === user.id && (
                                      <div className="flex gap-2">
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleApplicationAction(
                                            collaboration.id, 
                                            requirement.id, 
                                            application.id, 
                                            'accept'
                                          )}
                                        >
                                          Accept
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleApplicationAction(
                                            collaboration.id, 
                                            requirement.id, 
                                            application.id, 
                                            'reject'
                                          )}
                                        >
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              ))}
              
              {filteredCollaborations.length === 0 && user && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-title text-lg mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any collaboration projects yet.
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-title text-2xl">Create Collaboration Project (Demo)</CardTitle>
              <p className="text-muted-foreground">
                This is a demo of the collaboration creation form. In the full version, this would save to the backend.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Project Title</Label>
                    <Input placeholder="e.g., Wedding Shoot Campaign" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Describe your collaboration project..." rows={4} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Sample Requirements</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Photographer</h4>
                        <Badge>2 needed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">$800-1200/day • June 15-16</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Makeup Artist</h4>
                        <Badge>1 needed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">$500-700/day • June 15-16</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button disabled className="opacity-50">
                  Create Collaboration (Demo Only)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

