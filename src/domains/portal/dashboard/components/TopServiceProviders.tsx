import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BuildingOfficeIcon,
  StarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../../../shared/utils/cn'
import { type TopServiceProvider } from '../apis/dashboardApi'

interface TopServiceProvidersProps {
  providers: TopServiceProvider[]
}

interface ServiceProvider {
  id: string
  companyName: string
  logo?: string
  rating: number
  totalRevenue: number
  activeWorkers: number
  jobsCompleted: number
  verificationStatus: 'verified' | 'pending' | 'unverified'
  categories: string[]
  growth: {
    revenue: number
    workers: number
  }
}

const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    companyName: 'CleanPro Services',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    rating: 4.8,
    totalRevenue: 145200,
    activeWorkers: 24,
    jobsCompleted: 892,
    verificationStatus: 'verified',
    categories: ['Cleaning', 'Maintenance'],
    growth: { revenue: 28.5, workers: 12.3 }
  },
  {
    id: '2',
    companyName: 'FixIt Solutions',
    rating: 4.7,
    totalRevenue: 132800,
    activeWorkers: 18,
    jobsCompleted: 756,
    verificationStatus: 'verified',
    categories: ['Plumbing', 'Electrical'],
    growth: { revenue: 24.7, workers: 15.8 }
  },
  {
    id: '3',
    companyName: 'GreenThumb Gardens',
    rating: 4.6,
    totalRevenue: 98500,
    activeWorkers: 15,
    jobsCompleted: 634,
    verificationStatus: 'pending',
    categories: ['Gardening', 'Landscaping'],
    growth: { revenue: 19.2, workers: 8.4 }
  },
  {
    id: '4',
    companyName: 'TechRepair Hub',
    rating: 4.5,
    totalRevenue: 87300,
    activeWorkers: 12,
    jobsCompleted: 543,
    verificationStatus: 'verified',
    categories: ['Technology', 'Electronics'],
    growth: { revenue: 16.8, workers: 6.7 }
  },
  {
    id: '5',
    companyName: 'PetCare Professionals',
    rating: 4.4,
    totalRevenue: 76900,
    activeWorkers: 10,
    jobsCompleted: 445,
    verificationStatus: 'unverified',
    categories: ['Pet Care', 'Animal Services'],
    growth: { revenue: 14.3, workers: 4.2 }
  },
  {
    id: '6',
    companyName: 'HomeGuard Security',
    rating: 4.3,
    totalRevenue: 65200,
    activeWorkers: 8,
    jobsCompleted: 378,
    verificationStatus: 'verified',
    categories: ['Security', 'Installation'],
    growth: { revenue: 12.1, workers: 2.8 }
  }
]

type SortBy = 'revenue' | 'workers'

const transformProviders = (providers: TopServiceProvider[]): ServiceProvider[] => {
  return providers.map((provider, index) => ({
    id: provider.id.toString(),
    companyName: provider.name,
    logo: provider.avatar,
    rating: 4.5 + (index * 0.1),
    totalRevenue: provider.totalSpent,
    activeWorkers: Math.floor(provider.postedJobs * 0.15),
    jobsCompleted: provider.completedJobs,
    verificationStatus: 'verified' as const,
    categories: ['Services'],
    growth: { revenue: 10 + index * 5, workers: 5 + index * 2 }
  }))
}

export const TopServiceProviders = ({ providers = [] }: TopServiceProvidersProps) => {
  const [sortBy, setSortBy] = useState<SortBy>('revenue')
  const [showAll, setShowAll] = useState(false)

  const transformedProviders = providers.length > 0 ? transformProviders(providers) : mockProviders
  const sortedProviders = [...transformedProviders].sort((a, b) => {
    if (sortBy === 'revenue') {
      return b.totalRevenue - a.totalRevenue
    }
    return b.activeWorkers - a.activeWorkers
  })

  const displayedProviders = showAll ? sortedProviders : sortedProviders.slice(0, 5)

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <CheckBadgeIcon className="w-4 h-4 text-green-500" title="Verified Provider" />
        )
      case 'pending':
        return (
          <div className="w-4 h-4 bg-yellow-500 rounded-full" title="Pending Verification" />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Top Service Providers
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSortBy('revenue')}
              className={cn(
                "px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors",
                sortBy === 'revenue'
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              Revenue
            </button>
            <button
              onClick={() => setSortBy('workers')}
              className={cn(
                "px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors",
                sortBy === 'workers'
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              Workers
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {displayedProviders.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Rank */}
            <div className="flex-shrink-0">
              <div className={cn(
                "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold",
                index === 0 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" :
                index === 1 ? "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300" :
                index === 2 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300" :
                "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
              )}>
                {index + 1}
              </div>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              {provider.logo ? (
                <img
                  src={provider.logo}
                  alt={provider.companyName}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                  {provider.companyName}
                </h4>
                {getVerificationBadge(provider.verificationStatus)}
              </div>
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span>{provider.rating}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{provider.jobsCompleted} jobs</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {provider.categories.slice(0, 2).map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {category}
                  </span>
                ))}
                {provider.categories.length > 2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{provider.categories.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center space-x-1 text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                {sortBy === 'revenue' ? (
                  <>
                    <CurrencyDollarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>${(provider.totalRevenue / 1000).toFixed(0)}k</span>
                  </>
                ) : (
                  <>
                    <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    <span>{provider.activeWorkers}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                <ChevronUpIcon className="w-3 h-3" />
                <span>+{sortBy === 'revenue' ? provider.growth.revenue : provider.growth.workers}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {mockProviders.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          <span>{showAll ? 'Show Less' : `Show All ${mockProviders.length}`}</span>
          {showAll ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      )}
    </motion.div>
  )
}