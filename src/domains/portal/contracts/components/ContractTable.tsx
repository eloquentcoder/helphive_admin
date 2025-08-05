import React, { useState, useMemo } from 'react'
import { 
  useGetContractsQuery, 
  useBulkUpdateContractsMutation,
  type Contract,
  type ContractFilters 
} from '../apis/contractsApi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Badge } from '../../../../components/ui/badge'
import { Checkbox } from '../../../../components/ui/checkbox'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../../components/ui/table'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface ContractTableProps {
  defaultFilters?: Partial<ContractFilters>
  onContractSelect?: (contract: Contract) => void
}

export function ContractTable({ defaultFilters = {}, onContractSelect }: ContractTableProps) {
  const [filters, setFilters] = useState<ContractFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...defaultFilters,
  })
  
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const { data: contractsData, isLoading, error } = useGetContractsQuery(filters)
  const [bulkUpdate] = useBulkUpdateContractsMutation()

  const contracts = contractsData?.contracts || []
  const totalCount = contractsData?.totalCount || 0
  const totalPages = contractsData?.totalPages || 1
  const currentPage = contractsData?.currentPage || 1

  // Handle search with debouncing
  const debouncedSearch = useMemo(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  React.useEffect(() => {
    return debouncedSearch
  }, [debouncedSearch])

  const handleFilterChange = (key: keyof ContractFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleSort = (column: string) => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    setFilters(prev => ({ ...prev, sortBy: column, sortOrder: newOrder }))
  }

  const handleSelectContract = (contractId: string) => {
    setSelectedContracts(prev => 
      prev.includes(contractId) 
        ? prev.filter(id => id !== contractId)
        : [...prev, contractId]
    )
  }

  const handleSelectAll = () => {
    if (selectedContracts.length === contracts.length) {
      setSelectedContracts([])
    } else {
      setSelectedContracts(contracts.map(contract => contract.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedContracts.length === 0) return
    
    try {
      await bulkUpdate({
        contractIds: selectedContracts,
        action: action as any
      }).unwrap()
      setSelectedContracts([])
    } catch (error) {
      console.error('Bulk action failed:', error)
    }
  }

  const getStatusIcon = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'completed':
        return <DocumentTextIcon className="h-4 w-4 text-blue-500" />
      case 'disputed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4 text-gray-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
    }
  }

  const getPaymentIcon = (paymentStatus: Contract['paymentStatus']) => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      default:
        return <CurrencyDollarIcon className="h-4 w-4 text-yellow-500" />
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading contracts. Please try again.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
          </Button>
          
          {selectedContracts.length > 0 && (
            <div className="flex gap-2">
              <select 
              onChange={(e) => handleBulkAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Bulk Actions</option>
              <option value="activate">Activate</option>
              <option value="complete">Mark Complete</option>
              <option value="cancel">Cancel</option>
              <option value="mark_paid">Mark Paid</option>
            </select>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select 
                  onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value] : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="disputed">Disputed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <select 
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value ? [e.target.value] : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Payment Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date From</label>
                <Input 
                  type="date" 
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date To</label>
                <Input 
                  type="date" 
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contracts ({totalCount})</span>
            {selectedContracts.length > 0 && (
              <span className="text-sm font-normal">
                {selectedContracts.length} selected
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedContracts.length === contracts.length && contracts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('jobTitle')}
                  >
                    Job Title
                  </TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Helper</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('agreedAmount')}
                  >
                    Amount
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Loading contracts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : contracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No contracts found
                    </TableCell>
                  </TableRow>
                ) : (
                  contracts.map((contract) => (
                    <TableRow 
                      key={contract.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => onContractSelect?.(contract)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedContracts.includes(contract.id)}
                          onCheckedChange={() => handleSelectContract(contract.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{contract.jobTitle}</div>
                        <div className="text-sm text-gray-500">ID: {contract.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{contract.employerName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contract.helperAvatar && (
                            <img 
                              src={contract.helperAvatar} 
                              alt="" 
                              className="h-6 w-6 rounded-full"
                            />
                          )}
                          <span className="font-medium">{contract.helperName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{contract.agreedAmount.toLocaleString()} QAR</div>
                        <div className="text-sm text-gray-500">
                          Fee: {contract.platformFee.toLocaleString()} QAR
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(contract.status)}
                          <Badge 
                            variant={contract.status === 'active' ? 'default' : 'secondary'}
                            className={`bg-${contract.statusBadgeColor}-100 text-${contract.statusBadgeColor}-800`}
                          >
                            {contract.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPaymentIcon(contract.paymentStatus)}
                          <Badge 
                            variant={contract.paymentStatus === 'paid' ? 'default' : 'secondary'}
                            className={`bg-${contract.paymentStatusBadgeColor}-100 text-${contract.paymentStatusBadgeColor}-800`}
                          >
                            {contract.paymentStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {contract.durationInDays} days
                          {contract.daysRemaining > 0 && (
                            <div className="text-gray-500">
                              {contract.daysRemaining} remaining
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * (filters.limit || 20)) + 1} to {Math.min(currentPage * (filters.limit || 20), totalCount)} of {totalCount} contracts
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('page', Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('page', Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}