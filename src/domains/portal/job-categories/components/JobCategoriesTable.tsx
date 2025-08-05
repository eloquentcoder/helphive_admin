import { useState, useEffect } from 'react'
import { 
  type JobCategory, 
  type JobCategoryFilters,
  useGetJobCategoriesQuery,
  useDeleteJobCategoryMutation,
  useUpdateJobCategoryMutation
} from '../apis/jobCategoriesApi'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TagIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'

interface JobCategoriesTableProps {
  defaultFilters?: Partial<JobCategoryFilters>
  onCategorySelect?: (category: JobCategory) => void
  showCreateButton?: boolean
}

export function JobCategoriesTable({ 
  defaultFilters = {}, 
  onCategorySelect,
  showCreateButton = true 
}: JobCategoriesTableProps) {
  const [filters, setFilters] = useState<JobCategoryFilters>({
    page: 1,
    limit: 20,
    sortBy: 'sortOrder',
    sortOrder: 'asc',
    ...defaultFilters
  })
  

  const { data, isLoading, error } = useGetJobCategoriesQuery(filters)
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteJobCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateJobCategoryMutation()

  // Update filters when defaultFilters change (e.g., route change)
  useEffect(() => {
    setFilters(() => ({
      page: 1,
      limit: 20,
      sortBy: 'sortOrder',
      sortOrder: 'asc',
      ...defaultFilters
    }))
  }, [defaultFilters])

  const handleFilterChange = (key: keyof JobCategoryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when filtering
    }))
  }

  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm)
  }

  const handleDelete = async (category: JobCategory) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(category.id).unwrap()
      } catch (error) {
        console.error('Failed to delete category:', error)
        alert('Failed to delete category. It may have job postings or subcategories.')
      }
    }
  }

  const handleToggleStatus = async (category: JobCategory) => {
    try {
      await updateCategory({
        id: category.id,
        isActive: !category.isActive
      }).unwrap()
    } catch (error) {
      console.error('Failed to update category status:', error)
      alert('Failed to update category status.')
    }
  }

  const handleEdit = (category: JobCategory) => {
    // TODO: Implement edit functionality
    console.log('Edit category:', category)
  }

  const handleView = (category: JobCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    } else {
      // Could show details modal here
      console.log('View category:', category)
    }
  }

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  )

  const getTypeBadge = (category: JobCategory) => {
    if (category.parentId) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <TagIcon className="h-3 w-3" />
          Subcategory
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <FolderIcon className="h-3 w-3" />
        Parent
      </Badge>
    )
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading categories</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Job Categories</span>
            {showCreateButton && (
              <Button 
                onClick={() => console.log('Create category clicked')}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Category
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type || 'all'}
              onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="parent">Parent Categories</SelectItem>
                <SelectItem value="subcategory">Subcategories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.icon && (
                          <div 
                            className="w-8 h-8 rounded flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: category.color || '#6B7280' }}
                          >
                            {category.icon}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(category)}
                    </TableCell>
                    <TableCell>
                      {category.parentName || '-'}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStatus(category)}
                        disabled={isUpdating}
                        className="cursor-pointer"
                      >
                        {getStatusBadge(category.isActive)}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.jobPostingsCount} jobs
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {category.sortOrder}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(category)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          disabled={isDeleting || category.hasChildren || category.jobPostingsCount > 0}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {data?.categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((filters.page || 1) - 1) * (filters.limit || 20) + 1} to{' '}
            {Math.min((filters.page || 1) * (filters.limit || 20), data.totalCount)} of{' '}
            {data.totalCount} categories
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
              disabled={!data.hasPreviousPage}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
              disabled={!data.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}