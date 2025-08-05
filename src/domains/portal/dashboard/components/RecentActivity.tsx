import { motion } from 'framer-motion'
import {
  UserPlusIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { cn } from '../../../../shared/utils/cn'
import { type ActivityItem } from '../apis/dashboardApi'

interface RecentActivityProps {
  activities: ActivityItem[]
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'user',
    title: 'New User Registration',
    description: 'John Doe registered as a Helper',
    time: '2 minutes ago',
    status: 'success'
  },
  {
    id: '2',
    type: 'job',
    title: 'Job Posted',
    description: 'Home Cleaning Service in Downtown',
    time: '15 minutes ago',
    status: 'info'
  },
  {
    id: '3',
    type: 'contract',
    title: 'Contract Completed',
    description: 'Garden Maintenance - $150',
    time: '1 hour ago',
    status: 'success'
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Processed',
    description: '$89.50 transferred to Helper wallet',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: '5',
    type: 'alert',
    title: 'Dispute Reported',
    description: 'Issue with delivery service',
    time: '3 hours ago',
    status: 'warning'
  },
  {
    id: '6',
    type: 'user',
    title: 'Account Verified',
    description: 'Sarah Wilson completed verification',
    time: '4 hours ago',
    status: 'success'
  },
]

const getIcon = (type: string) => {
  switch (type) {
    case 'user':
      return UserPlusIcon
    case 'job':
      return BriefcaseIcon
    case 'contract':
      return CheckCircleIcon
    case 'payment':
      return CurrencyDollarIcon
    case 'alert':
      return ExclamationTriangleIcon
    default:
      return CheckCircleIcon
  }
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    case 'warning':
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'error':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  }
}

export const RecentActivity = ({ activities = mockActivities }: RecentActivityProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type)
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <div className={cn(
                "flex-shrink-0 p-2 rounded-lg",
                getStatusColor(activity.status)
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors">
          Load More Activities
        </button>
      </div>
    </motion.div>
  )
}