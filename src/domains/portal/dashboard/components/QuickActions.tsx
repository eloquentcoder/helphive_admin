import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  UserPlusIcon,
  EyeIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { selectCurrentUser, hasPermission } from '../../../auth/login/controller/authSlice'

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    title: 'Add New User',
    description: 'Create a new user account',
    href: '/users/create',
    icon: UserPlusIcon,
    permission: 'users.create',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    title: 'Review Pending Jobs',
    description: 'Approve or reject job postings',
    href: '/jobs/pending',
    icon: EyeIcon,
    permission: 'jobs.approve',
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    title: 'Verify Users',
    description: 'Review user verification requests',
    href: '/users/pending',
    icon: CheckCircleIcon,
    permission: 'users.verify',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    title: 'Financial Reports',
    description: 'Generate and download reports',
    href: '/payments/reports',
    icon: DocumentArrowDownIcon,
    permission: 'payments.export',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    title: 'View Transactions',
    description: 'Monitor payment activities',
    href: '/payments/transactions',
    icon: CurrencyDollarIcon,
    permission: 'payments.view',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    title: 'Analytics Dashboard',
    description: 'View detailed analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    permission: 'analytics.view',
    color: 'bg-teal-500 hover:bg-teal-600'
  },
  {
    title: 'Manage Roles',
    description: 'Edit roles and permissions',
    href: '/settings/roles',
    icon: ShieldCheckIcon,
    permission: 'roles.view',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    title: 'Platform Settings',
    description: 'Configure system settings',
    href: '/settings/platform',
    icon: CogIcon,
    permission: 'settings.edit',
    color: 'bg-gray-500 hover:bg-gray-600'
  },
]

export const QuickActions = () => {
  const user = useSelector(selectCurrentUser)

  const allowedActions = quickActions.filter(action => 
    !action.permission || hasPermission(user, action.permission)
  )

  if (allowedActions.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {allowedActions.length} available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allowedActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={action.href}
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg text-white ${action.color} transition-colors`}>
                  <action.icon className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}