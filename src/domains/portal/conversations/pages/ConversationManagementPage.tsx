import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ConversationsTable } from '../components/ConversationsTable'
import { 
  type Conversation, 
  type ConversationFilters, 
  type Message,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationAsReadMutation
} from '../apis/conversationsApi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { 
  ArrowLeftIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

type ViewMode = 'list' | 'details'

export function ConversationManagementPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if we need to load a specific conversation from URL
  const conversationIdFromUrl = searchParams.get('view')
  const { data: conversationFromUrl, isLoading: loadingConversation } = useGetConversationQuery(
    conversationIdFromUrl || '', 
    { skip: !conversationIdFromUrl }
  )

  // Load messages for the selected conversation
  const { data: messagesData, isLoading: loadingMessages } = useGetMessagesQuery(
    { conversationId: selectedConversation?.id || '' },
    { skip: !selectedConversation?.id }
  )

  // Mutations
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation()
  const [markAsRead] = useMarkConversationAsReadMutation()

  // Load conversation from URL if present
  useEffect(() => {
    if (conversationFromUrl) {
      setSelectedConversation(conversationFromUrl)
      setViewMode('details')
    }
  }, [conversationFromUrl])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesData?.messages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesData?.messages])

  // Mark conversation as read when viewing
  useEffect(() => {
    if (selectedConversation?.id && selectedConversation.hasUnreadForAdmin) {
      markAsRead(selectedConversation.id)
    }
  }, [selectedConversation?.id, selectedConversation?.hasUnreadForAdmin, markAsRead])

  // Determine filters based on current route
  const defaultFilters = useMemo((): Partial<ConversationFilters> => {
    const path = location.pathname
    
    if (path.includes('/unread')) {
      return { hasUnread: true }
    } else if (path.includes('/active')) {
      return { status: ['active'] }
    } else if (path.includes('/closed')) {
      return { status: ['closed'] }
    } else if (path.includes('/archived')) {
      return { status: ['archived'] }
    } else if (path.includes('/application')) {
      return { type: ['application'] }
    } else if (path.includes('/contract')) {
      return { type: ['contract'] }
    } else if (path.includes('/support')) {
      return { type: ['support'] }
    }
    
    return {}
  }, [location.pathname])

  // Get page title based on current route
  const getPageTitle = (): string => {
    const path = location.pathname
    
    if (path.includes('/unread')) return 'Unread Conversations'
    if (path.includes('/active')) return 'Active Conversations'
    if (path.includes('/closed')) return 'Closed Conversations'
    if (path.includes('/archived')) return 'Archived Conversations'
    if (path.includes('/application')) return 'Application Conversations'
    if (path.includes('/contract')) return 'Contract Conversations'
    if (path.includes('/support')) return 'Support Conversations'
    
    return 'Conversations'
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setViewMode('details')
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
    setViewMode('list')
    setNewMessage('')
    // Clear the URL parameter
    if (conversationIdFromUrl) {
      window.history.replaceState({}, '', location.pathname)
    }
  }

  const handleSendMessage = async () => {
    if (!selectedConversation?.id || !newMessage.trim() || sendingMessage) return

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        content: newMessage.trim(),
        type: 'text'
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageSenderColor = (message: Message) => {
    if (message.type === 'system') return 'text-gray-500'
    return 'text-gray-900'
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Show loading state when loading conversation from URL
  if (loadingConversation && conversationIdFromUrl) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (viewMode === 'details' && selectedConversation) {
    return (
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Conversations
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Conversation Details</h1>
            <p className="text-gray-600">
              {selectedConversation.seekerName} & {selectedConversation.helperName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={selectedConversation.type === 'application' ? 'default' : 'secondary'}
              className={`bg-${selectedConversation.typeBadgeColor}-100 text-${selectedConversation.typeBadgeColor}-800`}
            >
              {selectedConversation.type}
            </Badge>
            <Badge 
              variant={selectedConversation.status === 'active' ? 'default' : 'secondary'}
              className={`bg-${selectedConversation.statusBadgeColor}-100 text-${selectedConversation.statusBadgeColor}-800`}
            >
              {selectedConversation.status}
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex gap-6">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : messagesData?.messages && messagesData.messages.length > 0 ? (
                    <>
                      {[...messagesData.messages].reverse().map((message) => (
                        <div key={message.id} className="flex flex-col">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium">
                                {message.senderName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-medium ${getMessageSenderColor(message)}`}>
                                  {message.senderName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatMessageTime(message.createdAt)}
                                </span>
                                {message.type !== 'text' && (
                                  <Badge variant="outline" className="text-xs">
                                    {message.type}
                                  </Badge>
                                )}
                                {message.isEdited && (
                                  <span className="text-xs text-gray-400">(edited)</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-700">
                                {message.formattedContent}
                              </div>
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs text-blue-600">
                                      <DocumentTextIcon className="h-4 w-4" />
                                      <span>{attachment.name}</span>
                                      <span className="text-gray-400">({attachment.size})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <div className="text-center">
                        <ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 mb-2" />
                        <p>No messages yet</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="self-end"
                    >
                      {sendingMessage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <PaperAirplaneIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {/* Conversation Info */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="font-medium capitalize">{selectedConversation.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="font-medium capitalize">{selectedConversation.status}</p>
                </div>
                {selectedConversation.subject && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Subject</label>
                    <p className="font-medium">{selectedConversation.subject}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="font-medium">{new Date(selectedConversation.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedConversation.lastMessageAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Activity</label>
                    <p className="font-medium">{new Date(selectedConversation.lastMessageAt).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {selectedConversation.seekerAvatar ? (
                    <img
                      src={selectedConversation.seekerAvatar}
                      alt={selectedConversation.seekerName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {selectedConversation.seekerName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{selectedConversation.seekerName}</p>
                    <p className="text-sm text-gray-500">Employer</p>
                    <p className="text-xs text-gray-400">{selectedConversation.seekerEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {selectedConversation.helperAvatar ? (
                    <img
                      src={selectedConversation.helperAvatar}
                      alt={selectedConversation.helperName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        {selectedConversation.helperName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{selectedConversation.helperName}</p>
                    <p className="text-sm text-gray-500">Helper</p>
                    <p className="text-xs text-gray-400">{selectedConversation.helperEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Information */}
            {(selectedConversation.jobTitle || selectedConversation.contractNumber) && (
              <Card>
                <CardHeader>
                  <CardTitle>Related</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedConversation.jobTitle && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Job</label>
                      <p className="font-medium">{selectedConversation.jobTitle}</p>
                    </div>
                  )}
                  {selectedConversation.contractNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contract</label>
                      <p className="font-medium">{selectedConversation.contractNumber}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <p className="text-gray-600">View and manage platform conversations</p>
        </div>
      </div>

      {/* Conversations Table */}
      <ConversationsTable 
        defaultFilters={defaultFilters}
        onConversationSelect={handleConversationSelect}
      />
    </div>
  )
}