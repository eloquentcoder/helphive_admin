import { useState } from 'react'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EyeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  useGetJobQuery,
  useGetJobApplicationsQuery,
  useUpdateJobStatusMutation,
  type Job,
  type JobApplication
} from '../apis/jobsApi'

interface JobDetailsProps {
  jobId: string
  onClose: () => void
  onEdit?: (job: Job) => void
  onDelete?: (job: Job) => void
}

export const JobDetails = ({ jobId, onClose, onEdit, onDelete }: JobDetailsProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  
  const { data: job, isLoading: jobLoading } = useGetJobQuery(jobId)
  const { data: applicationsData, isLoading: applicationsLoading } = useGetJobApplicationsQuery({ 
    jobId, 
    page: 1, 
    limit: 50 
  })
  const [updateJobStatus] = useUpdateJobStatusMutation()

  const handleStatusUpdate = async (status: Job['status'], reason?: string) => {
    if (!job) return
    
    try {
      await updateJobStatus({ id: job.id, status, reason }).unwrap()
    } catch (error) {
      console.error('Failed to update job status:', error)
    }
  }

  const getStatusBadgeVariant = (status: Job['status']) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      case 'paused': return 'outline'
      case 'stopped': return 'destructive'
      case 'expired': return 'destructive'
      default: return 'secondary'
    }
  }

  const getApplicationStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied': return { variant: 'secondary' as const, label: 'Applied' }
      case 'viewed': return { variant: 'outline' as const, label: 'Viewed' }
      case 'contacted': return { variant: 'default' as const, label: 'Contacted' }
      case 'meeting_requested': return { variant: 'default' as const, label: 'Meeting Requested' }
      case 'meeting_scheduled': return { variant: 'default' as const, label: 'Meeting Scheduled' }
      case 'contract_offered': return { variant: 'default' as const, label: 'Contract Offered' }
      case 'contract_accepted': return { variant: 'default' as const, label: 'Contract Accepted' }
      case 'contract_declined': return { variant: 'destructive' as const, label: 'Contract Declined' }
      case 'hired': return { variant: 'default' as const, label: 'Hired' }
      default: return { variant: 'secondary' as const, label: status }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatSalaryRange = (salaryRange: Job['salaryRange']) => {
    return `${salaryRange.min}-${salaryRange.max} ${salaryRange.currency}`
  }

  if (jobLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg">Job not found</div>
        <Button variant="outline" onClick={onClose} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const applications = applicationsData?.applications || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">by {job.employerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(job.status)}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
          <Button variant="outline" onClick={() => onEdit?.(job)}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Job Actions</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {job.status === 'published' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleStatusUpdate('paused')}
                  >
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Pause Job
                  </Button>
                )}
                {job.status === 'paused' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleStatusUpdate('published')}
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Resume Job
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate('stopped')}
                >
                  <StopIcon className="h-4 w-4 mr-2" />
                  Stop Job
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => onDelete?.(job)}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">
                Applications ({applications.length})
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: job.summary }} />
                  </div>
                </CardContent>
              </Card>

              {/* Requirements & Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="mt-1">{job.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Work Type</label>
                      <p className="mt-1">
                        {job.workType === 'live_in' ? 'Live-In' : 'Come and Go'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Preferred Age Range</label>
                      <p className="mt-1">
                        {job.preferredAgeRange.min} - {job.preferredAgeRange.max} years
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Duration</label>
                      <p className="mt-1">{job.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Questions */}
              {job.customQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {job.customQuestions.map((question, index) => (
                        <div key={question.id} className="border-l-4 border-gray-200 pl-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Q{index + 1}:</span>
                            {question.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm">{question.question}</p>
                          {question.type === 'choice' && question.options && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Options:</span>
                              <ul className="mt-1 text-xs text-gray-600">
                                {question.options.map((option, optIndex) => (
                                  <li key={optIndex}>• {option}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Accommodation Images */}
              {job.workType === 'live_in' && job.accommodationImages && job.accommodationImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Accommodation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {job.accommodationImages.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Accommodation ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              {applicationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : applications.length > 0 ? (
                applications.map((application) => {
                  const statusBadge = getApplicationStatusBadge(application.status)
                  return (
                    <Card key={application.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                              {application.helperAvatar && (
                                <img
                                  src={application.helperAvatar}
                                  alt={application.helperName}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{application.helperName}</h3>
                                {application.isPerfectMatch && (
                                  <Badge variant="default" className="text-xs">Perfect Match</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                Age: {application.helperAge} • {application.helperLocation}
                              </div>
                              <div className="text-sm text-gray-500">
                                Applied on {formatDate(application.appliedAt)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge variant={statusBadge.variant}>
                              {statusBadge.label}
                            </Badge>
                            <div className="text-sm text-gray-500">
                              Rating: {application.helperRating}/5
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = `/jobs/applications?view=${application.id}`}
                              className="mt-2"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                        
                        {/* Application Answers */}
                        {application.answers.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Responses:</h4>
                            <div className="space-y-2">
                              {application.answers.map((answer) => {
                                const question = job.customQuestions.find(q => q.id === answer.questionId)
                                return (
                                  <div key={answer.questionId} className="text-sm">
                                    <span className="text-gray-600">{question?.question}:</span>
                                    <span className="ml-2">{answer.answer}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No applications yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-600">Job created</span>
                      <span className="text-gray-500 ml-auto">{formatDate(job.createdAt)}</span>
                    </div>
                    {job.publishedAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-600">Job published</span>
                        <span className="text-gray-500 ml-auto">{formatDate(job.publishedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-gray-600">Last updated</span>
                      <span className="text-gray-500 ml-auto">{formatDate(job.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Job Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Applications</span>
                </div>
                <span className="font-medium">{job.applicationCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Views</span>
                </div>
                <span className="font-medium">{job.viewCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Salary Range</span>
                </div>
                <span className="font-medium">{formatSalaryRange(job.salaryRange)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-medium">{job.duration}</span>
              </div>
            </CardContent>
          </Card>

          {/* Employer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Employer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="mt-1">{job.employerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <div className="flex items-center gap-1 mt-1">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{job.employerLocation}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Status</span>
                <Badge variant={job.isPaid ? 'default' : 'destructive'}>
                  {job.isPaid ? 'Paid' : 'Unpaid'}
                </Badge>
              </div>
              {job.paymentAmount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Amount Paid</span>
                  <span className="font-medium">{job.paymentAmount} QAR</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}