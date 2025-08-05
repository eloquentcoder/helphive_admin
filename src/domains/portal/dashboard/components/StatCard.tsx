import { motion } from 'framer-motion'
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import { cn } from '../../../../shared/utils/cn'

interface StatCardProps {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon: 'users' | 'briefcase' | 'currency-dollar' | 'document-text'
}

const iconMap = {
  users: UsersIcon,
  briefcase: BriefcaseIcon,
  'currency-dollar': CurrencyDollarIcon,
  'document-text': DocumentTextIcon,
}

export const StatCard = ({ title, value, change, trend, icon }: StatCardProps) => {
  const Icon = iconMap[icon]
  const isPositive = trend === 'up'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            {value}
          </p>
          <div className="flex items-center">
            <div
              className={cn(
                "flex items-center text-sm font-medium",
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1 sm:ml-2 hidden sm:inline">
              vs last month
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-teal-100 dark:bg-teal-900/30 p-2 sm:p-3 rounded-lg">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}