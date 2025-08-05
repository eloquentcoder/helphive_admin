import React, { useState, useMemo, useEffect } from 'react'
import { 
  useGetConversationsQuery,
  type Conversation,
  type ConversationFilters 
} from '../apis/conversationsApi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Input } from '../../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../../components/ui/table'
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface ConversationsTableProps {
  defaultFilters?: Partial<ConversationFilters>
  onConversationSelect?: (conversation: Conversation) => void
}

export function ConversationsTable({ 
  defaultFilters = {}, 
  onConversationSelect 
}: ConversationsTableProps) {
  const [filters, setFilters] = useState<ConversationFilters>({
    page: 1,
    limit: 20,
    sortBy: 'lastMessageAt',
    sortOrder: 'desc',
    ...defaultFilters
  })

  const { data, isLoading, error } = useGetConversationsQuery(filters)

  // Update filters when defaultFilters change (e.g., route change)
  useEffect(() => {
    setFilters(prev => ({
      page: 1,
      limit: 20,
      sortBy: 'lastMessageAt',
      sortOrder: 'desc',
      ...defaultFilters
    }))
  }, [defaultFilters])

  const typeOptions = [
    { value: 'application', label: 'Application', color: 'blue' },
    { value: 'contract', label: 'Contract', color: 'green' },
    { value: 'support', label: 'Support', color: 'yellow' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'gray' },
    { value: 'archived', label: 'Archived', color: 'blue' }
  ]

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({ 
      ...prev, 
      type: type === 'all' ? undefined : [type],
      page: 1 
    }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : [status],
      page: 1 
    }))
  }

  const handleUnreadFilter = (hasUnread: string) => {
    setFilters(prev => ({ 
      ...prev, 
      hasUnread: hasUnread === 'true' ? true : hasUnread === 'false' ? false : undefined,
      page: 1 
    }))
  }

  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const getTypeBadge = (type: string) => {
    const typeOption = typeOptions.find(option => option.value === type)
    return (
      <Badge 
        variant={type === 'application' ? 'default' : 'secondary'}
        className={`bg-${typeOption?.color}-100 text-${typeOption?.color}-800`}
      >
        {typeOption?.label || type}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return (
      <Badge 
        variant={status === 'active' ? 'default' : 'secondary'}
        className={`bg-${statusOption?.color}-100 text-${statusOption?.color}-800`}
      >
        {statusOption?.label || status}
      </Badge>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading conversations. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations by participants, job title, or content..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select 
                value={filters.type?.[0] || 'all'} 
                onValueChange={handleTypeFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {typeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filters.status?.[0] || 'all'} 
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.hasUnread === true ? 'true' : filters.hasUnread === false ? 'false' : 'all'} 
                onValueChange={handleUnreadFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Read Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Unread</SelectItem>
                  <SelectItem value="false">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('participants')}
                >
                  Participants
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Related</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('lastMessageAt')}
                >
                  Last Message
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.conversations.map((conversation) => (
                <TableRow key={conversation.id} className={conversation.hasUnreadForAdmin ? 'bg-blue-50' : ''}>
                  <TableCell>
                    {conversation.hasUnreadForAdmin && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {conversation.seekerAvatar ? (
                          <img
                            src={conversation.seekerAvatar}
                            alt={conversation.seekerName}
                            className="h-8 w-8 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {conversation.seekerName.charAt(0)}
                            </span>
                          </div>
                        )}
                        {conversation.helperAvatar ? (
                          <img
                            src={conversation.helperAvatar}
                            alt={conversation.helperName}
                            className="h-8 w-8 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-green-600">
                              {conversation.helperName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {conversation.seekerName} & {conversation.helperName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {conversation.seekerEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(conversation.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(conversation.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {conversation.jobTitle && (
                        <p className="font-medium">{conversation.jobTitle}</p>
                      )}
                      {conversation.contractNumber && (
                        <p className="text-gray-500">Contract: {conversation.contractNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate max-w-48">
                          {conversation.lastMessageUserName}: {conversation.lastMessage}
                        </p>
                      )}
                      {conversation.lastMessageAt && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3" />
                          {formatTimeAgo(conversation.lastMessageAt)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(conversation.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConversationSelect?.(conversation)}
                        className="flex items-center gap-2"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        View
                      </Button>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(!data?.conversations || data.conversations.length === 0) && (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No conversations found</p>
              <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-600">
              Showing {((data.currentPage - 1) * (filters.limit || 20)) + 1} to{' '}
              {Math.min(data.currentPage * (filters.limit || 20), data.totalCount)} of{' '}
              {data.totalCount} conversations
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.currentPage - 1)}
                disabled={!data.hasPreviousPage}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {data.currentPage} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(data.currentPage + 1)}
                disabled={!data.hasNextPage}
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}