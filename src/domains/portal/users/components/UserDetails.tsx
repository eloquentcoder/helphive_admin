import { useState } from 'react'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  
  StarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DocumentIcon,
  ClockIcon,
  ChartBarIcon,
  
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

import { 
  useGetUserQuery,
  useGetUserActivityQuery,
  type User 
} from '../apis/usersApi'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface UserDetailsProps {
  userId: string
  onClose?: () => void
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
}

export const UserDetails = ({ userId, onClose, onEdit, onDelete }: UserDetailsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'documents' | 'statistics'>('overview')
  
  const { data: user, isLoading: userLoading } = useGetUserQuery(userId)
  const { data: activityData, isLoading: activityLoading } = useGetUserActivityQuery({ userId })
  
  // Mock data for documents since this endpoint doesn't exist yet
  const documents = [
    { id: '1', name: 'ID Document', uploadedAt: new Date().toISOString(), verified: true },
    { id: '2', name: 'Address Proof', uploadedAt: new Date().toISOString(), verified: false }
  ]
  const documentsLoading = false
  
  const activity = activityData?.activities || []

  if (userLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found</p>
      </div>
    )
  }

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'active': return 'default'
      case 'pending': return 'secondary'
      case 'suspended': return 'destructive'
      case 'banned': return 'destructive'
      default: return 'secondary'
    }
  }

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'helper': return 'default'
      case 'seeker': return 'secondary'
      default: return 'secondary'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'activity', label: 'Activity', icon: ClockIcon },
    { id: 'documents', label: 'Documents', icon: DocumentIcon },
    { id: 'statistics', label: 'Statistics', icon: ChartBarIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <h2 className="text-2xl font-bold">User Details</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit?.(user)}>
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-500" />
                )}
              </div>
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {user.status}
                </Badge>
                {user.verified && (
                  <Badge variant="outline" className="text-green-700 border-green-700">
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{user.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Jobs</p>
                  <p className="font-semibold">{user.totalJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Jobs</p>
                  <p className="font-semibold">{user.completedJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{user.location || user.address || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p>{new Date(user.registrationDate).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Active</p>
                    <p>{user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p>${user.earnings?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills/Services */}
            {user.skills && user.skills.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Skills/Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {user.documents && user.documents.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="font-medium">{doc.type}</span>
                        <Badge variant={doc.status === 'approved' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : activity && activity.length > 0 ? (
                <div className="space-y-4">
                  {activity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        item.type === 'login' ? 'bg-green-500' :
                        item.type === 'job_completed' ? 'bg-blue-500' :
                        item.type === 'payment' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-grow">
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <DocumentIcon className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={doc.verified ? 'default' : 'secondary'}>
                        {doc.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'statistics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Job Completion Rate</span>
                      <span className="text-sm font-medium">
                        {user.completedJobs && user.totalJobs 
                          ? Math.round((user.completedJobs / user.totalJobs) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${user.completedJobs && user.totalJobs 
                            ? (user.completedJobs / user.totalJobs) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm font-medium">{user.stats?.responseTime || 0} min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Earnings</span>
                    <span className="font-semibold">${user.stats?.totalEarnings?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold">${user.stats?.totalSpent?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews Received</span>
                    <span className="font-semibold">{user.stats?.reviewsReceived || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete?.(user)
                setShowDeleteConfirm(false)
              }}
            >
              Delete User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}