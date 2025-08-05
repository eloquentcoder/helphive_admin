import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  StarIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  TrophyIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../../../shared/utils/cn'
import { type TopHelper } from '../apis/dashboardApi'

interface TopHelpersProps {
  helpers: TopHelper[]
}

const mockHelpers = [
  {
    id: '1',
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612-30af8?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.9,
    totalEarnings: 15420,
    jobsCompleted: 156,
    successRate: 98,
    specialization: 'Home Cleaning',
    badge: 'gold',
    growth: { earnings: 23.5, jobs: 15.2 }
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 4.8,
    totalEarnings: 12850,
    jobsCompleted: 142,
    successRate: 96,
    specialization: 'Plumbing',
    badge: 'silver',
    growth: { earnings: 18.7, jobs: 12.4 }
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    rating: 4.7,
    totalEarnings: 11200,
    jobsCompleted: 128,
    successRate: 94,
    specialization: 'Electrical Work',
    badge: 'bronze',
    growth: { earnings: 16.3, jobs: 9.8 }
  },
  {
    id: '4',
    name: 'David Chen',
    rating: 4.6,
    totalEarnings: 9850,
    jobsCompleted: 98,
    successRate: 92,
    specialization: 'Gardening',
    growth: { earnings: 14.2, jobs: 8.5 }
  },
  {
    id: '5',
    name: 'Emma Thompson',
    rating: 4.5,
    totalEarnings: 8750,
    jobsCompleted: 87,
    successRate: 90,
    specialization: 'Pet Care',
    growth: { earnings: 12.1, jobs: 6.7 }
  }
]

type SortBy = 'earnings' | 'jobs'

const transformHelpers = (helpers: TopHelper[]): any[] => {
  return helpers.map((helper, index) => ({
    id: helper.id.toString(),
    name: helper.name,
    avatar: helper.avatar,
    rating: helper.rating,
    totalEarnings: helper.earnings,
    jobsCompleted: helper.completedJobs,
    successRate: 95 + index, // Mock success rate
    specialization: 'Home Services', // Mock specialization
    badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : undefined,
    growth: { earnings: 10 + index * 5, jobs: 5 + index * 3 } // Mock growth
  }))
}

export const TopHelpers = ({ helpers = [] }: TopHelpersProps) => {
  const [sortBy, setSortBy] = useState<SortBy>('earnings')
  const [showAll, setShowAll] = useState(false)

  const transformedHelpers = helpers.length > 0 ? transformHelpers(helpers) : mockHelpers
  const sortedHelpers = [...transformedHelpers].sort((a, b) => {
    if (sortBy === 'earnings') {
      return b.totalEarnings - a.totalEarnings
    }
    return b.jobsCompleted - a.jobsCompleted
  })

  const displayedHelpers = showAll ? sortedHelpers : sortedHelpers.slice(0, 5)

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
      default: return ''
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
          <TrophyIcon className="h-5 w-5 sm:h-6 sm:w-6 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Top Helpers
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSortBy('earnings')}
              className={cn(
                "px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors",
                sortBy === 'earnings'
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              Revenue
            </button>
            <button
              onClick={() => setSortBy('jobs')}
              className={cn(
                "px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors",
                sortBy === 'jobs'
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {displayedHelpers.map((helper, index) => (
          <motion.div
            key={helper.id}
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
                "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300"
              )}>
                {index + 1}
              </div>
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
              {helper.avatar ? (
                <img
                  src={helper.avatar}
                  alt={helper.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400" />
                </div>
              )}
            </div>

            {/* Helper Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                  {helper.name}
                </h4>
                {helper.badge && (
                  <span className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                    getBadgeColor(helper.badge)
                  )}>
                    {helper.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span>{helper.rating}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{helper.specialization}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center space-x-1 text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                {sortBy === 'earnings' ? (
                  <>
                    <CurrencyDollarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>${helper.totalEarnings.toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    <BriefcaseIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>{helper.jobsCompleted}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                <ChevronUpIcon className="w-3 h-3" />
                <span>+{sortBy === 'earnings' ? helper.growth.earnings : helper.growth.jobs}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {mockHelpers.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          <span>{showAll ? 'Show Less' : `Show All ${mockHelpers.length}`}</span>
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