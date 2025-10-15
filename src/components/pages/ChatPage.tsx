import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Users, 
  Check,
  MoreVertical,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Circle,
  Clock,
  CheckCheck,
  Settings,
  Filter,
  Bell,
  BellOff,
  Archive,
  Trash2,
  Star,
  Pin,
  Image,
  File
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface ChatPageProps {
  isDashboardDarkMode?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantStatus: 'online' | 'offline' | 'away';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  messages: Message[];
}



const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'user1',
    participantName: 'Emma Wilson',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612d0bd?w=40&h=40&fit=crop&crop=face',
    participantStatus: 'online',
    lastMessage: 'Thanks for the artwork! It looks amazing.',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    messages: [
      {
        id: 'm1',
        senderId: 'user1',
        senderName: 'Emma Wilson',
        content: 'Hi! I\'m interested in your digital art collection.',
        timestamp: '10:30 AM',
        type: 'text',
        status: 'read',
        isOwn: false
      },
      {
        id: 'm2',
        senderId: 'current-user',
        senderName: 'You',
        content: 'Hello Emma! Thanks for your interest. Which pieces caught your attention?',
        timestamp: '10:35 AM',
        type: 'text',
        status: 'read',
        isOwn: true
      },
      {
        id: 'm3',
        senderId: 'user1',
        senderName: 'Emma Wilson',
        content: 'The abstract series with the vibrant colors. Could we discuss pricing?',
        timestamp: '10:40 AM',
        type: 'text',
        status: 'read',
        isOwn: false
      },
      {
        id: 'm4',
        senderId: 'current-user',
        senderName: 'You',
        content: 'Absolutely! I\'ll send you the details.',
        timestamp: '10:42 AM',
        type: 'text',
        status: 'delivered',
        isOwn: true
      },
      {
        id: 'm5',
        senderId: 'user1',
        senderName: 'Emma Wilson',
        content: 'Thanks for the artwork! It looks amazing.',
        timestamp: '2 min ago',
        type: 'text',
        status: 'sent',
        isOwn: false
      }
    ]
  },
  {
    id: '2',
    participantId: 'user2',
    participantName: 'Creative Agency LLC',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    participantStatus: 'away',
    lastMessage: 'Perfect! When can we schedule the consultation?',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    messages: [
      {
        id: 'm6',
        senderId: 'user2',
        senderName: 'Creative Agency LLC',
        content: 'We need a brand designer for our new project.',
        timestamp: '9:15 AM',
        type: 'text',
        status: 'read',
        isOwn: false
      },
      {
        id: 'm7',
        senderId: 'current-user',
        senderName: 'You',
        content: 'I\'d be happy to help! What\'s the scope of the project?',
        timestamp: '9:20 AM',
        type: 'text',
        status: 'read',
        isOwn: true
      }
    ]
  },
  {
    id: '3',
    participantId: 'user3',
    participantName: 'Tech Startup Inc.',
    participantAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
    participantStatus: 'offline',
    lastMessage: 'Looking forward to working with you!',
    lastMessageTime: '3 hours ago',
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    isMuted: true,
    messages: []
  },
  {
    id: '4',
    participantId: 'user4',
    participantName: 'Sarah Martinez',
    participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    participantStatus: 'online',
    lastMessage: 'Studio booking confirmed for next week.',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    messages: []
  }
];



export function ChatPage({ isDashboardDarkMode = false }: ChatPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent',
      isOwn: true
    };

    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: newMessage,
      lastMessageTime: 'now'
    };

    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    ));
    setSelectedConversation(updatedConversation);
    setNewMessage('');
  };



  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Circle className="w-3 h-3 fill-green-500 text-green-500" />;
      case 'away':
        return <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />;
      case 'offline':
        return <Circle className="w-3 h-3 fill-gray-400 text-gray-400" />;
      default:
        return null;
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`h-full flex overflow-hidden ${isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-80 border-r flex flex-col h-full ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#FF8D28]/20">
                  <MessageSquare className="w-5 h-5 text-[#FF8D28]" />
                </div>
                <h1 className={`font-title text-xl font-bold ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Messages
                </h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Archived Chats
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Chat List with natural flow */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1">
              <div className="space-y-2 px-1 py-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-2 rounded-lg cursor-pointer transition-colors relative ${
                      selectedConversation?.id === conversation.id
                        ? isDashboardDarkMode ? 'bg-gray-700' : 'bg-blue-50 border border-blue-200'
                        : isDashboardDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={conversation.participantAvatar} />
                          <AvatarFallback className="text-xs">
                            {conversation.participantName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          {getStatusIcon(conversation.participantStatus)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1 min-w-0 flex-1 max-w-[60%]">
                            <h4 className={`font-medium text-sm truncate ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {conversation.participantName}
                            </h4>
                            {(conversation.isPinned || conversation.isMuted) && (
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                {conversation.isPinned && (
                                  <Pin className="w-2.5 h-2.5 text-gray-400" />
                                )}
                                {conversation.isMuted && (
                                  <BellOff className="w-2.5 h-2.5 text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>
                          <span className={`text-xs flex-shrink-0 ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 w-full">
                          <p className={`text-xs truncate flex-1 min-w-0 max-w-[75%] ${isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs h-4 min-w-4 px-1 flex-shrink-0">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* New Conversation CTA - Natural positioning */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-medium"
                onClick={() => {
                  // Handle new conversation action
                  console.log('New conversation clicked');
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center justify-between flex-shrink-0 ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.participantAvatar} />
                      <AvatarFallback>
                        {selectedConversation.participantName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      {getStatusIcon(selectedConversation.participantStatus)}
                    </div>
                  </div>
                  <div>
                    <h2 className={`font-medium ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedConversation.participantName}
                    </h2>
                    <p className={`text-sm ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedConversation.participantStatus === 'online' ? 'Active now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-lg ${
                          message.isOwn
                            ? 'bg-[#FF8D28] text-white'
                            : isDashboardDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'} ${
                          message.isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{message.timestamp}</span>
                          {message.isOwn && getMessageStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t flex-shrink-0 ${isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Image className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[40px] max-h-32 resize-none"
                  />
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white h-10 w-10 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${isDashboardDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="text-center">
              <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`font-title text-xl font-semibold mb-2 ${isDashboardDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Select a Conversation
              </h3>
              <p className={`${isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose a conversation from the sidebar to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

