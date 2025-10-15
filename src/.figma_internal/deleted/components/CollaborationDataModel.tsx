// This file has been removed as it's not used in the application.
// This was documentation/demo component for collaboration data structure.

export function CollaborationDataModel() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-title text-3xl">Collaboration System Data Model</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Scalable, intuitive structure for managing complex creative collaborations with multiple requirements and multi-person fulfillment.
        </p>
      </div>

      {/* Core Data Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Core Data Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Collaboration Entity */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-600" />
                Collaboration
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg border">
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-purple-600">id:</span> string</div>
                  <div><span className="text-purple-600">title:</span> string</div>
                  <div><span className="text-purple-600">description:</span> string?</div>
                  <div><span className="text-purple-600">creatorId:</span> string</div>
                  <div><span className="text-purple-600">createdAt:</span> datetime</div>
                  <div><span className="text-purple-600">status:</span> enum</div>
                  <div><span className="text-purple-600">requirements[]:</span> array</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Main project container with overall details and creator information.
              </p>
            </div>

            {/* Requirement Entity */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Requirement
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-blue-600">id:</span> string</div>
                  <div><span className="text-blue-600">role:</span> string</div>
                  <div><span className="text-blue-600">quantityNeeded:</span> number</div>
                  <div><span className="text-blue-600">quantityFilled:</span> number</div>
                  <div><span className="text-blue-600">budget:</span> string?</div>
                  <div><span className="text-blue-600">timing:</span> string?</div>
                  <div><span className="text-blue-600">location:</span> string?</div>
                  <div><span className="text-blue-600">skills[]:</span> array</div>
                  <div><span className="text-blue-600">status:</span> enum</div>
                  <div><span className="text-blue-600">applications[]:</span> array</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Specific role/skill needed with quantity and fulfillment tracking.
              </p>
            </div>

            {/* Application Entity */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                Application
              </h3>
              <div className="bg-green-50 p-4 rounded-lg border">
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-green-600">id:</span> string</div>
                  <div><span className="text-green-600">applicantId:</span> string</div>
                  <div><span className="text-green-600">applicantName:</span> string</div>
                  <div><span className="text-green-600">message:</span> string?</div>
                  <div><span className="text-green-600">status:</span> enum</div>
                  <div><span className="text-green-600">appliedAt:</span> datetime</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Individual application from a creative professional to a specific requirement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-green-600" />
            Example Use Cases & Multi-Person Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Use Case 1: Wedding Shoot</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <strong>Photographers</strong>
                    <Badge>2 needed</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Need 2 photographers for different angles and backup coverage
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">Wedding Photography</Badge>
                    <Badge variant="outline" className="text-xs">Portrait</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <strong>Makeup Artist</strong>
                    <Badge>1 needed</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Single makeup artist for bridal and guest makeup
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">Bridal Makeup</Badge>
                    <Badge variant="outline" className="text-xs">Editorial</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Use Case 2: Music Video</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <strong>Camera Operators</strong>
                    <Badge>3 needed</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multiple camera operators for different shots and angles
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">Cinematography</Badge>
                    <Badge variant="outline" className="text-xs">Music Video</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <strong>Lighting Technician</strong>
                    <Badge>2 needed</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lighting team for complex setup and dynamic scenes
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">Stage Lighting</Badge>
                    <Badge variant="outline" className="text-xs">Color Theory</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment Logic */}
          <div className="space-y-4">
            <h3 className="font-semibold">Multi-Person Fulfillment Logic</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-semibold text-green-600 mb-2">1/2</div>
                  <p className="text-sm font-medium">Partially Filled</p>
                  <p className="text-xs text-muted-foreground">Status: Open, still accepting applications</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-semibold text-blue-600 mb-2">2/2</div>
                  <p className="text-sm font-medium">Fully Filled</p>
                  <p className="text-xs text-muted-foreground">Status: Closed, no longer accepting applications</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-semibold text-purple-600 mb-2">Auto</div>
                  <p className="text-sm font-medium">Smart Status</p>
                  <p className="text-xs text-muted-foreground">Automatically closes when quantity is reached</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-orange-600" />
            Technical Implementation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Storage Strategy</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-100 rounded font-mono">
                  collaboration:{"{collaborationId}"}
                </div>
                <div className="p-2 bg-gray-100 rounded font-mono">
                  requirement:{"{collaborationId}"}{":"}requirementId
                </div>
                <div className="p-2 bg-gray-100 rounded font-mono">
                  application:{"{requirementId}"}{":"}applicationId
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Hierarchical key structure for efficient queries and updates
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Key Features</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Real-time quantity tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Automatic status management</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Application conflict prevention</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span>Scalable to any project size</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

