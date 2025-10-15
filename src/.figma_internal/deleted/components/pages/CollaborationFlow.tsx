import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowRight,
  Users,
  FileText,
  UserCheck,
  MessageSquare,
  CheckCircle,
  Settings,
  Eye
} from 'lucide-react';

interface CollaborationFlowProps {
  isDashboardDarkMode?: boolean;
}

export const CollaborationFlow: React.FC<CollaborationFlowProps> = ({ isDashboardDarkMode = false }) => {
  const steps = [
    {
      id: 1,
      title: "Project Creation",
      icon: <FileText className="w-6 h-6" />,
      description: "Creator defines project and requirements",
      details: [
        "Create collaboration with title and description",
        "Define specific requirements (roles, skills, budget, timeline)",
        "Set quantity needed for each requirement",
        "Project becomes available for applications"
      ],
      status: "creator"
    },
    {
      id: 2,
      title: "Application Phase",
      icon: <Users className="w-6 h-6" />,
      description: "Users discover and apply to join",
      details: [
        "Users browse available collaborations",
        "View requirement details and progress",
        "Submit applications with personal messages",
        "Track application status"
      ],
      status: "user"
    },
    {
      id: 3,
      title: "Review & Selection",
      icon: <UserCheck className="w-6 h-6" />,
      description: "Creator reviews and accepts applications",
      details: [
        "Creator receives notifications of new applications",
        "Review applicant profiles and messages",
        "Accept/reject applications based on requirements",
        "Requirements automatically close when filled"
      ],
      status: "creator"
    },
    {
      id: 4,
      title: "Active Collaboration",
      icon: <MessageSquare className="w-6 h-6" />,
      description: "Team communicates and progresses",
      details: [
        "Built-in chat for team coordination",
        "Progress tracking and status updates",
        "Requirement management (edit/add/remove)",
        "System notifications for key events"
      ],
      status: "both"
    },
    {
      id: 5,
      title: "Completion",
      icon: <CheckCircle className="w-6 h-6" />,
      description: "Project concludes successfully",
      details: [
        "Creator marks collaboration as completed",
        "Final team communication",
        "Project archived for reference",
        "Success metrics and feedback"
      ],
      status: "creator"
    }
  ];

  const features = [
    {
      title: "Slot-Based Requirements",
      description: "Each requirement shows filled vs. open slots (e.g., Photographer 2/2 filled)",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Application Management",
      description: "Users apply with messages, creators approve/reject with instant notifications",
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      title: "Progress Tracking",
      description: "Real-time collaboration progress as requirements get fulfilled",
      icon: <Eye className="w-5 h-5" />
    },
    {
      title: "Built-in Communication",
      description: "Team chat and comments for seamless project coordination",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      title: "Flexible Management",
      description: "Edit, add, or remove requirements before they're fully filled",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "creator":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      case "both":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "creator":
        return "Creator Action";
      case "user":
        return "User Action";
      case "both":
        return "Team Activity";
      default:
        return "System";
    }
  };

  return (
    <div className={`min-h-screen ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-title">
            Collaboration Workflow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete step-by-step flow from project creation to successful completion, 
            ensuring clarity and coordination for all team members.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center font-title">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Step-by-Step Flow */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center font-title">
            Step-by-Step Process
          </h2>
          <div className="relative">
            {/* Flow Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 h-full hidden lg:block"></div>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-col lg:space-x-8`}>
                  {/* Content Card */}
                  <div className="flex-1 max-w-lg">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                              {step.icon}
                            </div>
                            <div>
                              <CardTitle className="font-title">{step.title}</CardTitle>
                              <Badge className={getStatusColor(step.status)}>
                                {getStatusLabel(step.status)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-gray-300">
                            {step.id}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Step Number Circle */}
                  <div className="hidden lg:flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full font-bold text-lg z-10 relative">
                    {step.id}
                  </div>

                  {/* Arrow or Spacer */}
                  <div className="flex-1 max-w-lg flex items-center justify-center lg:hidden">
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Perspectives */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center font-title">
            User Perspectives
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Creator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-title">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <span>Project Creator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dashboard Management</h4>
                    <p className="text-sm text-gray-600">
                      Access comprehensive project dashboard with progress tracking, 
                      application management, and team communication tools.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Full Control</h4>
                    <p className="text-sm text-gray-600">
                      Edit requirements, manage applications, track progress, 
                      and coordinate with team members through built-in chat.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Receive instant notifications for new applications, 
                      messages, and project milestones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collaborator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-title">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Collaborator</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Discovery</h4>
                    <p className="text-sm text-gray-600">
                      Browse available projects, view detailed requirements, 
                      and see real-time progress of open positions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Application Process</h4>
                    <p className="text-sm text-gray-600">
                      Submit personalized applications with messages, 
                      track application status, and receive prompt responses.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Team Participation</h4>
                    <p className="text-sm text-gray-600">
                      Once accepted, participate in team chat, receive updates, 
                      and contribute to project success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Metrics */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-title">
              Designed for Success
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
              Our collaboration system ensures clear communication, efficient coordination, 
              and successful project outcomes through structured workflows and comprehensive management tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Application Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Real-time</div>
                <div className="text-sm text-gray-600">Progress Updates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">Built-in</div>
                <div className="text-sm text-gray-600">Communication</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

