import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { JobTable } from '../components/JobTable'
import { JobDetails } from '../components/JobDetails'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  PlusIcon,
  BriefcaseIcon,
  ClockIcon,
  PauseIcon,
  XCircleIcon,
  UsersIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { type Job, useGetJobAnalyticsQuery } from '../apis/jobsApi'

type ViewMode = 'list' | 'details'

export const JobManagementPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  // const location = useLocation()
  
  const { data: analytics, isLoading: analyticsLoading } = useGetJobAnalyticsQuery()
  
  // Extract the sub-route from the path
  // const pathSegments = location.pathname.split('/')
  // const subRoute = pathSegments[2] || 'all'
  
  // Map sub-routes to filter configurations
  // const getFilterConfig = () => {
  //   switch (subRoute) {
  //     case 'pending':
  //       return { status: ['draft'], title: 'Pending Jobs' }
  //     case 'active':
  //       return { status: ['published'], title: 'Active Jobs' }
  //     case 'paused':
  //       return { status: ['paused'], title: 'Paused Jobs' }
  //     case 'expired':
  //       return { status: ['expired', 'stopped'], title: 'Expired Jobs' }
  //     case 'applications':
  //       return { title: 'Job Applications' }
  //     case 'contracts':
  //       return { title: 'Job Contracts' }
  //     default:
  //       return { title: 'All Jobs' }
  //   }
  // }
  
  // const filterConfig = getFilterConfig()

  // Animation variants

  const statsCards = [
    {
      title: 'Total Jobs',
      value: analytics?.totalJobs || 0,
      change: '+12%',
      icon: BriefcaseIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Jobs',
      value: analytics?.activeJobs || 0,
      change: '+8%',
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Pending Approval',
      value: analytics?.draftJobs || 0,
      change: '+5%',
      icon: ClockIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Total Applications',
      value: analytics?.totalApplications || 0,
      change: '+23%',
      icon: UsersIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ]

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job)
    setViewMode('details')
  }

  const handleJobEdit = (job: Job) => {
    // TODO: Implement job editing
    console.log('Edit job:', job)
  }

  const handleJobDelete = async (job: Job) => {
    // TODO: Implement job deletion
    console.log('Delete job:', job)
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedJob(null)
  }

  const getTabFilterConfig = (tab: string) => {
    switch (tab) {
      case 'pending':
        return { status: ['draft'] }
      case 'active':
        return { status: ['published'] }
      case 'paused':
        return { status: ['paused'] }
      case 'expired':
        return { status: ['expired', 'stopped'] }
      default:
        return {}
    }
  }

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsLoading ? (
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        stat.value.toLocaleString()
                      )}
                    </p>
                    <div className="flex items-center space-x-1">
                      <ChartBarIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                      <span className="text-sm text-gray-500">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Jobs Management
                </h1>
                <p className="text-gray-600">Manage job postings, applications, and contracts</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="hover:bg-gray-50">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            {renderStatsCards()}

            {/* Tabbed Navigation */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-gray-50 p-1 rounded-lg">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      All Jobs
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pending"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Pending
                      {analytics?.draftJobs && analytics.draftJobs > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-orange-500">
                          {analytics.draftJobs}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="active"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Active
                    </TabsTrigger>
                    <TabsTrigger 
                      value="paused"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      <PauseIcon className="h-4 w-4 mr-2" />
                      Paused
                    </TabsTrigger>
                    <TabsTrigger 
                      value="expired"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Expired
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-6">
                    <JobTable
                      key={activeTab}
                      onJobSelect={handleJobSelect}
                      onJobEdit={handleJobEdit}
                      onJobDelete={handleJobDelete}
                      defaultFilters={getTabFilterConfig(activeTab)}
                    />
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </motion.div>
        )

      case 'details':
        return (
          <AnimatePresence mode="wait">
            {selectedJob && (
              <motion.div
                key={selectedJob.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <JobDetails
                  jobId={selectedJob.id}
                  onClose={handleBackToList}
                  onEdit={handleJobEdit}
                  onDelete={handleJobDelete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  )
}