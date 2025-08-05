import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserTable } from '../components/UserTable'
import { UserDetails } from '../components/UserDetails'
import { UserForm } from '../components/UserForm'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useDeleteUserMutation, type User } from '../apis/usersApi'

type ViewMode = 'list' | 'details' | 'create' | 'edit'

export const UserManagementPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteUser] = useDeleteUserMutation()
  const location = useLocation()

  // Extract the sub-route from the path
  const pathSegments = location.pathname.split('/')
  const subRoute = pathSegments[2] || 'all'

  // Map sub-routes to filter configurations
  const getFilterConfig = () => {
    switch (subRoute) {
      case 'pending':
        return { verified: false, title: 'Pending Verifications' }
      case 'banned':
        return { status: ['banned'], title: 'Banned Users' }
      case 'seekers':
        return { role: ['seeker'], title: 'Seekers' }
      case 'helpers':
        return { role: ['helper'], title: 'Helpers' }
      default:
        return { title: 'All Users' }
    }
  }

  const filterConfig = getFilterConfig()

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setViewMode('details')
  }

  const handleUserEdit = (user: User) => {
    setSelectedUser(user)
    setViewMode('edit')
  }

  const handleUserDelete = async (user: User) => {
    try {
      await deleteUser(user.id).unwrap()
      setViewMode('list')
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleFormSuccess = () => {
    setViewMode('list')
    setSelectedUser(null)
  }

  const handleCancel = () => {
    setViewMode('list')
    setSelectedUser(null)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedUser(null)
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{filterConfig.title}</h1>
              <Button onClick={() => setViewMode('create')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </div>
            <UserTable
              key={subRoute}
              onUserSelect={handleUserSelect}
              onUserEdit={handleUserEdit}
              onUserDelete={handleUserDelete}
              defaultFilters={filterConfig}
            />
          </div>
        )

      case 'details':
        return selectedUser ? (
          <UserDetails
            userId={selectedUser.id}
            onClose={handleBackToList}
            onEdit={handleUserEdit}
            onDelete={handleUserDelete}
          />
        ) : null

      case 'create':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleCancel}>
                ← Back to List
              </Button>
              <h1 className="text-2xl font-bold">Create New User</h1>
            </div>
            <UserForm
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        )

      case 'edit':
        return selectedUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleCancel}>
                ← Back to List
              </Button>
              <h1 className="text-2xl font-bold">Edit User</h1>
            </div>
            <UserForm
              user={selectedUser}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </div>
        ) : null

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto">
      {renderContent()}
    </div>
  )
}