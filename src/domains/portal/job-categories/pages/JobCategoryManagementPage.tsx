import React, { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { JobCategoriesTable } from '../components/JobCategoriesTable'
import { 
  type JobCategory, 
  type JobCategoryFilters,
  useGetCategoryAnalyticsQuery,
  useGetCategoryHierarchyQuery
} from '../apis/jobCategoriesApi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import {
  FolderIcon,
  TagIcon,
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'
import { TreePine } from 'lucide-react'

type ViewMode = 'table' | 'hierarchy' | 'analytics'

export function JobCategoryManagementPage() {
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null)
  const [activeTab, setActiveTab] = useState<ViewMode>('table')

  const { data: analytics } = useGetCategoryAnalyticsQuery()
  const { data: hierarchy } = useGetCategoryHierarchyQuery()

  // Determine filters based on current route
  const defaultFilters = useMemo((): Partial<JobCategoryFilters> => {
    const path = location.pathname
    
    if (path.includes('/parents')) {
      return { type: 'parent' }
    } else if (path.includes('/subcategories')) {
      return { type: 'subcategory' }
    } else if (path.includes('/inactive')) {
      return { status: 'inactive' }
    } else if (path.includes('/active')) {
      return { status: 'active' }
    }
    
    return {}
  }, [location.pathname])

  // Get page title based on current route
  const getPageTitle = (): string => {
    const path = location.pathname
    
    if (path.includes('/parents')) return 'Parent Categories'
    if (path.includes('/subcategories')) return 'Subcategories'
    if (path.includes('/inactive')) return 'Inactive Categories'
    if (path.includes('/active')) return 'Active Categories'
    
    return 'Job Categories'
  }

  const getPageDescription = (): string => {
    const path = location.pathname
    
    if (path.includes('/parents')) return 'Manage main category groups'
    if (path.includes('/subcategories')) return 'Manage category subdivisions'
    if (path.includes('/inactive')) return 'View and manage disabled categories'
    if (path.includes('/active')) return 'View and manage active categories'
    
    return 'Manage job categories and subcategories'
  }

  const handleCategorySelect = (category: JobCategory) => {
    setSelectedCategory(category)
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    onClick 
  }: {
    title: string
    value: number | string
    icon: React.ComponentType<{ className?: string }>
    color?: string
    onClick?: () => void
  }) => (
    <Card className={onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <p className="text-gray-600">{getPageDescription()}</p>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Categories"
            value={analytics.totalCategories}
            icon={CubeIcon}
            color="blue"
          />
          <StatCard
            title="Parent Categories"
            value={analytics.parentCategories}
            icon={FolderIcon}
            color="green"
          />
          <StatCard
            title="Subcategories"
            value={analytics.subcategories}
            icon={TagIcon}
            color="purple"
          />
          <StatCard
            title="Active Categories"
            value={analytics.activeCategories}
            icon={CheckCircleIcon}
            color="emerald"
          />
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ViewMode)}>
        <TabsList>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Hierarchy
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <JobCategoriesTable 
            defaultFilters={defaultFilters}
            onCategorySelect={handleCategorySelect}
          />
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              {hierarchy?.categories ? (
                <div className="space-y-4">
                  {hierarchy.categories.map((parentCategory) => (
                    <div key={parentCategory.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <FolderIcon className="h-5 w-5 text-blue-600" />
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{parentCategory.name}</span>
                          {parentCategory.color && (
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: parentCategory.color }}
                            />
                          )}
                        </div>
                      </div>
                      
                      {parentCategory.description && (
                        <p className="text-sm text-gray-600 mb-3 ml-8">
                          {parentCategory.description}
                        </p>
                      )}
                      
                      {parentCategory.children.length > 0 && (
                        <div className="ml-8 space-y-2">
                          {parentCategory.children.map((childCategory) => (
                            <div key={childCategory.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                              <TagIcon className="h-4 w-4 text-purple-600" />
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{childCategory.name}</span>
                                {childCategory.color && (
                                  <div 
                                    className="w-3 h-3 rounded-full border"
                                    style={{ backgroundColor: childCategory.color }}
                                  />
                                )}
                              </div>
                              {childCategory.description && (
                                <span className="text-xs text-gray-500">
                                  - {childCategory.description}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {parentCategory.children.length === 0 && (
                        <div className="ml-8 text-sm text-gray-400 italic">
                          No subcategories
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No categories found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Categories</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{analytics.activeCategories}</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(analytics.activeCategories / analytics.totalCategories) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inactive Categories</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{analytics.inactiveCategories}</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gray-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(analytics.inactiveCategories / analytics.totalCategories) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Parent Categories</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{analytics.parentCategories}</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(analytics.parentCategories / analytics.totalCategories) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Subcategories</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{analytics.subcategories}</Badge>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(analytics.subcategories / analytics.totalCategories) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories with Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Categories by Job Count</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.categoriesWithJobs ? (
                  <div className="space-y-3">
                    {analytics.categoriesWithJobs.slice(0, 8).map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm truncate flex-1">{category.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {category.job_count} jobs
                        </Badge>
                      </div>
                    ))}
                    {analytics.categoriesWithJobs.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No categories with jobs yet
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}