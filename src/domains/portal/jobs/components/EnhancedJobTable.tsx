import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  ClockIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  useGetJobsQuery, 
  useUpdateJobStatusMutation, 
  useBulkUpdateJobsMutation, 
  type Job, 
  type JobsFilter 
} from '../apis/jobsApi'

interface JobTableProps {
  onJobSelect?: (job: Job) => void
  onJobEdit?: (job: Job) => void
  onJobDelete?: (job: Job) => void
  defaultFilters?: Partial<JobsFilter>
}

export const JobTable = ({ onJobSelect, onJobEdit, onJobDelete, defaultFilters }: JobTableProps) => {
  const [filters, setFilters] = useState<JobsFilter>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...defaultFilters
  })
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data: jobsData, isLoading, error } = useGetJobsQuery(filters)
  const [updateJobStatus] = useUpdateJobStatusMutation()
  const [bulkUpdateJobs] = useBulkUpdateJobsMutation()


  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleFilterChange = (key: keyof JobsFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectJob = (jobId: string, checked: boolean) => {
    setSelectedJobs(prev => 
      checked 
        ? [...prev, jobId]
        : prev.filter(id => id !== jobId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedJobs(checked ? (jobsData?.jobs.map(job => job.id) || []) : [])
  }

  const handleStatusUpdate = async (jobId: string, status: Job['status'], reason?: string) => {
    try {
      await updateJobStatus({ id: jobId, status, reason }).unwrap()
    } catch (error) {
      console.error('Failed to update job status:', error)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedJobs.length === 0) return
    
    try {
      await bulkUpdateJobs({ 
        jobIds: selectedJobs, 
        action: action as any,
        reason: `Bulk ${action} by admin`
      }).unwrap()
      setSelectedJobs([])
    } catch (error) {
      console.error('Failed to perform bulk action:', error)
    }
  }

  const getStatusBadgeVariant = (status: Job['status']) => {
    switch (status) {
      case 'published': return { variant: 'default' as const, color: 'bg-green-100 text-green-800 border-green-200' }
      case 'draft': return { variant: 'secondary' as const, color: 'bg-orange-100 text-orange-800 border-orange-200' }
      case 'paused': return { variant: 'outline' as const, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
      case 'stopped': return { variant: 'destructive' as const, color: 'bg-red-100 text-red-800 border-red-200' }
      case 'expired': return { variant: 'destructive' as const, color: 'bg-gray-100 text-gray-800 border-gray-200' }
      default: return { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  }

  const getWorkTypeBadgeVariant = (workType: Job['workType']) => {
    switch (workType) {
      case 'live_in': return { variant: 'default' as const, color: 'bg-blue-100 text-blue-800 border-blue-200' }
      case 'come_and_go': return { variant: 'secondary' as const, color: 'bg-purple-100 text-purple-800 border-purple-200' }
      default: return { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  }

  const formatSalaryRange = (salaryRange: Job['salaryRange']) => {
    return `${salaryRange.min.toLocaleString()}-${salaryRange.max.toLocaleString()} ${salaryRange.currency}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return formatDate(dateString)
  }

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-6 w-6 bg-blue-500 rounded"
              />
              Loading Jobs...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  className="h-20 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircleIcon className="h-5 w-5" />
              Error Loading Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">Failed to load job data. Please try again.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const jobs = jobsData?.jobs || []
  const totalCount = jobsData?.totalCount || 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative group">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          <Input
            placeholder="Search jobs by title, category, or employer..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 hover:bg-gray-50 border-gray-200 transition-all duration-200"
        >
          <FunnelIcon className="h-4 w-4" />
          Filters
          {showFilters && <div className="w-2 h-2 bg-blue-500 rounded-full ml-1" />}
        </Button>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={filters.status?.[0] || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : [value])}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="stopped">Stopped</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.workType?.[0] || 'all'} onValueChange={(value) => handleFilterChange('workType', value === 'all' ? undefined : [value])}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Filter by work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Work Types</SelectItem>
                      <SelectItem value="live_in">Live-In</SelectItem>
                      <SelectItem value="come_and_go">Come and Go</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={Array.isArray(filters.category) ? filters.category[0] || 'all' : filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : [value])}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="housekeeping">Housekeeping</SelectItem>
                      <SelectItem value="childcare">Childcare</SelectItem>
                      <SelectItem value="eldercare">Eldercare</SelectItem>
                      <SelectItem value="cooking">Cooking</SelectItem>
                      <SelectItem value="gardening">Gardening</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.sortBy || 'createdAt'} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                      <SelectItem value="publishedAt">Date Published</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="salaryRange">Salary</SelectItem>
                      <SelectItem value="applicationCount">Applications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {selectedJobs.length} job(s) selected
              </span>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')} className="hover:bg-green-50 border-green-200">
                <PlayIcon className="h-4 w-4 mr-1" />
                Publish
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('pause')} className="hover:bg-yellow-50 border-yellow-200">
                <PauseIcon className="h-4 w-4 mr-1" />
                Pause
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')} className="hover:bg-red-50 border-red-200 text-red-600">
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jobs Grid/List */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <>
              {/* Table Header */}
              <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100/50">
                <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1 flex items-center">
                    <Checkbox
                      checked={selectedJobs.length === jobs.length && jobs.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                  <div className="col-span-3 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('title')}>
                    Job Details
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                  <div className="col-span-2">Category & Type</div>
                  <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('salaryRange')}>
                    Salary & Duration
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('applicationCount')}>
                    Stats
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                  <div className="col-span-1 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('createdAt')}>
                    Created
                    <ArrowsUpDownIcon className="h-3 w-3" />
                  </div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {jobs.map((job, index) => {
                    const statusBadge = getStatusBadgeVariant(job.status)
                    const workTypeBadge = getWorkTypeBadgeVariant(job.workType)
                    
                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        className="grid grid-cols-12 gap-4 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                        onClick={() => onJobSelect?.(job)}
                      >
                        {/* Checkbox */}
                        <div className="col-span-1 flex items-center">
                          <Checkbox
                            checked={selectedJobs.includes(job.id)}
                            onCheckedChange={(checked) => handleSelectJob(job.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {/* Job Details */}
                        <div className="col-span-3 space-y-2">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {job.summary.replace(/<[^>]*>/g, '').substring(0, 120)}...
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                                {job.employerName.charAt(0).toUpperCase()}
                              </div>
                              {job.employerName}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-3 w-3" />
                              {job.employerLocation}
                            </div>
                          </div>
                        </div>

                        {/* Category & Type */}
                        <div className="col-span-2 space-y-2">
                          <Badge className={`${workTypeBadge.color} font-medium`}>
                            {job.workType === 'live_in' ? 'Live-In' : 'Come & Go'}
                          </Badge>
                          <div className="text-sm text-gray-600 capitalize">{job.category}</div>
                        </div>

                        {/* Salary & Duration */}
                        <div className="col-span-2 space-y-2">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                            <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                            {formatSalaryRange(job.salaryRange)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3" />
                            {job.duration}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                          <Badge className={`${statusBadge.color} font-medium`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Stats */}
                        <div className="col-span-1 space-y-1">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <UserGroupIcon className="h-3 w-3 text-blue-500" />
                            {job.applicationCount}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <EyeIcon className="h-3 w-3" />
                            {job.viewCount}
                          </div>
                        </div>

                        {/* Created */}
                        <div className="col-span-1">
                          <div className="text-xs text-gray-500">
                            {formatTimeAgo(job.createdAt)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                onJobSelect?.(job)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={(e) => e.stopPropagation()}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                                >
                                  <EllipsisVerticalIcon className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Job Actions</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start hover:bg-blue-50"
                                    onClick={() => onJobSelect?.(job)}
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start hover:bg-green-50"
                                    onClick={() => onJobEdit?.(job)}
                                  >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Edit Job
                                  </Button>
                                  {job.status === 'published' && (
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start hover:bg-yellow-50"
                                      onClick={() => handleStatusUpdate(job.id, 'paused')}
                                    >
                                      <PauseIcon className="h-4 w-4 mr-2" />
                                      Pause Job
                                    </Button>
                                  )}
                                  {job.status === 'paused' && (
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start hover:bg-green-50"
                                      onClick={() => handleStatusUpdate(job.id, 'published')}
                                    >
                                      <PlayIcon className="h-4 w-4 mr-2" />
                                      Resume Job
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start hover:bg-orange-50"
                                    onClick={() => handleStatusUpdate(job.id, 'stopped')}
                                  >
                                    <StopIcon className="h-4 w-4 mr-2" />
                                    Stop Job
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={() => onJobDelete?.(job)}
                                  >
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete Job
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Pagination */}
          {totalCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-6 border-t bg-gradient-to-r from-gray-50 to-white"
            >
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + 1}</span> to{' '}
                <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), totalCount)}</span> of{' '}
                <span className="font-medium">{totalCount.toLocaleString()}</span> jobs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!jobsData?.hasPreviousPage}
                  onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                  className="hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                    {filters.page || 1}
                  </span>
                  <span className="text-sm text-gray-500">of {jobsData?.totalPages || 1}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!jobsData?.hasNextPage}
                  onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  className="hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}