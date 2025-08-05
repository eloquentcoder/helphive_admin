import { useState } from 'react'
import { 
  ChevronDownIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ShieldCheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetUsersQuery, useUpdateUserStatusMutation, useUpdateUserVerificationMutation, useBulkUpdateUsersMutation, type User, type UsersFilter } from '../apis/usersApi'

interface UserTableProps {
  onUserSelect?: (user: User) => void
  onUserEdit?: (user: User) => void
  onUserDelete?: (user: User) => void
  defaultFilters?: Partial<UsersFilter>
}

export const UserTable = ({ onUserSelect, onUserEdit, onUserDelete, defaultFilters }: UserTableProps) => {
  const [filters, setFilters] = useState<UsersFilter>({
    page: 1,
    limit: 20,
    sortBy: 'registrationDate',
    sortOrder: 'desc',
    ...defaultFilters
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const { data: usersData, isLoading, error } = useGetUsersQuery(filters)
  const [updateUserStatus] = useUpdateUserStatusMutation()
  const [updateUserVerification] = useUpdateUserVerificationMutation()
  const [bulkUpdateUsers] = useBulkUpdateUsersMutation()

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleFilterChange = (key: keyof UsersFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUsers(prev => 
      selected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedUsers(selected ? (usersData?.users.map(u => u.id) || []) : [])
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return
    
    try {
      await bulkUpdateUsers({
        userIds: selectedUsers,
        action: action as any
      }).unwrap()
      setSelectedUsers([])
    } catch (error) {
      console.error('Bulk action failed:', error)
    }
  }

  const handleStatusChange = async (user: User, newStatus: User['status']) => {
    try {
      await updateUserStatus({ id: user.id, status: newStatus }).unwrap()
    } catch (error) {
      console.error('Status update failed:', error)
    }
  }

  const handleVerificationToggle = async (user: User) => {
    try {
      await updateUserVerification({ id: user.id, verified: !user.verified }).unwrap()
    } catch (error) {
      console.error('Verification update failed:', error)
    }
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
      case 'seeker': return 'default'
      default: return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Users...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load users. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Users Management
            <Badge variant="secondary">{usersData?.totalCount || 0}</Badge>
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10 w-full sm:w-64"
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <Select value={filters.role?.[0] || 'all'} onValueChange={(value) => handleFilterChange('role', value === 'all' ? undefined : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="helper">Helper</SelectItem>
                <SelectItem value="seeker">Seeker</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status?.[0] || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : [value])}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.verified?.toString() || 'all'} onValueChange={(value) => handleFilterChange('verified', value === 'all' ? undefined : value === 'true')}>
              <SelectTrigger>
                <SelectValue placeholder="Verification status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortBy || 'registrationDate'} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registrationDate">Registration Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="totalJobs">Total Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('verify')}>
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Verify
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                Suspend
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">
                  <Checkbox
                    checked={selectedUsers.length === usersData?.users.length && usersData?.users.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('name')}>
                  User
                  <ChevronDownIcon className="h-4 w-4 inline ml-1" />
                </th>
                <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('role')}>
                  Role
                  <ChevronDownIcon className="h-4 w-4 inline ml-1" />
                </th>
                <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>
                  Status
                  <ChevronDownIcon className="h-4 w-4 inline ml-1" />
                </th>
                <th className="text-left p-3">Verification</th>
                <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('totalJobs')}>
                  Jobs
                  <ChevronDownIcon className="h-4 w-4 inline ml-1" />
                </th>
                <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('rating')}>
                  Rating
                  <ChevronDownIcon className="h-4 w-4 inline ml-1" />
                </th>
                <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('registrationDate')}>
                  Joined
                  <ChevronDownIcon className="h-4 w-4 inline ml-1" />
                </th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData?.users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Select value={user.status} onValueChange={(value) => handleStatusChange(user, value as User['status'])}>
                      <SelectTrigger className="w-32">
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleVerificationToggle(user)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        user.verified
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {user.verified ? (
                        <>
                          <CheckIcon className="h-3 w-3" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XMarkIcon className="h-3 w-3" />
                          Unverified
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div>{user.totalJobs} total</div>
                      <div className="text-gray-500">{user.completedJobs} completed</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{user.rating.toFixed(1)}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUserSelect?.(user)}
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUserEdit?.(user)}
                        title="Edit User"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUserDelete?.(user)}
                        title="Delete User"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {usersData && usersData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((usersData.currentPage - 1) * (filters.limit || 20)) + 1} to{' '}
              {Math.min(usersData.currentPage * (filters.limit || 20), usersData.totalCount)} of{' '}
              {usersData.totalCount} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!usersData.hasPreviousPage}
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!usersData.hasNextPage}
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}