'use client'

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Check,
  MoreVertical,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Circle,
  CheckCheck,
  Settings,
  BellOff,
  Archive,
  Pin,
  Image,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiUrl, API_URL } from '@/utils/api';

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
}

interface ApiParticipant {
  userId: number;
  displayName: string | null;
  username: string;
  avatarUrl: string | null;
  role: string;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  lastReadAt: string | null;
  lastReadMessageId: string | null;
  status: 'online' | 'away' | 'offline';
}

interface ApiMessage {
  id: string;
  conversationId: string;
  senderId: number;
  content: string | null;
  contentType: string;
  mediaUrl: string | null;
  createdAt: string;
  updatedAt: string;
  readBy: number[];
  status: 'sent' | 'delivered' | 'read';
}

interface ApiConversation {
  id: string;
  isGroup: boolean;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  lastMessage: ApiMessage | null;
  participants: ApiParticipant[];
  settings: {
    isPinned: boolean;
    isMuted: boolean;
    isArchived: boolean;
    lastReadAt: string | null;
    lastReadMessageId: string | null;
  };
}

type PresenceStatus = 'online' | 'away' | 'offline';

interface SearchUserResult {
  id: number;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  fullName: string | null;
}

interface ViewConversation extends Conversation {
  updatedAt: string;
  participants: ApiParticipant[];
  settings: ApiConversation['settings'];
  isGroup: boolean;
  title: string | null;
}

interface ViewMessage extends Message {
  createdAt: string;
}

// API_URL removed - using apiUrl() utility instead

const formatRelativeTime = (dateString?: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes === 1) return '1 min ago';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const selectPrimaryParticipant = (
  conversation: ApiConversation,
  currentUserId: number
) => {
  if (conversation.isGroup) return null;
  return (
    conversation.participants.find(
      (participant) => participant.userId !== currentUserId
    ) ?? null
  );
};

const deriveParticipantStatus = (
  conversation: ApiConversation,
  currentUserId: number
): PresenceStatus => {
  if (!conversation.isGroup) {
    return (
      selectPrimaryParticipant(conversation, currentUserId)?.status ?? 'offline'
    );
  }

  if (
    conversation.participants.some(
      (participant) =>
        participant.userId !== currentUserId && participant.status === 'online'
    )
  ) {
    return 'online';
  }

  if (
    conversation.participants.some(
      (participant) =>
        participant.userId !== currentUserId && participant.status === 'away'
    )
  ) {
    return 'away';
  }

  return 'offline';
};

const mapConversationToView = (
  conversation: ApiConversation,
  currentUserId: number
): ViewConversation => {
  const primaryParticipant = selectPrimaryParticipant(
    conversation,
    currentUserId
  );

  const participantName = conversation.isGroup
    ? conversation.title ||
      conversation.participants
        .filter((participant) => participant.userId !== currentUserId)
        .map(
          (participant) => participant.displayName || participant.username
        )
        .join(', ') ||
      'Group Conversation'
    : primaryParticipant?.displayName ||
      primaryParticipant?.username ||
      'Conversation';

  const participantAvatar = conversation.isGroup
    ? undefined
    : primaryParticipant?.avatarUrl || undefined;

  const lastMessagePreview = conversation.lastMessage
    ? conversation.lastMessage.content?.trim() ||
      (conversation.lastMessage.mediaUrl ? '[Attachment]' : '')
    : 'Start the conversation';

  const lastMessageTime = conversation.lastMessage
    ? formatRelativeTime(conversation.lastMessage.createdAt)
    : '';

  return {
    id: conversation.id,
    participantId: String(primaryParticipant?.userId ?? conversation.id),
    participantName,
    participantAvatar,
    participantStatus: deriveParticipantStatus(conversation, currentUserId),
    lastMessage: lastMessagePreview,
    lastMessageTime,
    unreadCount: conversation.unreadCount,
    isPinned: conversation.settings.isPinned,
    isArchived: conversation.settings.isArchived,
    isMuted: conversation.settings.isMuted,
    updatedAt: conversation.updatedAt,
    participants: conversation.participants,
    settings: conversation.settings,
    isGroup: conversation.isGroup,
    title: conversation.title,
  };
};

