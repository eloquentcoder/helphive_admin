import { motion } from 'framer-motion'
import {
  TagIcon,
  ArrowUpCircleIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { type TopCategory } from '../apis/dashboardApi'

interface TopCategoriesProps {
  categories: TopCategory[]
}

interface Category {
  id: string
  name: string
  icon: string
  totalJobs: number
  totalRevenue: number
  averageRating: number
  growth: number
  color: string
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Cleaning Services',
    icon: '🧹',
    totalJobs: 2450,
    totalRevenue: 245000,
    averageRating: 4.8,
    growth: 23.5,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
  },
  {
    id: '2',
    name: 'Home Maintenance',
    icon: '🔧',
    totalJobs: 1890,
    totalRevenue: 378000,
    averageRating: 4.7,
    growth: 18.2,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
  },
  {
    id: '3',
    name: 'Gardening & Landscaping',
    icon: '🌿',
    totalJobs: 1340,
    totalRevenue: 201000,
    averageRating: 4.6,
    growth: 15.8,
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
  },
  {
    id: '4',
    name: 'Pet Care',
    icon: '🐕',
    totalJobs: 980,
    totalRevenue: 98000,
    averageRating: 4.9,
    growth: 28.7,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
  },
  {
    id: '5',
    name: 'Technology Services',
    icon: '💻',
    totalJobs: 750,
    totalRevenue: 150000,
    averageRating: 4.4,
    growth: 12.1,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'
  },
  {
    id: '6',
    name: 'Beauty & Wellness',
    icon: '💅',
    totalJobs: 650,
    totalRevenue: 130000,
    averageRating: 4.5,
    growth: 19.4,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300'
  }
]

const transformCategories = (categories: TopCategory[]): Category[] => {
  const colors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300'
  ]
  
  return categories.map((category, index) => ({
    id: category.id.toString(),
    name: category.name,
    icon: category.icon || '📦',
    totalJobs: category.count,
    totalRevenue: index * 50000 + 100000, // Mock revenue
    averageRating: 4.5 + (index * 0.1),
    growth: 10 + index * 5,
    color: colors[index % colors.length]
  }))
}

export const TopCategories = ({ categories = [] }: TopCategoriesProps) => {
  const transformedCategories = categories.length > 0 ? transformCategories(categories) : mockCategories
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <TagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Top Categories
          </h3>
        </div>
        <button className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {transformedCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center text-lg sm:text-xl shadow-sm">
                {category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                  {category.name}
                </h4>
                <div className="flex items-center space-x-1 mt-1">
                  <StarIcon className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.averageRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-1">
                  <BriefcaseIcon className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Jobs</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.totalJobs.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-1">
                  <CurrencyDollarIcon className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${(category.totalRevenue / 1000).toFixed(0)}k
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-1">
                  <ArrowUpCircleIcon className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Growth</span>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  +{category.growth}%
                </span>
              </div>
            </div>

            {/* Category Badge */}
            <div className="mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                Popular
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}