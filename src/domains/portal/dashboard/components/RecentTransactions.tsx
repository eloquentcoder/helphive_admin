import { motion } from 'framer-motion'
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { cn } from '../../../../shared/utils/cn'
import { type Transaction as ApiTransaction } from '../apis/dashboardApi'

interface RecentTransactionsProps {
  transactions: ApiTransaction[]
}

interface Transaction {
  id: string
  type: 'payment' | 'refund' | 'withdrawal' | 'commission'
  amount: number
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  description: string
  user: {
    name: string
    avatar?: string
  }
  timestamp: string
  reference: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: 150.00,
    status: 'completed',
    description: 'House cleaning service payment',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612-30af8?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    timestamp: '2 minutes ago',
    reference: 'TXN-001234'
  },
  {
    id: '2',
    type: 'commission',
    amount: 15.00,
    status: 'completed',
    description: 'Platform commission (10%)',
    user: {
      name: 'Platform',
    },
    timestamp: '2 minutes ago',
    reference: 'COM-001234'
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: 500.00,
    status: 'pending',
    description: 'Helper withdrawal request',
    user: {
      name: 'Ahmed Hassan',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    timestamp: '5 minutes ago',
    reference: 'WTH-005678'
  },
  {
    id: '4',
    type: 'refund',
    amount: 75.00,
    status: 'completed',
    description: 'Service cancellation refund',
    user: {
      name: 'Maria Rodriguez'
    },
    timestamp: '15 minutes ago',
    reference: 'REF-009876'
  },
  {
    id: '5',
    type: 'payment',
    amount: 200.00,
    status: 'failed',
    description: 'Plumbing service payment',
    user: {
      name: 'David Chen'
    },
    timestamp: '1 hour ago',
    reference: 'TXN-001230'
  }
]

const transformTransactions = (transactions: ApiTransaction[]): Transaction[] => {
  return transactions.map((tx) => ({
    id: tx.id.toString(),
    type: tx.type.toLowerCase() as any || 'payment',
    amount: tx.amount,
    status: tx.status.toLowerCase() as any || 'completed',
    description: tx.description,
    user: {
      name: tx.user.name,
      avatar: tx.user.avatar
    },
    timestamp: tx.createdAt,
    reference: `REF-${tx.id}`
  }))
}

export const RecentTransactions = ({ transactions = [] }: RecentTransactionsProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />
      case 'refund':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />
      case 'withdrawal':
        return <ArrowDownIcon className="w-4 h-4 text-blue-500" />
      case 'commission':
        return <CurrencyDollarIcon className="w-4 h-4 text-purple-500" />
      default:
        return <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />
      case 'cancelled':
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      case 'cancelled':
        return 'text-gray-600 dark:text-gray-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'payment':
      case 'commission':
        return 'text-green-600 dark:text-green-400'
      case 'refund':
      case 'withdrawal':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-900 dark:text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
        </div>
        <button className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {(transactions && transactions.length > 0 ? transformTransactions(transactions) : mockTransactions).map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Transaction Type Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
            </div>

            {/* User Avatar */}
            <div className="flex-shrink-0">
              {transaction.user.avatar ? (
                <img
                  src={transaction.user.avatar}
                  alt={transaction.user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
                    {transaction.user.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {transaction.description}
                </h4>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(transaction.status)}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span>{transaction.user.name}</span>
                <span>•</span>
                <span>{transaction.timestamp}</span>
                <span>•</span>
                <span className="font-mono">{transaction.reference}</span>
              </div>
            </div>

            {/* Amount and Status */}
            <div className="flex-shrink-0 text-right">
              <div className={cn(
                "text-sm sm:text-base font-semibold mb-1",
                getAmountColor(transaction.type)
              )}>
                {transaction.type === 'refund' || transaction.type === 'withdrawal' ? '-' : '+'}
                ${transaction.amount.toFixed(2)}
              </div>
              <div className={cn(
                "text-xs capitalize",
                getStatusColor(transaction.status)
              )}>
                {transaction.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}