const mapMessageToView = (
  apiMessage: ApiMessage,
  conversation: ApiConversation,
  currentUserId: number
): ViewMessage => {
  const senderParticipant = conversation.participants.find(
    (participant) => participant.userId === apiMessage.senderId
  );

  const isOwn = apiMessage.senderId === currentUserId;

  let messageType: 'text' | 'image' | 'file' = 'text';
  if (apiMessage.contentType === 'image') messageType = 'image';
  if (apiMessage.contentType === 'file') messageType = 'file';

  return {
    id: apiMessage.id,
    senderId: String(apiMessage.senderId),
    senderName: isOwn
      ? 'You'
      : senderParticipant?.displayName ||
        senderParticipant?.username ||
        'User',
    content:
      apiMessage.content ??
      (apiMessage.mediaUrl ? 'Sent an attachment' : 'Message'),
    timestamp: formatTimestamp(apiMessage.createdAt),
    type: messageType,
    status: apiMessage.status,
    isOwn,
    createdAt: apiMessage.createdAt,
  };
};

const sortConversations = (conversations: ViewConversation[]) =>
  [...conversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

export function ChatPage({ isDashboardDarkMode = false }: ChatPageProps) {
  const { user } = useAuth();

  const [conversationSummaries, setConversationSummaries] = useState<
    Record<string, ApiConversation>
  >({});
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messagesMap, setMessagesMap] = useState<
    Record<string, ViewMessage[]>
  >({});
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [finderQuery, setFinderQuery] = useState('');
  const [finderResults, setFinderResults] = useState<SearchUserResult[]>([]);
  const [finderLoading, setFinderLoading] = useState(false);
  const [finderError, setFinderError] = useState<string | null>(null);
  const [creatingConversationFor, setCreatingConversationFor] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const tokenRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const messagesMapRef = useRef<Record<string, ViewMessage[]>>({});
  const conversationSummariesRef = useRef<Record<string, ApiConversation>>({});
  const selectedConversationIdRef = useRef<string | null>(null);
  const finderInputRef = useRef<HTMLInputElement | null>(null);
  const finderDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }, []);

  useEffect(() => {
    messagesMapRef.current = messagesMap;
  }, [messagesMap]);

  useEffect(() => {
    conversationSummariesRef.current = conversationSummaries;
  }, [conversationSummaries]);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  const conversationList: ViewConversation[] = useMemo(() => {
    if (!user?.id) return [];
    const list = Object.values(conversationSummaries).map((summary) =>
      mapConversationToView(summary, user.id)
    );
    return sortConversations(list);
  }, [conversationSummaries, user?.id]);

  useEffect(() => {
    if (!selectedConversationId && conversationList.length > 0) {
      setSelectedConversationId(conversationList[0].id);
    }
    if (
      selectedConversationId &&
      !conversationSummaries[selectedConversationId]
    ) {
      setSelectedConversationId(conversationList[0]?.id ?? null);
    }
  }, [conversationList, selectedConversationId, conversationSummaries]);

  const selectedConversationSummary = selectedConversationId
    ? conversationSummaries[selectedConversationId] ?? null
    : null;

  const selectedConversationView =
    selectedConversationSummary && user?.id
      ? mapConversationToView(selectedConversationSummary, user.id)
      : null;

  const conversationMessages = selectedConversationId
    ? messagesMap[selectedConversationId] ?? []
    : [];

  useEffect(() => {
    if (conversationMessages.length > 0) {
      scrollToBottom();
    }
  }, [conversationMessages, scrollToBottom]);

  const getDirectConversationWith = useCallback(
    (targetUserId: number) => {
      const conversations = conversationSummariesRef.current;
      return Object.values(conversations).find(
        (conversation) =>
          !conversation.isGroup &&
          conversation.participants.some(
            (participant) => participant.userId === targetUserId
          )
      );
    },
    []
  );

  const resetFinderState = useCallback(() => {
    setFinderQuery('');
    setFinderResults([]);
    setFinderError(null);
    setFinderLoading(false);
    setCreatingConversationFor(null);
    if (finderDebounceRef.current) {
      clearTimeout(finderDebounceRef.current);
      finderDebounceRef.current = null;
    }
  }, []);

  const handleNewConversationOpenChange = useCallback(
    (open: boolean) => {
      setIsNewConversationOpen(open);
      if (!open) {
        resetFinderState();
      }
    },
    [resetFinderState]
  );

  useEffect(() => {
    if (isNewConversationOpen) {
      const timeoutId = setTimeout(() => {
        finderInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [isNewConversationOpen]);

  useEffect(() => {
    if (!isNewConversationOpen) return;

    if (finderDebounceRef.current) {
      clearTimeout(finderDebounceRef.current);
      finderDebounceRef.current = null;
    }

    const trimmed = finderQuery.trim();

    if (!trimmed) {
      setFinderResults([]);
      setFinderError(null);
      setFinderLoading(false);
      return;
    }

    const token = tokenRef.current;
    if (!token) {
      setFinderError('Authentication required');
      setFinderLoading(false);
      return;
    }

    setFinderLoading(true);
    setFinderError(null);

    const currentQuery = trimmed;
    finderDebounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `${apiUrl('users/search')}?q=${encodeURIComponent(currentQuery)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Search failed');
        }

        const results: SearchUserResult[] = (data.users ?? []).filter(
          (candidate: SearchUserResult) => candidate.id !== user?.id
        );
        setFinderResults(results);
      } catch (err: any) {
        console.error(err);
        setFinderError(err?.message || 'Unable to search users');
        setFinderResults([]);
      } finally {
        setFinderLoading(false);
      }
    }, 300);

    return () => {
      if (finderDebounceRef.current) {
        clearTimeout(finderDebounceRef.current);
        finderDebounceRef.current = null;
      }
    };
  }, [finderQuery, isNewConversationOpen, user?.id]);

  useEffect(
    () => () => {
      if (finderDebounceRef.current) {
        clearTimeout(finderDebounceRef.current);
      }
    },
    []
  );

  const fetchConversations = useCallback(
    async (token: string) => {
      if (!user?.id) return;
      setConversationsLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl('chat/conversations'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("conversations data",data);
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load conversations');
        }

        const summaries: Record<string, ApiConversation> = {};
        (data.conversations ?? []).forEach((conversation: ApiConversation) => {
          summaries[conversation.id] = conversation;
        });

        setConversationSummaries(summaries);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Unable to load conversations');
      } finally {
        setConversationsLoading(false);
      }
    },
    [user?.id]
  );

  const fetchConversation = useCallback(
    async (conversationId: string, token: string) => {
      if (!user?.id) return null;
      try {
        const response = await fetch(
          apiUrl(`chat/conversations/${conversationId}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load conversation');
        }

        const conversation: ApiConversation = data.conversation;
        setConversationSummaries((prev) => ({
          ...prev,
          [conversationId]: conversation,
        }));
        return conversation;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [user?.id]
  );

  const handleStartConversation = useCallback(
    async (target: SearchUserResult) => {
      if (!user?.id) return;

      const existing = getDirectConversationWith(target.id);
      if (existing) {
        handleNewConversationOpenChange(false);
        setSelectedConversationId(existing.id);
        return;
      }

      const token = tokenRef.current;
      if (!token) {
        setFinderError('Authentication required');
        return;
      }

      setFinderError(null);
      setCreatingConversationFor(target.id);

      try {
        const response = await fetch(apiUrl('chat/conversations'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participantIds: [target.id],
            isGroup: false,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to create conversation');
        }

        if (data.conversation) {
          const conversation: ApiConversation = data.conversation;
          setConversationSummaries((prev) => ({
            ...prev,
            [conversation.id]: conversation,
          }));
          setMessagesMap((prev) => ({
            ...prev,
            [conversation.id]: [],
          }));
          setSelectedConversationId(conversation.id);
        } else if (data.message?.conversationId) {
          await fetchConversation(data.message.conversationId, token);
          setSelectedConversationId(data.message.conversationId);
        } else if (data.id) {
          await fetchConversation(data.id, token);
          setSelectedConversationId(data.id);
        }

        handleNewConversationOpenChange(false);
      } catch (err: any) {
        console.error(err);
        setFinderError(err?.message || 'Unable to start conversation');
      } finally {
        setCreatingConversationFor(null);
      }
    },
    [
      fetchConversation,
      getDirectConversationWith,
      handleNewConversationOpenChange,
      user?.id,
    ]
  );

  const markConversationAsRead = useCallback(
    async (conversationId: string, token: string) => {
      if (!user?.id) return;
      const messages = messagesMapRef.current[conversationId] ?? [];
      if (messages.length === 0) return;
      const lastMessage = messages[messages.length - 1];

      try {
        const response = await fetch(
          apiUrl(`chat/conversations/${conversationId}/read`),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              lastMessageId: lastMessage.id,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.conversation) {
          setConversationSummaries((prev) => ({
            ...prev,
            [conversationId]: data.conversation,
          }));
        }
      } catch (err) {
        console.error('Failed to mark conversation read', err);
      }
    },
    [user?.id]
  );

  const fetchMessages = useCallback(
    async (conversationId: string, token: string) => {
      if (!user?.id) return;
      setMessagesLoading(true);
      try {
        const response = await fetch(
          apiUrl(`chat/conversations/${conversationId}/messages`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load messages');
        }

        const existingConversation =
          conversationSummariesRef.current[conversationId] ?? null;

        const resolvedConversation =
          existingConversation ?? (await fetchConversation(conversationId, token));

        if (!resolvedConversation) {
          return;
        }

        const safeConversation = resolvedConversation;

        const mappedMessages: ViewMessage[] = (data.messages ?? []).map(
          (message: ApiMessage) =>
            mapMessageToView(message, safeConversation, user.id)
        );

        setMessagesMap((prev) => ({
          ...prev,
          [conversationId]: mappedMessages,
        }));

        await markConversationAsRead(conversationId, token);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Unable to load messages');
      } finally {
        setMessagesLoading(false);
      }
    },
    [user?.id, fetchConversation, markConversationAsRead]
  );

  const handleIncomingMessage = useCallback(
    async (message: ApiMessage) => {
      if (!user?.id) return;
      const token = tokenRef.current;
      if (!token) return;

      const existingConversation =
        conversationSummariesRef.current[message.conversationId] ?? null;

      const resolvedConversation =
        existingConversation ??
        (await fetchConversation(message.conversationId, token));

      if (!resolvedConversation) return;

      const safeConversation = resolvedConversation;

      const mappedMessage = mapMessageToView(message, safeConversation, user.id);

      setMessagesMap((prev) => {
        const existing = prev[message.conversationId] ?? [];
        if (existing.some((item) => item.id === mappedMessage.id)) {
          return prev;
        }
        return {
          ...prev,
          [message.conversationId]: [...existing, mappedMessage],
        };
      });

      const isActive =
        selectedConversationIdRef.current === message.conversationId;

      if (isActive && message.senderId !== user.id) {
        await markConversationAsRead(message.conversationId, token);
      }
    },
    [fetchConversation, markConversationAsRead, user?.id]
  );

  const handleConversationUpdated = useCallback(
    async ({ conversationId }: { conversationId: string }) => {
      const token = tokenRef.current;
      if (!token) return;
      await fetchConversation(conversationId, token);
    },
    [fetchConversation]
  );

  const handleConversationReadEvent = useCallback(
    async ({ conversationId }: { conversationId: string }) => {
      const token = tokenRef.current;
      if (!token) return;
      await fetchConversation(conversationId, token);
    },
    [fetchConversation]
  );

  useEffect(() => {
    if (!user?.id) return;
    if (initializedRef.current) return;

    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('Please sign in to use chat');
      return;
    }

    tokenRef.current = token;
    initializedRef.current = true;

    fetchConversations(token);

    const socketInstance = io(API_URL, {
      auth: { token },
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => setSocketConnected(true));
    socketInstance.on('disconnect', () => setSocketConnected(false));

    socketInstance.on('message:new', handleIncomingMessage);
    socketInstance.on('conversation:updated', handleConversationUpdated);
    socketInstance.on('conversation:read', handleConversationReadEvent);

    return () => {
      initializedRef.current = false;
      socketInstance.off('message:new', handleIncomingMessage);
      socketInstance.off('conversation:updated', handleConversationUpdated);
      socketInstance.off('conversation:read', handleConversationReadEvent);
      socketInstance.disconnect();
    };
  }, [
    user?.id,
    fetchConversations,
    handleIncomingMessage,
    handleConversationUpdated,
    handleConversationReadEvent,
  ]);

  useEffect(() => {
    const token = tokenRef.current;
    if (!selectedConversationId || !token || !user?.id) return;

    socketRef.current?.emit('conversation:join', selectedConversationId);

    if (!messagesMapRef.current[selectedConversationId]) {
      fetchMessages(selectedConversationId, token);
    } else {
      markConversationAsRead(selectedConversationId, token);
    }

    return () => {
      socketRef.current?.emit('conversation:leave', selectedConversationId);
    };
  }, [
    selectedConversationId,
    fetchMessages,
    markConversationAsRead,
    user?.id,
  ]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !user?.id) return;
    const token = tokenRef.current;
    if (!token) {
      setError('Authentication required to send messages.');
      return;
    }

    const tempMessageId = `temp-${Date.now()}`;
    const optimisticMessage: ViewMessage = {
      id: tempMessageId,
      senderId: String(user.id),
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'text',
      status: 'sent',
      isOwn: true,
      createdAt: new Date().toISOString(),
    };

    setMessagesMap((prev) => {
      const existing = prev[selectedConversationId] ?? [];
      return {
        ...prev,
        [selectedConversationId]: [...existing, optimisticMessage],
      };
    });
    setNewMessage('');

    try {
      const response = await fetch(
        apiUrl(`chat/conversations/${selectedConversationId}/messages`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: optimisticMessage.content,
            contentType: 'text',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send message');
      }

      if (data.conversation) {
        setConversationSummaries((prev) => ({
          ...prev,
          [data.conversation.id]: data.conversation,
        }));
      }

      if (data.message && user?.id) {
        const summary =
          (data.conversation as ApiConversation) ||
          conversationSummariesRef.current[selectedConversationId];
        if (!summary) return;
        const mappedMessage = mapMessageToView(
          data.message as ApiMessage,
          summary,
          user.id
        );
        setMessagesMap((prev) => ({
          ...prev,
          [selectedConversationId]: [
            ...(prev[selectedConversationId]?.filter(
              (message) =>
                message.id !== tempMessageId &&
                message.id !== (data.message as ApiMessage).id
            ) ?? []),
            mappedMessage,
          ],
        }));
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to send message');
      setMessagesMap((prev) => ({
        ...prev,
        [selectedConversationId]:
          prev[selectedConversationId]?.filter(
            (message) => message.id !== tempMessageId
          ) ?? [],
      }));
      setNewMessage(optimisticMessage.content);
    }
  };

  const filteredConversations = conversationList.filter((conv) =>
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

  if (!user) {
  return (
      <div
        className={`h-full flex items-center justify-center ${
          isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'
        }`}
      >
        <div className="text-center">
          <MessageSquare
            className={`w-16 h-16 mx-auto mb-4 ${
              isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`}
          />
          <h3
            className={`font-title text-xl font-semibold mb-2 ${
              isDashboardDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Sign in to chat
          </h3>
          <p
            className={
              isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'
            }
          >
            Please sign in to start messaging your connections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div
      className={`h-full flex overflow-hidden ${
        isDashboardDarkMode ? 'bg-[#171717]' : 'bg-gray-50'
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-80 border-r flex flex-col h-full ${
          isDashboardDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#FF8D28]/20">
                  <MessageSquare className="w-5 h-5 text-[#FF8D28]" />
                </div>
              <div>
                <h1
                  className={`font-title text-xl font-bold ${
                    isDashboardDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Messages
                </h1>
                <p
                  className={`text-xs ${
                    socketConnected ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  {socketConnected ? 'Connected' : 'Connecting...'}
                </p>
              </div>
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
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDashboardDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

        {/* Chat List */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1">
              <div className="space-y-2 px-1 py-2">
              {conversationsLoading && (
                <div className="text-sm text-muted-foreground px-4 py-6 text-center">
                  Loading conversations...
                </div>
              )}
              {!conversationsLoading && filteredConversations.length === 0 && (
                <div className="text-center text-sm text-muted-foreground px-4 py-6">
                  No conversations found.
                </div>
              )}
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-2 rounded-lg cursor-pointer transition-colors relative ${
                    selectedConversationId === conversation.id
                      ? isDashboardDarkMode
                        ? 'bg-gray-700'
                        : 'bg-blue-50 border border-blue-200'
                      : isDashboardDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedConversationId(conversation.id)}
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
                          <h4
                            className={`font-medium text-sm truncate ${
                              isDashboardDarkMode
                                ? 'text-white'
                                : 'text-gray-900'
                            }`}
                          >
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
                        <span
                          className={`text-xs flex-shrink-0 ${
                            isDashboardDarkMode
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}
                        >
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-1 w-full">
                        <p
                          className={`text-xs truncate flex-1 min-w-0 max-w-[75%] ${
                            isDashboardDarkMode
                              ? 'text-gray-300'
                              : 'text-gray-600'
                          }`}
                        >
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="text-xs h-4 min-w-4 px-1 flex-shrink-0"
                          >
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

          {/* New Conversation CTA */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                className="w-full bg-[#FF8D28] hover:bg-[#FF8D28]/90 text-white font-medium"
              onClick={() => setIsNewConversationOpen(true)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>
          </div>
        </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {selectedConversationView ? (
          <>
            {/* Chat Header */}
            <div
              className={`p-4 border-b flex items-center justify-between flex-shrink-0 ${
                isDashboardDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversationView.participantAvatar} />
                      <AvatarFallback>
                      {selectedConversationView.participantName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                    {getStatusIcon(selectedConversationView.participantStatus)}
                    </div>
                  </div>
                  <div>
                  <h2
                    className={`font-medium ${
                      isDashboardDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {selectedConversationView.participantName}
                    </h2>
                  <p
                    className={`text-sm ${
                      isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {selectedConversationView.participantStatus === 'online'
                      ? 'Active now'
                      : 'Last seen recently'}
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
                  {messagesLoading && conversationMessages.length === 0 ? (
                    <div className="flex justify-center py-10 text-sm text-muted-foreground">
                      Loading messages...
                    </div>
                  ) : (
                    conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                          className={`max-w-xs lg:max-w-md ${
                            message.isOwn ? 'order-2' : 'order-1'
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg ${
                          message.isOwn
                            ? 'bg-[#FF8D28] text-white'
                                : isDashboardDarkMode
                                  ? 'bg-gray-700 text-white'
                                  : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                          <p className="text-sm">{message.content}</p>
                        </div>
                          <div
                            className={`flex items-center gap-1 mt-1 text-xs ${
                              isDashboardDarkMode
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            } ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                          <span>{message.timestamp}</span>
                          {message.isOwn && getMessageStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                  {error && (
                    <div className="text-center text-sm text-red-500 py-4">
                      {error}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div
              className={`p-4 border-t flex-shrink-0 ${
                isDashboardDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
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
          <div
            className={`flex-1 flex items-center justify-center ${
              isDashboardDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}
          >
            <div className="text-center">
              <MessageSquare
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDashboardDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`}
              />
              <h3
                className={`font-title text-xl font-semibold mb-2 ${
                  isDashboardDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Select a Conversation
              </h3>
              <p
                className={
                  isDashboardDarkMode ? 'text-gray-400' : 'text-gray-600'
                }
              >
                Choose a conversation from the sidebar to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
      <Dialog
        open={isNewConversationOpen}
        onOpenChange={handleNewConversationOpenChange}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Start a new conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p
              className={`text-sm ${
                isDashboardDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Search by username, email, or phone number to find people to chat
              with.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                ref={finderInputRef}
                value={finderQuery}
                onChange={(event) => setFinderQuery(event.target.value)}
                placeholder="Search users..."
                className="pl-10"
              />
            </div>
            {finderError && (
              <p className="text-sm text-destructive">{finderError}</p>
            )}
            <div className="max-h-72 overflow-y-auto space-y-2">
              {finderLoading ? (
                <div className="flex items-center gap-2 py-6 px-3 text-sm text-muted-foreground rounded-md border border-dashed">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching users…
                </div>
              ) : null}
              {!finderLoading &&
              finderResults.length === 0 &&
              finderQuery.trim().length >= 2 ? (
                <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-md">
                  No users found matching “{finderQuery.trim()}”.
                </div>
              ) : null}
              {finderResults.map((result) => {
                const existingConversation = Object.values(
                  conversationSummaries
                ).find(
                  (conversation) =>
                    !conversation.isGroup &&
                    conversation.participants.some(
                      (participant) => participant.userId === result.id
                    )
                );
                const isCreating = creatingConversationFor === result.id;
                const subtitleParts = [
                  result.username,
                  result.email,
                  result.phone,
                ].filter(Boolean);
                const primaryLabel =
                  result.displayName ||
                  result.fullName ||
                  result.username ||
                  'Unnamed user';

                return (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleStartConversation(result)}
                    disabled={isCreating}
                    className={[
                      'w-full text-left rounded-xl border px-4 py-3 transition-all',
                      'flex items-center gap-4 shadow-sm',
                      existingConversation
                        ? 'border-amber-400/70 bg-amber-50 dark:bg-amber-500/10'
                        : isDashboardDarkMode
                          ? 'border-gray-700 bg-gray-800 hover:border-[#FF8D28]'
                          : 'border-gray-200 bg-white hover:border-[#FF8D28]',
                      isCreating ? 'opacity-70 pointer-events-none' : '',
                    ].join(' ')}
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-transparent shadow-sm">
                      <AvatarImage src={result.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-base">
                        {primaryLabel.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`font-medium ${
                            isDashboardDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {primaryLabel}
                        </p>
                        <div className="flex items-center gap-2">
                          {existingConversation ? (
                            <Badge
                              variant="secondary"
                              className="text-xs uppercase tracking-wide"
                            >
                              In your chats
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs uppercase tracking-wide border-[#FF8D28] text-[#FF8D28]"
                            >
                              New chat
                            </Badge>
                          )}
                          {isCreating ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : null}
                        </div>
                      </div>
                      {subtitleParts.length > 0 ? (
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {subtitleParts.map((part) => (
                            <span
                              key={part}
                              className="rounded-full bg-muted px-2 py-0.5"
                            >
                              {part}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

