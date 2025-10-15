import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, User, Building, MapPin, DollarSign, Calendar, Mail, Phone, Target, Archive, Trash2, Edit3, Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { AdminHeader } from '../../shared/AdminHeader';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';

interface CapturedLead {
  id: string;
  name: string;
  company: string;
  industry: string;
  location: string;
  budget: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  priority: 'high' | 'medium' | 'low';
  source: string;
  description: string;
  requirements: string[];
  contact: {
    email: string;
    phone: string;
  };
  capturedAt: Date;
  lastActivity: Date;
  notes: string[];
  tags: string[];
}

interface CapturedLeadsProps {
  isDashboardDarkMode?: boolean;
}

const mockCapturedLeads: CapturedLead[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    company: 'TechStart Inc.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    budget: 75000,
    status: 'qualified',
    priority: 'high',
    source: 'Website Contact',
    description: 'Looking for comprehensive branding package including logo design, website development, and marketing materials.',
    requirements: ['Logo Design', 'Website Development', 'Marketing Materials', 'Brand Guidelines'],
    contact: {
      email: 'sarah.chen@techstart.com',
      phone: '+1 (555) 123-4567'
    },
    capturedAt: new Date('2024-01-20'),
    lastActivity: new Date('2024-01-22'),
    notes: [
      'Initial contact made - very interested in comprehensive package',
      'Scheduled call for next week to discuss requirements',
      'Budget confirmed - ready to move forward'
    ],
    tags: ['hot-lead', 'tech-startup', 'full-service']
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    company: 'GreenSpace Studios',
    industry: 'Architecture',
    location: 'Austin, TX',
    budget: 45000,
    status: 'proposal',
    priority: 'medium',
    source: 'LinkedIn',
    description: 'Need architectural visualization and 3D modeling for new residential development project.',
    requirements: ['3D Modeling', 'Architectural Visualization', 'Rendering Services'],
    contact: {
      email: 'm.rodriguez@greenspace.com',
      phone: '+1 (555) 234-5678'
    },
    capturedAt: new Date('2024-01-18'),
    lastActivity: new Date('2024-01-21'),
    notes: [
      'Proposal sent for 3D visualization services',
      'Waiting for client feedback on timeline',
      'Competition with 2 other agencies'
    ],
    tags: ['architecture', 'proposal-sent', 'competitive']
  },
  {
    id: '3',
    name: 'Emily Watson',
    company: 'Bloom Boutique',
    industry: 'Fashion',
    location: 'New York, NY',
    budget: 25000,
    status: 'contacted',
    priority: 'low',
    source: 'Referral',
    description: 'Fashion brand seeking product photography and social media content creation.',
    requirements: ['Product Photography', 'Social Media Content', 'Lifestyle Photography'],
    contact: {
      email: 'emily@bloomboutique.com',
      phone: '+1 (555) 345-6789'
    },
    capturedAt: new Date('2024-01-15'),
    lastActivity: new Date('2024-01-19'),
    notes: [
      'Initial email sent with portfolio samples',
      'Client requested pricing for photography package',
      'Referral from previous client - good sign'
    ],
    tags: ['fashion', 'photography', 'referral']
  },
  {
    id: '4',
    name: 'David Park',
    company: 'InnovateLab',
    industry: 'Healthcare',
    location: 'Boston, MA',
    budget: 120000,
    status: 'won',
    priority: 'high',
    source: 'Google Ads',
    description: 'Healthcare startup needs complete digital identity including app design and medical illustrations.',
    requirements: ['App UI/UX Design', 'Medical Illustrations', 'Brand Identity', 'Website Development'],
    contact: {
      email: 'david.park@innovatelab.health',
      phone: '+1 (555) 456-7890'
    },
    capturedAt: new Date('2024-01-10'),
    lastActivity: new Date('2024-01-25'),
    notes: [
      'Contract signed - project kickoff scheduled',
      'Large budget approved for comprehensive package',
      'Client very pleased with initial concepts'
    ],
    tags: ['healthcare', 'large-budget', 'won', 'app-design']
  }
];

