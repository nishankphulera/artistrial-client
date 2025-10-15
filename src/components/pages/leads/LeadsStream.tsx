import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Eye, MapPin, DollarSign, Building, User, Zap, Target, TrendingUp, Timer, Activity } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../../ui/dialog';
import { AdminHeader } from '../../shared/AdminHeader';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  company: string;
  industry: string;
  location: string;
  budget: number;
  urgency: 'high' | 'medium' | 'low';
  source: string;
  description: string;
  requirements: string[];
  contact: {
    email: string;
    phone: string;
  };
  timeRemaining: number; // in seconds
  createdAt: Date;
}

interface LeadsStreamProps {
  isDashboardDarkMode?: boolean;
}

const mockLeads: Omit<Lead, 'timeRemaining' | 'createdAt'>[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'TechStart Inc.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    budget: 75000,
    urgency: 'high',
    source: 'Website Contact',
    description: 'Looking for comprehensive branding package including logo design, website development, and marketing materials.',
    requirements: ['Logo Design', 'Website Development', 'Marketing Materials', 'Brand Guidelines'],
    contact: {
      email: 'sarah.chen@techstart.com',
      phone: '+1 (555) 123-4567'
    }
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    company: 'GreenSpace Studios',
    industry: 'Architecture',
    location: 'Austin, TX',
    budget: 45000,
    urgency: 'medium',
    source: 'LinkedIn',
    description: 'Need architectural visualization and 3D modeling for new residential development project.',
    requirements: ['3D Modeling', 'Architectural Visualization', 'Rendering Services'],
    contact: {
      email: 'm.rodriguez@greenspace.com',
      phone: '+1 (555) 234-5678'
    }
  },
  {
    id: '3',
    name: 'Emily Watson',
    company: 'Bloom Boutique',
    industry: 'Fashion',
    location: 'New York, NY',
    budget: 25000,
    urgency: 'low',
    source: 'Referral',
    description: 'Fashion brand seeking product photography and social media content creation.',
    requirements: ['Product Photography', 'Social Media Content', 'Lifestyle Photography'],
    contact: {
      email: 'emily@bloomboutique.com',
      phone: '+1 (555) 345-6789'
    }
  },
  {
    id: '4',
    name: 'David Park',
    company: 'InnovateLab',
    industry: 'Healthcare',
    location: 'Boston, MA',
    budget: 120000,
    urgency: 'high',
    source: 'Google Ads',
    description: 'Healthcare startup needs complete digital identity including app design and medical illustrations.',
    requirements: ['App UI/UX Design', 'Medical Illustrations', 'Brand Identity', 'Website Development'],
    contact: {
      email: 'david.park@innovatelab.health',
      phone: '+1 (555) 456-7890'
    }
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    company: 'EcoVentures',
    industry: 'Environmental',
    location: 'Portland, OR',
    budget: 35000,
    urgency: 'medium',
    source: 'Industry Event',
    description: 'Environmental consulting firm looking for infographic design and presentation materials.',
    requirements: ['Infographic Design', 'Presentation Design', 'Data Visualization'],
    contact: {
      email: 'lisa.t@ecoventures.org',
      phone: '+1 (555) 567-8901'
    }
  }
];

