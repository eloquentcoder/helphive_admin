import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SparklesIcon,
  ArrowUpCircleIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FireIcon,
  ClockIcon,
  ArrowDownCircleIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../../../shared/utils/cn'
import { type TopService } from '../apis/dashboardApi'

interface TopServicesProps {
  services: TopService[]
}

interface Service {
  id: string
  name: string
  category: string
  icon: string
  totalBookings: number
  totalRevenue: number
  averagePrice: number
  rating: number
  growth: number
  trend: 'up' | 'down' | 'stable'
  isPopular: boolean
  isNew: boolean
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'House Cleaning',
    category: 'Cleaning',
    icon: '🏠',
    totalBookings: 1247,
    totalRevenue: 87290,
    averagePrice: 70,
    rating: 4.8,
    growth: 23.5,
    trend: 'up',
    isPopular: true,
    isNew: false
  },
  {
    id: '2',
    name: 'Plumbing Repair',
    category: 'Maintenance',
    icon: '🔧',
    totalBookings: 892,
    totalRevenue: 125680,
    averagePrice: 141,
    rating: 4.7,
    growth: 18.2,
    trend: 'up',
    isPopular: true,
    isNew: false
  },
  {
    id: '3',
    name: 'Garden Maintenance',
    category: 'Gardening',
    icon: '🌿',
    totalBookings: 756,
    totalRevenue: 68340,
    averagePrice: 90,
    rating: 4.6,
    growth: 15.8,
    trend: 'up',
    isPopular: false,
    isNew: false
  },
  {
    id: '4',
    name: 'Pet Walking',
    category: 'Pet Care',
    icon: '🐕',
    totalBookings: 634,
    totalRevenue: 31700,
    averagePrice: 50,
    rating: 4.9,
    growth: 28.7,
    trend: 'up',
    isPopular: false,
    isNew: true
  },
  {
    id: '5',
    name: 'Electrical Work',
    category: 'Maintenance',
    icon: '⚡',
    totalBookings: 543,
    totalRevenue: 92310,
    averagePrice: 170,
    rating: 4.5,
    growth: 12.4,
    trend: 'up',
    isPopular: false,
    isNew: false
  },
  {
    id: '6',
    name: 'Computer Repair',
    category: 'Technology',
    icon: '💻',
    totalBookings: 445,
    totalRevenue: 53400,
    averagePrice: 120,
    rating: 4.4,
    growth: -5.2,
    trend: 'down',
    isPopular: false,
    isNew: false
  },
  {
    id: '7',
    name: 'Interior Painting',
    category: 'Home Improvement',
    icon: '🎨',
    totalBookings: 378,
    totalRevenue: 75600,
    averagePrice: 200,
    rating: 4.3,
    growth: 8.9,
    trend: 'up',
    isPopular: false,
    isNew: false
  },
  {
    id: '8',
    name: 'Appliance Installation',
    category: 'Installation',
    icon: '🔌',
    totalBookings: 312,
    totalRevenue: 46800,
    averagePrice: 150,
    rating: 4.2,
    growth: 22.1,
    trend: 'up',
    isPopular: false,
    isNew: true
  }
]

type SortBy = 'bookings' | 'revenue' | 'growth'

const transformServices = (services: TopService[]): Service[] => {
  return services.map((service, index) => ({
    id: service.id.toString(),
    name: service.name,
    category: 'General Services',
    icon: '🔧',
    totalBookings: service.count,
    totalRevenue: service.revenue,
    averagePrice: service.count > 0 ? Math.round(service.revenue / service.count) : 0,
    rating: 4.5 + (index * 0.1),
    growth: 5 + index * 3,
    trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'stable' as any,
    isPopular: index < 2,
    isNew: false
  }))
}

export const TopServices = ({ services = [] }: TopServicesProps) => {
  const [sortBy, setSortBy] = useState<SortBy>('bookings')
  const [showAll, setShowAll] = useState(false)

  const transformedServices = services.length > 0 ? transformServices(services) : mockServices
  const sortedServices = [...transformedServices].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.totalRevenue - a.totalRevenue
      case 'growth':
        return b.growth - a.growth
      default:
        return b.totalBookings - a.totalBookings
    }
  })

  const displayedServices = showAll ? sortedServices : sortedServices.slice(0, 6)

  const getTrendIcon = (growth: number) => {
    if (growth > 0) {
      return <ArrowUpCircleIcon className="w-3 h-3 text-green-500" />
    } else if (growth < 0) {
      return <ArrowDownCircleIcon className="w-3 h-3 text-red-500 rotate-180" />
    }
    return <div className="w-3 h-3 bg-gray-400 rounded-full" />
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
          <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Top Services
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSortBy('bookings')}
              className={cn(
                "px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors",
                sortBy === 'bookings'
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              Bookings
            </button>
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
              onClick={() => setSortBy('growth')}
              className={cn(
                "px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors",
                sortBy === 'growth'
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              Growth
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {displayedServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Badges */}
            <div className="absolute top-2 right-2 flex space-x-1">
              {service.isPopular && (
                <div className="flex items-center space-x-1 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                  <FireIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">Hot</span>
                </div>
              )}
              {service.isNew && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                  <ClockIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">New</span>
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                  {service.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">
                  {service.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {service.category}
                </p>
                
                {/* Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-1">
                      <BriefcaseIcon className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {service.totalBookings} bookings
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="w-3 h-3 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${(service.totalRevenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Avg: ${service.averagePrice}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(service.growth)}
                      <span className={cn(
                        "font-medium",
                        service.growth > 0 ? "text-green-600 dark:text-green-400" : 
                        service.growth < 0 ? "text-red-600 dark:text-red-400" : 
                        "text-gray-600 dark:text-gray-400"
                      )}>
                        {service.growth > 0 ? '+' : ''}{service.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {mockServices.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          <span>{showAll ? 'Show Less' : `Show All ${mockServices.length}`}</span>
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