export const CapturedLeads: React.FC<CapturedLeadsProps> = ({ isDashboardDarkMode = false }) => {
  const [leads, setLeads] = useState<CapturedLead[]>(mockCapturedLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<CapturedLead | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-purple-500';
      case 'proposal': return 'bg-orange-500';
      case 'won': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusStats = () => {
    const stats = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: leads.length,
      new: stats.new || 0,
      contacted: stats.contacted || 0,
      qualified: stats.qualified || 0,
      proposal: stats.proposal || 0,
      won: stats.won || 0,
      lost: stats.lost || 0
    };
  };

  const stats = getStatusStats();

  const updateLeadStatus = (leadId: string, newStatus: CapturedLead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastActivity: new Date() }
        : lead
    ));
    toast.success('Lead status updated successfully');
  };

  const addNote = (leadId: string, note: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, notes: [...lead.notes, note], lastActivity: new Date() }
        : lead
    ));
    toast.success('Note added successfully');
  };

  return (
    <div className={`p-6 space-y-6 ${isDashboardDarkMode ? 'bg-[#171717] text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <AdminHeader
        title="Captured Leads"
        description="Manage and track your captured leads"
        createButtonText="Export Leads"
        onCreateClick={() => console.log('Export leads')}
        createButtonIcon={<Target className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </div>
            <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total
            </div>
          </CardContent>
        </Card>
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
            <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              New
            </div>
          </CardContent>
        </Card>
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.contacted}</div>
            <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Contacted
            </div>
          </CardContent>
        </Card>
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.qualified}</div>
            <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Qualified
            </div>
          </CardContent>
        </Card>
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.proposal}</div>
            <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Proposal
            </div>
          </CardContent>
        </Card>
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.won}</div>
            <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Won
            </div>
          </CardContent>
        </Card>
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.lost}</div>
            <div className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Lost
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={isDashboardDarkMode ? 'text-white' : ''}>
            Leads ({filteredLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id}
              className={`p-4 rounded-lg border ${isDashboardDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
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
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getPriorityColor(lead.priority)} border`}>
                        {lead.priority}
                      </Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)}`} />
                      <span className={`text-sm capitalize ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-4 h-4 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {lead.lastActivity.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      updateLeadStatus(lead.id, 'contacted');
                    }}>
                      <Mail className="w-4 h-4 mr-2" />
                      Mark as Contacted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      updateLeadStatus(lead.id, 'qualified');
                    }}>
                      <Star className="w-4 h-4 mr-2" />
                      Mark as Qualified
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      updateLeadStatus(lead.id, 'proposal');
                    }}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Move to Proposal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${isDashboardDarkMode ? 'bg-gray-800 text-white' : ''}`}>
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedLead.name} - {selectedLead.company}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPriorityColor(selectedLead.priority)} border`}>
                      {selectedLead.priority}
                    </Badge>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedLead.status)}`} />
                    <span className="text-sm capitalize">{selectedLead.status}</span>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Detailed information and management for {selectedLead.name} from {selectedLead.company}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes ({selectedLead.notes.length})</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{selectedLead.contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{selectedLead.contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedLead.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>${selectedLead.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Lead Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Source:</span> {selectedLead.source}
                        </div>
                        <div>
                          <span className="font-medium">Industry:</span> {selectedLead.industry}
                        </div>
                        <div>
                          <span className="font-medium">Captured:</span> {selectedLead.capturedAt.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Activity:</span> {selectedLead.lastActivity.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedLead.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.requirements.map((req, index) => (
                        <Badge key={index} variant="outline">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div className="space-y-3">
                    {selectedLead.notes.map((note, index) => (
                      <div key={index} className={`p-3 rounded border ${isDashboardDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                        <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{note}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Add Note</h4>
                    <Textarea placeholder="Add a note about this lead..." />
                    <Button size="sm" className="bg-[#FF8D28] hover:bg-[#FF8D28]/90">
                      Add Note
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-3">
                    <div className={`p-3 rounded border ${isDashboardDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Lead Captured</span>
                        <span className={`text-xs ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedLead.capturedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-xs ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Lead was captured from {selectedLead.source}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