export const LeadsStream: React.FC<LeadsStreamProps> = ({ isDashboardDarkMode = false }) => {
  const [activeLeads, setActiveLeads] = useState<Lead[]>([]);
  const [capturedCount, setCapturedCount] = useState(0);
  const [streamStats, setStreamStats] = useState({
    totalSeen: 0,
    totalCaptured: 0,
    totalExpired: 0
  });

  // Generate leads with random timing
  useEffect(() => {
    const generateLead = () => {
      const baseLead = mockLeads[Math.floor(Math.random() * mockLeads.length)];
      const newLead: Lead = {
        ...baseLead,
        id: `${baseLead.id}-${Date.now()}-${Math.random()}`,
        timeRemaining: Math.floor(Math.random() * 30) + 15, // 15-45 seconds
        createdAt: new Date()
      };

      setActiveLeads(prev => [...prev, newLead]);
      setStreamStats(prev => ({ ...prev, totalSeen: prev.totalSeen + 1 }));
    };

    // Initial lead
    generateLead();

    // Generate new leads every 8-15 seconds
    const interval = setInterval(() => {
      generateLead();
    }, Math.floor(Math.random() * 7000) + 8000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for leads
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLeads(prev => 
        prev.map(lead => ({
          ...lead,
          timeRemaining: Math.max(0, lead.timeRemaining - 1)
        })).filter(lead => {
          if (lead.timeRemaining <= 0) {
            setStreamStats(prevStats => ({ 
              ...prevStats, 
              totalExpired: prevStats.totalExpired + 1 
            }));
            return false;
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const captureLead = (leadId: string) => {
    setActiveLeads(prev => prev.filter(lead => lead.id !== leadId));
    setCapturedCount(prev => prev + 1);
    setStreamStats(prev => ({ ...prev, totalCaptured: prev.totalCaptured + 1 }));
    toast.success('Lead captured successfully!', {
      description: 'The lead has been added to your captured leads list.'
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeColor = (timeRemaining: number) => {
    if (timeRemaining <= 10) return 'text-red-500';
    if (timeRemaining <= 20) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleViewAnalytics = () => {
    console.log('View analytics clicked');
  };

  return (
    <div className={`p-6 space-y-6 ${isDashboardDarkMode ? 'bg-[#171717] text-white' : 'bg-gray-50'}`}>
      <AdminHeader
        title="Live Leads Stream"
        description="Capture leads before they expire"
        createButtonText="View Analytics"
        onCreateClick={handleViewAnalytics}
        createButtonIcon={<Activity className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
        additionalActions={
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isDashboardDarkMode ? 'bg-gray-800' : 'bg-white'} border`}>
              <Zap className="w-5 h-5 text-[#FF8D28]" />
              <span className="font-medium">Active: {activeLeads.length}</span>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isDashboardDarkMode ? 'bg-gray-800' : 'bg-white'} border`}>
              <Target className="w-5 h-5 text-green-500" />
              <span className="font-medium">Captured: {capturedCount}</span>
            </div>
          </div>
        }
      />

      {/* Stream Stats */}
      <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
            <TrendingUp className="w-5 h-5" />
            Stream Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {streamStats.totalSeen}
              </div>
              <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Seen
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-green-500`}>
                {streamStats.totalCaptured}
              </div>
              <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Captured
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-red-500`}>
                {streamStats.totalExpired}
              </div>
              <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Expired
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Stream Container */}
      <Card className={`${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''} min-h-[500px]`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-5 h-5 text-[#FF8D28]" />
            </motion.div>
            Live Lead Stream
            {activeLeads.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeLeads.length} active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {activeLeads.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-12 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Waiting for new leads...</p>
              </motion.div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-start">
                {activeLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ x: -100, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 100, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`w-full sm:w-[380px] md:w-[400px] lg:w-[420px] p-4 rounded-lg border ${isDashboardDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'} relative overflow-hidden flex-shrink-0`}
                  >
                  {/* Urgency indicator */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${getUrgencyColor(lead.urgency)}`} />
                  
                  {/* Timer Progress Bar */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-[#FF8D28]"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: lead.timeRemaining, ease: "linear" }}
                  />

                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className={`w-5 h-5 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <div>
                          <h3 className={`font-semibold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {lead.name}
                          </h3>
                          <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {lead.company} • {lead.industry}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className={`w-4 h-4 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {lead.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className={`w-4 h-4 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            ${lead.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                        {lead.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {lead.requirements.slice(0, 3).map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {lead.requirements.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{lead.requirements.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 text-right space-y-3">
                      {/* Timer */}
                      <div className={`flex items-center space-x-1 ${getTimeColor(lead.timeRemaining)}`}>
                        <Timer className="w-4 h-4" />
                        <span className="font-mono font-bold">
                          {Math.floor(lead.timeRemaining / 60)}:{(lead.timeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={isDashboardDarkMode ? 'bg-gray-800 text-white' : ''}>
                            <DialogHeader>
                              <DialogTitle>{lead.name} - {lead.company}</DialogTitle>
                              <DialogDescription>
                                Detailed contact and requirements information for this lead
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Contact Information</h4>
                                <p className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  Email: {lead.contact.email}
                                </p>
                                <p className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  Phone: {lead.contact.phone}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Requirements</h4>
                                <ul className={`list-disc list-inside space-y-1 ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {lead.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  {lead.description}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          onClick={() => captureLead(lead.id)}
                          className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white"
                          size="sm"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Capture Lead
                        </Button>
                      </div>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

