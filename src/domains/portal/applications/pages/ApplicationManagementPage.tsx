import { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ApplicationTable } from '../components/ApplicationTable'
import { type Application, type ApplicationFilters, useGetApplicationQuery } from '../apis/applicationsApi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { 
  UserIcon,
  ClockIcon,
  StarIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

type ViewMode = 'list' | 'details'

export function ApplicationManagementPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  
  // Check if we need to load a specific application from URL
  const applicationIdFromUrl = searchParams.get('view')
  const { data: applicationFromUrl, isLoading: loadingApplication } = useGetApplicationQuery(
    applicationIdFromUrl || '', 
    { skip: !applicationIdFromUrl }
  )
  
  // Load application from URL if present
  useEffect(() => {
    if (applicationFromUrl) {
      setSelectedApplication(applicationFromUrl)
      setViewMode('details')
    }
  }, [applicationFromUrl])

  // Determine filters based on current route
  const getDefaultFilters = (): Partial<ApplicationFilters> => {
    const path = location.pathname
    
    if (path.includes('/pending')) {
      return { status: ['pending'] }
    } else if (path.includes('/accepted')) {
      return { status: ['accepted'] }
    } else if (path.includes('/rejected')) {
      return { status: ['rejected'] }
    } else if (path.includes('/withdrawn')) {
      return { status: ['withdrawn'] }
    }
    
    return {}
  }

  // Get page title based on current route
  const getPageTitle = (): string => {
    const path = location.pathname
    
    if (path.includes('/pending')) return 'Pending Applications'
    if (path.includes('/accepted')) return 'Accepted Applications'
    if (path.includes('/rejected')) return 'Rejected Applications'
    if (path.includes('/withdrawn')) return 'Withdrawn Applications'
    
    return 'Job Applications'
  }

  const handleApplicationSelect = (application: Application) => {
    setSelectedApplication(application)
    setViewMode('details')
  }

  const handleBackToList = () => {
    setSelectedApplication(null)
    setViewMode('list')
    // Clear the URL parameter
    if (applicationIdFromUrl) {
      window.history.replaceState({}, '', location.pathname)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'yellow' },
      accepted: { label: 'Accepted', color: 'green' },
      rejected: { label: 'Rejected', color: 'red' },
      cancelled: { label: 'Cancelled', color: 'gray' },
      withdrawn: { label: 'Withdrawn', color: 'orange' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'gray' }
    
    return (
      <Badge 
        variant={status === 'accepted' ? 'default' : 'secondary'}
        className={`bg-${config.color}-100 text-${config.color}-800`}
      >
        {config.label}
      </Badge>
    )
  }

  // Show loading state when loading application from URL
  if (loadingApplication && applicationIdFromUrl) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (viewMode === 'details' && selectedApplication) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Application Details</h1>
            <p className="text-gray-600">Application #{selectedApplication.id}</p>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Application Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Job Title</label>
                    <p className="font-medium">{selectedApplication.jobTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Helper Name</label>
                    <p className="font-medium">{selectedApplication.helperName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employer</label>
                    <p className="font-medium">{selectedApplication.employerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="font-medium">{selectedApplication.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Work Type</label>
                    <p className="font-medium">{selectedApplication.workType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Applied Date</label>
                    <p className="font-medium">{new Date(selectedApplication.appliedAt).toLocaleDateString()}</p>
                  </div>
                  {selectedApplication.reviewedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reviewed Date</label>
                      <p className="font-medium">{new Date(selectedApplication.reviewedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{selectedApplication.coverLetter}</p>
                </CardContent>
              </Card>
            )}

            {/* Custom Answers */}
            {selectedApplication.customAnswers && Object.keys(selectedApplication.customAnswers).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedApplication.customAnswers).map(([question, answer]) => (
                    <div key={question}>
                      <label className="text-sm font-medium text-gray-500">{question}</label>
                      <p className="mt-1">{String(answer)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Helper Information */}
            <Card>
              <CardHeader>
                <CardTitle>Helper Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {selectedApplication.helperAvatar ? (
                    <img 
                      src={selectedApplication.helperAvatar} 
                      alt={selectedApplication.helperName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">{selectedApplication.helperName}</p>
                    <p className="text-sm text-gray-500">Helper</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedApplication.helperEmail}</span>
                  </div>
                  {selectedApplication.helperPhone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedApplication.helperPhone}</span>
                    </div>
                  )}
                </div>

                {selectedApplication.averageRating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Rating</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{selectedApplication.averageRating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({selectedApplication.totalReviews})</span>
                    </div>
                  </div>
                )}

                {selectedApplication.completedJobs !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Completed Jobs</span>
                    <span className="font-medium">{selectedApplication.completedJobs}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Verification</span>
                  <Badge 
                    variant={selectedApplication.verificationStatus === 'verified' ? 'default' : 'secondary'}
                    className={
                      selectedApplication.verificationStatus === 'verified' 
                        ? 'bg-green-100 text-green-800'
                        : selectedApplication.verificationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {selectedApplication.verificationStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Perfect Match */}
            {selectedApplication.isPerfectMatch && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    Perfect Match
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    This helper is identified as a perfect match for this job based on skills, experience, and preferences.
                  </p>
                  {selectedApplication.matchScore && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Match Score: </span>
                      <span className="font-medium">{selectedApplication.matchScore}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Response Time */}
            {selectedApplication.responseTime && (
              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedApplication.responseTime}</span>
                  </div>
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
          <p className="text-gray-600">Manage job applications and helper responses</p>
        </div>
      </div>

      {/* Application Table */}
      <ApplicationTable 
        defaultFilters={getDefaultFilters()}
        onApplicationSelect={handleApplicationSelect}
      />
    </div>
  )
}