import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ContractTable } from '../components/ContractTable'
import { type Contract, type ContractFilters } from '../apis/contractsApi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Badge } from '../../../../components/ui/badge'
import { 
  DocumentTextIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

type ViewMode = 'list' | 'details'

export function ContractManagementPage() {
  const location = useLocation()
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

  // Determine filters based on current route
  const getDefaultFilters = (): Partial<ContractFilters> => {
    const path = location.pathname
    
    if (path.includes('/pending')) {
      return { status: ['pending_payment'] }
    } else if (path.includes('/active')) {
      return { status: ['active'] }
    } else if (path.includes('/completed')) {
      return { status: ['completed'] }
    } else if (path.includes('/disputed')) {
      return { status: ['disputed'] }
    } else if (path.includes('/overdue')) {
      return { paymentStatus: ['overdue'] }
    }
    
    return {}
  }

  // Get page title based on current route
  const getPageTitle = (): string => {
    const path = location.pathname
    
    if (path.includes('/pending')) return 'Pending Contracts'
    if (path.includes('/active')) return 'Active Contracts'
    if (path.includes('/completed')) return 'Completed Contracts'
    if (path.includes('/disputed')) return 'Disputed Contracts'
    if (path.includes('/overdue')) return 'Overdue Payments'
    
    return 'Contract Management'
  }

  const handleContractSelect = (contract: Contract) => {
    setSelectedContract(contract)
    setViewMode('details')
  }

  const handleBackToList = () => {
    setSelectedContract(null)
    setViewMode('list')
  }

  if (viewMode === 'details' && selectedContract) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Contracts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Contract Details</h1>
            <p className="text-gray-600">Contract #{selectedContract.id}</p>
          </div>
        </div>

        {/* Contract Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Contract Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Job Title</label>
                    <p className="font-medium">{selectedContract.jobTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={selectedContract.status === 'active' ? 'default' : 'secondary'}
                        className={`bg-${selectedContract.statusBadgeColor}-100 text-${selectedContract.statusBadgeColor}-800`}
                      >
                        {selectedContract.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employer</label>
                    <p className="font-medium">{selectedContract.employerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Helper</label>
                    <p className="font-medium">{selectedContract.helperName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                    <p className="font-medium">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                  </div>
                  {selectedContract.endDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Date</label>
                      <p className="font-medium">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Agreed Amount</label>
                    <p className="text-xl font-bold">{selectedContract.agreedAmount.toLocaleString()} QAR</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Platform Fee</label>
                    <p className="text-xl font-bold">{selectedContract.platformFee.toLocaleString()} QAR</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-xl font-bold">{selectedContract.totalAmount.toLocaleString()} QAR</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Status</label>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={selectedContract.paymentStatus === 'paid' ? 'default' : 'secondary'}
                      className={`bg-${selectedContract.paymentStatusBadgeColor}-100 text-${selectedContract.paymentStatusBadgeColor}-800`}
                    >
                      {selectedContract.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Information (if applicable) */}
            {selectedContract.status === 'disputed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    Dispute Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedContract.disputeReason && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dispute Reason</label>
                      <p className="mt-1">{selectedContract.disputeReason}</p>
                    </div>
                  )}
                  {selectedContract.disputeRaisedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Raised At</label>
                      <p className="mt-1">{new Date(selectedContract.disputeRaisedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedContract.disputeResolution && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Resolution</label>
                      <p className="mt-1">{selectedContract.disputeResolution}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Duration</span>
                  <span className="font-medium">{selectedContract.durationInDays} days</span>
                </div>
                {selectedContract.daysRemaining > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Days Remaining</span>
                    <span className="font-medium">{selectedContract.daysRemaining} days</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="font-medium">{new Date(selectedContract.createdAt).toLocaleDateString()}</span>
                </div>
                {selectedContract.signedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Signed</span>
                    <span className="font-medium">{new Date(selectedContract.signedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Notes */}
            {selectedContract.adminNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedContract.adminNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          <p className="text-gray-600">Manage platform contracts and agreements</p>
        </div>
      </div>

      {/* Contract Table */}
      <ContractTable 
        defaultFilters={getDefaultFilters()}
        onContractSelect={handleContractSelect}
      />
    </div>
  )
}