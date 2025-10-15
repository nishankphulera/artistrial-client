import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Target, DollarSign, Clock, Eye, Zap, Calendar, BarChart3, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { AdminHeader } from '../../shared/AdminHeader';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LeadsAnalyticsProps {
  isDashboardDarkMode?: boolean;
}

const weeklyData = [
  { name: 'Mon', leads: 12, captured: 8, expired: 4, converted: 2 },
  { name: 'Tue', leads: 19, captured: 14, expired: 5, converted: 3 },
  { name: 'Wed', leads: 15, captured: 10, expired: 5, converted: 4 },
  { name: 'Thu', leads: 22, captured: 16, expired: 6, converted: 5 },
  { name: 'Fri', leads: 18, captured: 13, expired: 5, converted: 3 },
  { name: 'Sat', leads: 8, captured: 6, expired: 2, converted: 1 },
  { name: 'Sun', leads: 10, captured: 7, expired: 3, converted: 2 }
];

const monthlyData = [
  { name: 'Jan', leads: 450, captured: 320, converted: 85, revenue: 127500 },
  { name: 'Feb', leads: 520, captured: 380, converted: 102, revenue: 153000 },
  { name: 'Mar', leads: 480, captured: 340, converted: 95, revenue: 142500 },
  { name: 'Apr', leads: 590, captured: 430, converted: 118, revenue: 177000 },
  { name: 'May', leads: 650, captured: 480, converted: 135, revenue: 202500 },
  { name: 'Jun', leads: 720, captured: 520, converted: 148, revenue: 222000 }
];

const sourceData = [
  { name: 'Website', value: 35, color: '#FF8D28' },
  { name: 'LinkedIn', value: 25, color: '#0077B5' },
  { name: 'Google Ads', value: 20, color: '#4285F4' },
  { name: 'Referrals', value: 15, color: '#34A853' },
  { name: 'Events', value: 5, color: '#EA4335' }
];

const industryData = [
  { name: 'Technology', leads: 145, revenue: 425000 },
  { name: 'Healthcare', leads: 98, revenue: 320000 },
  { name: 'Finance', leads: 87, revenue: 290000 },
  { name: 'Architecture', leads: 76, revenue: 245000 },
  { name: 'Fashion', leads: 64, revenue: 180000 },
  { name: 'Education', leads: 45, revenue: 125000 }
];

const conversionFunnelData = [
  { stage: 'Leads Seen', count: 2840, percentage: 100 },
  { stage: 'Leads Captured', count: 1988, percentage: 70 },
  { stage: 'Contacted', count: 1392, percentage: 49 },
  { stage: 'Qualified', count: 835, percentage: 29 },
  { stage: 'Proposal Sent', count: 427, percentage: 15 },
  { stage: 'Won', count: 156, percentage: 5.5 }
];

