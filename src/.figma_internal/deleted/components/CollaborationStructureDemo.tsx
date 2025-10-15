// This file has been removed as it's not used in the application.
// This was documentation component for collaboration structure demo.

export function CollaborationStructureDemo() {
  const [selectedDemo, setSelectedDemo] = useState('structure');

  // Sample collaboration data structure
  const sampleCollaboration = {
    id: 'collab-example-1',
    title: 'Short Film Shoot – Weekend Project',
    description: 'Creating an independent short film about urban life, need talented professionals for weekend production.',
    creatorId: 'creator-123',
    createdAt: '2024-01-15T10:00:00Z',
    status: 'active',
    requirements: [
      {
        id: 'req-1',
        collaborationId: 'collab-example-1',
        role: 'Photographer',
        quantityNeeded: 2,
        quantityFilled: 1,
        budget: '$400-600 per day',
        timing: 'January 20-21, 2024',
        location: 'Brooklyn, NY',
        skills: ['Portrait Photography', 'Street Photography', 'Adobe Lightroom'],
        description: 'Looking for photographers who can capture candid urban moments and portraits',
        status: 'open',
        applications: [
          {
            id: 'app-1',
            requirementId: 'req-1',
            applicantId: 'user-456',
            applicantName: 'Maria Garcia',
            message: 'Street photographer with 5 years experience, specialized in urban storytelling.',
            status: 'accepted',
            appliedAt: '2024-01-16T14:30:00Z'
          },
          {
            id: 'app-2',
            requirementId: 'req-1',
            applicantId: 'user-789',
            applicantName: 'James Chen',
            message: 'Documentary photographer interested in narrative-driven projects.',
            status: 'pending',
            appliedAt: '2024-01-17T09:15:00Z'
          }
        ]
      },
      {
        id: 'req-2',
        collaborationId: 'collab-example-1',
        role: 'Makeup Artist',
        quantityNeeded: 1,
        quantityFilled: 1,
        budget: '$300-450 per day',
        timing: 'January 20-21, 2024',
        location: 'Brooklyn, NY',
        skills: ['Natural Makeup', 'Film Makeup', 'Character Makeup'],
        description: 'Need makeup artist for natural, film-ready looks',
        status: 'closed',
        applications: [
          {
            id: 'app-3',
            requirementId: 'req-2',
            applicantId: 'user-101',
            applicantName: 'Sofia Martinez',
            message: 'Film makeup specialist with experience in indie productions.',
            status: 'accepted',
            appliedAt: '2024-01-16T11:20:00Z'
          }
        ]
      },
      {
        id: 'req-3',
        collaborationId: 'collab-example-1',
        role: 'Editor',
        quantityNeeded: 1,
        quantityFilled: 0,
        budget: '$500-800 total project',
        timing: 'Post-production: Jan 25 - Feb 5',
        location: 'Remote',
        skills: ['Adobe Premiere Pro', 'Color Grading', 'Sound Editing'],
        description: 'Video editor for post-production work on short film',
        status: 'open',
        applications: []
      }
    ]
  };

  const getProgressPercentage = (filled: number, needed: number) => {
    return Math.round((filled / needed) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-title text-3xl">Collaboration System Architecture</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive demonstration of how the multi-person collaboration system works, 
          from creation to fulfillment tracking.
        </p>
      </div>

      <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="structure">Data Structure</TabsTrigger>
          <TabsTrigger value="ui-flow">UI/UX Flow</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-title text-xl">Collaboration Data Model</CardTitle>
              <p className="text-muted-foreground">
                Each collaboration contains multiple requirements, and each requirement can have multiple applications.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Collaboration Info */}
              <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-600" />
                  Main Collaboration
                </h3>
                <div className="text-sm space-y-1">
                  <p><strong>Title:</strong> {sampleCollaboration.title}</p>
                  <p><strong>Description:</strong> {sampleCollaboration.description}</p>
                  <p><strong>Status:</strong> <Badge className={getStatusColor(sampleCollaboration.status)}>{sampleCollaboration.status}</Badge></p>
                  <p><strong>Total Requirements:</strong> {sampleCollaboration.requirements.length}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Requirements ({sampleCollaboration.requirements.length})
                </h3>
                
                {sampleCollaboration.requirements.map((requirement) => (
                  <div key={requirement.id} className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{requirement.role}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {requirement.quantityFilled} of {requirement.quantityNeeded} filled
                          </span>
                          <Badge className={getStatusColor(requirement.status)}>{requirement.status}</Badge>
                        </div>
                      </div>
                      <Progress 
                        value={getProgressPercentage(requirement.quantityFilled, requirement.quantityNeeded)} 
                        className="w-24" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {requirement.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{requirement.budget}</span>
                        </div>
                      )}
                      {requirement.timing && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{requirement.timing}</span>
                        </div>
                      )}
                      {requirement.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{requirement.location}</span>
                        </div>
                      )}
                      <span className="text-muted-foreground">
                        {requirement.applications?.length || 0} applications
                      </span>
                    </div>

                    {requirement.skills && requirement.skills.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {requirement.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui-flow" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Creator Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="font-title">Project Creator Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                    <div>
                      <h4 className="font-medium">Create Project</h4>
                      <p className="text-xs text-muted-foreground">Define title, description, and project goals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                    <div>
                      <h4 className="font-medium">Add Requirements</h4>
                      <p className="text-xs text-muted-foreground">Specify roles, quantities, budget, and skills needed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
                    <div>
                      <h4 className="font-medium">Review Applications</h4>
                      <p className="text-xs text-muted-foreground">Receive and evaluate applications from interested creatives</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs">4</div>
                    <div>
                      <h4 className="font-medium">Select Team</h4>
                      <p className="text-xs text-muted-foreground">Accept applications until each requirement is fulfilled</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicant Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="font-title">Applicant Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                    <div>
                      <h4 className="font-medium">Browse Projects</h4>
                      <p className="text-xs text-muted-foreground">Discover collaboration opportunities matching your skills</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                    <div className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                    <div>
                      <h4 className="font-medium">View Requirements</h4>
                      <p className="text-xs text-muted-foreground">Check role details, budget, timeline, and requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
                    <div>
                      <h4 className="font-medium">Submit Application</h4>
                      <p className="text-xs text-muted-foreground">Write compelling application message highlighting your fit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">4</div>
                    <div>
                      <h4 className="font-medium">Track Status</h4>
                      <p className="text-xs text-muted-foreground">Monitor application status and collaboration progress</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="font-title">Key System Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium mb-1">Multi-Person Roles</h4>
                  <p className="text-xs text-muted-foreground">Request multiple people for the same role (e.g., 2 photographers)</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium mb-1">Smart Fulfillment</h4>
                  <p className="text-xs text-muted-foreground">Automatically track when requirements are fully filled</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-medium mb-1">Application Management</h4>
                  <p className="text-xs text-muted-foreground">Review and manage multiple applications per requirement</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium mb-1">Scalable Structure</h4>
                  <p className="text-xs text-muted-foreground">Add unlimited requirements and handle complex projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-title">Requirement Management Dashboard</CardTitle>
              <p className="text-muted-foreground">How project creators manage applications and track fulfillment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {sampleCollaboration.requirements.map((requirement) => (
                <div key={requirement.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{requirement.role}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {requirement.quantityFilled} of {requirement.quantityNeeded} filled
                        </span>
                        <Badge className={getStatusColor(requirement.status)}>
                          {requirement.status}
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={getProgressPercentage(requirement.quantityFilled, requirement.quantityNeeded)} 
                      className="w-32" 
                    />
                  </div>

                  {requirement.applications && requirement.applications.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Applications ({requirement.applications.length})</h4>
                      <div className="space-y-2">
                        {requirement.applications.map((application) => (
                          <div key={application.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <h5 className="font-medium">{application.applicantName}</h5>
                              <p className="text-xs text-muted-foreground">{application.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                              {application.status === 'pending' && (
                                <div className="flex gap-1">
                                  <Button size="sm" className="h-7 px-3 text-xs">Accept</Button>
                                  <Button size="sm" variant="outline" className="h-7 px-3 text-xs">Reject</Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {requirement.applications?.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No applications yet</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-purple-600">
                {sampleCollaboration.requirements.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Requirements</div>
            </div>
            
            <div>
              <div className="text-2xl font-semibold text-blue-600">
                {sampleCollaboration.requirements.reduce((sum, req) => sum + req.quantityNeeded, 0)}
              </div>
              <div className="text-sm text-muted-foreground">People Needed</div>
            </div>
            
            <div>
              <div className="text-2xl font-semibold text-green-600">
                {sampleCollaboration.requirements.reduce((sum, req) => sum + req.quantityFilled, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Positions Filled</div>
            </div>
            
            <div>
              <div className="text-2xl font-semibold text-orange-600">
                {sampleCollaboration.requirements.reduce((sum, req) => sum + (req.applications?.length || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

