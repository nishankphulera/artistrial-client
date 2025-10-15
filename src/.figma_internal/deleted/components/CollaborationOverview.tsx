// This file has been removed as it's not used in the application.
// This was documentation component for collaboration overview.

export function CollaborationOverview() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="font-title text-2xl">How Collaborations Work</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create collaborative projects, specify the roles you need, and connect with talented creatives across the Artistrial community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title text-lg">
              <Target className="h-5 w-5 text-purple-600" />
              Define Your Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set up your collaboration with a clear title, description, and specify the exact roles you need to bring your vision to life.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              Connect with Talent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Artists, designers, and creatives can apply to your project. Review applications and select the perfect team members.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title text-lg">
              <Lightbulb className="h-5 w-5 text-green-600" />
              Create Together
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Collaborate with your selected team to complete the project. Track progress and manage fulfillment for each role.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="font-title text-lg">Multi-Person Role Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Our collaboration system supports complex requirements where you can request multiple people for the same role.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Example Requirements:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Photographers</span>
                  <Badge>2 needed</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Makeup Artist</span>
                  <Badge>1 needed</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Each Requirement Includes:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>Budget range (optional)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Timing details</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span>Location info</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>Required skills</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