export const LeadsAnalytics: React.FC<LeadsAnalyticsProps> = ({ isDashboardDarkMode = false }) => {
  const [timeframe, setTimeframe] = useState('week');

  const kpis = {
    totalLeads: 2840,
    captureRate: 70,
    conversionRate: 5.5,
    avgDealValue: 42500,
    responseTime: 4.2,
    totalRevenue: 1425000
  };

  const trends = {
    leads: { value: 12, direction: 'up' },
    capture: { value: 8, direction: 'up' },
    conversion: { value: 2, direction: 'down' },
    revenue: { value: 15, direction: 'up' }
  };

  const handleExportReport = () => {
    console.log('Export analytics report clicked');
  };

  return (
    <div className={`p-6 space-y-6 ${isDashboardDarkMode ? 'bg-[#171717] text-white' : 'bg-gray-50'}`}>
      <AdminHeader
        title="Leads Analytics"
        description="Track your lead performance and conversion metrics"
        createButtonText="Export Report"
        onCreateClick={handleExportReport}
        createButtonIcon={<Download className="w-4 h-4" />}
        showViewToggle={false}
        isDashboardDarkMode={isDashboardDarkMode}
        additionalActions={
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Leads
                </p>
                <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {kpis.totalLeads.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+{trends.leads.value}%</span>
                </div>
              </div>
              <Eye className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Capture Rate
                </p>
                <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {kpis.captureRate}%
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+{trends.capture.value}%</span>
                </div>
              </div>
              <Target className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Conversion Rate
                </p>
                <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {kpis.conversionRate}%
                </p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">-{trends.conversion.value}%</span>
                </div>
              </div>
              <Users className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Avg Deal Value
                </p>
                <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${(kpis.avgDealValue / 1000).toFixed(0)}K
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+{trends.revenue.value}%</span>
                </div>
              </div>
              <DollarSign className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Avg Response Time
                </p>
                <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {kpis.responseTime}h
                </p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">-12%</span>
                </div>
              </div>
              <Clock className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Revenue
                </p>
                <p className={`text-2xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${(kpis.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+{trends.revenue.value}%</span>
                </div>
              </div>
              <BarChart3 className={`w-8 h-8 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="industries">Industries</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Performance */}
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                  <TrendingUp className="w-5 h-5" />
                  Weekly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDashboardDarkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={isDashboardDarkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDashboardDarkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDashboardDarkMode ? '#1f2937' : '#ffffff',
                        color: isDashboardDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDashboardDarkMode ? '#374151' : '#e5e7eb'}`
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#FF8D28" strokeWidth={2} name="Total Leads" />
                    <Line type="monotone" dataKey="captured" stroke="#10b981" strokeWidth={2} name="Captured" />
                    <Line type="monotone" dataKey="converted" stroke="#3b82f6" strokeWidth={2} name="Converted" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                  <Calendar className="w-5 h-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDashboardDarkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={isDashboardDarkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDashboardDarkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDashboardDarkMode ? '#1f2937' : '#ffffff',
                        color: isDashboardDarkMode ? '#ffffff' : '#000000',
                        border: `1px solid ${isDashboardDarkMode ? '#374151' : '#e5e7eb'}`
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="leads" stackId="1" stroke="#FF8D28" fill="#FF8D28" fillOpacity={0.6} name="Total Leads" />
                    <Area type="monotone" dataKey="captured" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Captured" />
                    <Area type="monotone" dataKey="converted" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Converted" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                <Zap className="w-5 h-5" />
                Lead Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className={`flex items-center justify-between p-4 rounded-lg ${isDashboardDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-blue-500 text-white' :
                          index === 1 ? 'bg-[#FF8D28] text-white' :
                          index === 2 ? 'bg-yellow-500 text-white' :
                          index === 3 ? 'bg-purple-500 text-white' :
                          index === 4 ? 'bg-orange-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {stage.stage}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-sm">
                          {stage.percentage}%
                        </Badge>
                        <span className={`text-lg font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {stage.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 mt-2 ${isDashboardDarkMode ? 'bg-gray-700' : ''}`}>
                      <div 
                        className="bg-[#FF8D28] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                  <Target className="w-5 h-5" />
                  Lead Sources Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                  <BarChart3 className="w-5 h-5" />
                  Source Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sourceData.map((source) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: source.color }}
                        />
                        <span className={isDashboardDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {source.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {source.value}%
                        </span>
                        <div className={`w-20 bg-gray-200 rounded-full h-2 ${isDashboardDarkMode ? 'bg-gray-700' : ''}`}>
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${source.value}%`,
                              backgroundColor: source.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="industries" className="space-y-6">
          <Card className={isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDashboardDarkMode ? 'text-white' : ''}`}>
                <BarChart3 className="w-5 h-5" />
                Industry Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDashboardDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={isDashboardDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDashboardDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDashboardDarkMode ? '#1f2937' : '#ffffff',
                      color: isDashboardDarkMode ? '#ffffff' : '#000000',
                      border: `1px solid ${isDashboardDarkMode ? '#374151' : '#e5e7eb'}`
                    }}
                  />
                  <Legend />
                  <Bar dataKey="leads" fill="#FF8D28" name="Total Leads" />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

