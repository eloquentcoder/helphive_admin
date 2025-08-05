import React, { useState, useMemo } from 'react'
import { 
  useGetApplicationsQuery,
  type Application,
  type ApplicationFilters 
} from '../apis/applicationsApi'
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
  StarIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

interface ApplicationTableProps {
  defaultFilters?: Partial<ApplicationFilters>
  onApplicationSelect?: (application: Application) => void
  jobId?: string
}

export function ApplicationTable({ 
  defaultFilters = {}, 
  onApplicationSelect,
  jobId 
}: ApplicationTableProps) {
  const [filters, setFilters] = useState<ApplicationFilters>({
    page: 1,
    limit: 20,
    sortBy: 'appliedAt',
    sortOrder: 'desc',
    ...defaultFilters,
    ...(jobId && { jobId })
  })

  const { data, isLoading, error } = useGetApplicationsQuery(filters)

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'accepted', label: 'Accepted', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' },
    { value: 'withdrawn', label: 'Withdrawn', color: 'orange' }
  ]

  const verificationOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'verified', label: 'Verified', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' }
  ]

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : [status],
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

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return (
      <Badge 
        variant={status === 'accepted' ? 'default' : 'secondary'}
        className={`bg-${statusOption?.color}-100 text-${statusOption?.color}-800`}
      >
        {statusOption?.label || status}
      </Badge>
    )
  }

  const getVerificationBadge = (verification: string) => {
    const verificationOption = verificationOptions.find(option => option.value === verification)
    return (
      <Badge 
        variant={verification === 'verified' ? 'default' : 'secondary'}
        className={`bg-${verificationOption?.color}-100 text-${verificationOption?.color}-800`}
      >
        {verificationOption?.label || verification}
      </Badge>
    )
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
          <p className="text-red-500">Error loading applications. Please try again.</p>
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
                  placeholder="Search by helper name, job title, or email..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full lg:w-48">
              <Select 
                value={filters.status?.[0] || 'all'} 
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('helperName')}
                >
                  Helper
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('jobTitle')}
                >
                  Job Title
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Perfect Match</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('appliedAt')}
                >
                  Applied At
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {application.helperAvatar ? (
                        <img 
                          src={application.helperAvatar} 
                          alt={application.helperName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">{application.helperName}</p>
                        <p className="text-sm text-gray-500">{application.helperEmail}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.jobTitle}</p>
                      <p className="text-sm text-gray-500">{application.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(application.status)}
                  </TableCell>
                  <TableCell>
                    {getVerificationBadge(application.verificationStatus)}
                  </TableCell>
                  <TableCell>
                    {application.isPerfectMatch ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <StarIcon className="h-3 w-3 mr-1" />
                        Perfect Match
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {application.averageRating ? (
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{application.averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({application.totalReviews})</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4" />
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApplicationSelect?.(application)}
                      className="flex items-center gap-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(!data?.applications || data.applications.length === 0) && (
            <div className="text-center py-12">
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No applications found</p>
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
              {data.totalCount} applications
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