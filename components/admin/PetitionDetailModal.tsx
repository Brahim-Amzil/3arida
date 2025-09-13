import React from 'react';
import { Petition } from '../../types/models';

interface PetitionDetailModalProps {
  petition: Petition | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (petitionId: string, newStatus: string) => Promise<void>;
  onDelete: (petitionId: string) => Promise<void>;
  actionLoading: string | null;
}

const PetitionDetailModal: React.FC<PetitionDetailModalProps> = ({
  petition,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  actionLoading,
}) => {
  if (!isOpen || !petition) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-orange-100 text-orange-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {petition.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(petition.status)}`}>
                    {petition.status}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Images */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Images</h4>
                  {/* Debug: Show media URLs info */}
                  <div className="text-xs text-gray-500 mb-2">
                    MediaUrls: {petition.mediaUrls ? `Array(${petition.mediaUrls.length})` : 'null/undefined'}
                    {petition.mediaUrls && petition.mediaUrls.length > 0 && (
                      <div>URLs: {petition.mediaUrls.join(', ')}</div>
                    )}
                  </div>
                  
                  {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {petition.mediaUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Petition image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Image failed to load:', url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No images available</div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Description</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {petition.description}
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 text-gray-700">{petition.category}</span>
                  </div>
                  {petition.subcategory && (
                    <div>
                      <span className="font-medium text-gray-900">Subcategory:</span>
                      <span className="ml-2 text-gray-700">{petition.subcategory}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-900">Created:</span>
                    <span className="ml-2 text-gray-700">
                      {new Date(petition.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Signatures:</span>
                    <span className="ml-2 text-gray-700">
                      {petition.currentSignatures} / {petition.targetSignatures}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Pricing Tier:</span>
                    <span className="ml-2 text-gray-700">{petition.pricingTier}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Payment Status:</span>
                    <span className="ml-2 text-gray-700">{petition.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Admin Actions</h4>
                  
                  <div className="space-y-3">
                    {/* View Public Page */}
                    <button
                      onClick={() => window.open(`/petitions/${petition.id}`, '_blank')}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Public Page</span>
                    </button>

                    {/* Debug: Show current status */}
                    <div className="text-xs text-gray-500 mb-2">
                      Current Status: {petition.status}
                    </div>

                    {/* Status-specific Actions */}
                    {petition.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onStatusChange(petition.id, 'approved')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => onStatusChange(petition.id, 'rejected')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Reject'}
                        </button>
                      </>
                    )}

                    {/* Handle 'active' status - needs approval */}
                    {petition.status === 'active' && (
                      <>
                        <button
                          onClick={() => onStatusChange(petition.id, 'approved')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => onStatusChange(petition.id, 'paused')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Pause'}
                        </button>
                        <button
                          onClick={() => onStatusChange(petition.id, 'rejected')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Reject'}
                        </button>
                      </>
                    )}

                    {/* Handle 'approved' status - already approved */}
                    {petition.status === 'approved' && (
                      <>
                        <button
                          onClick={() => onStatusChange(petition.id, 'paused')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Pause'}
                        </button>
                        <button
                          onClick={() => onStatusChange(petition.id, 'archived')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Archive'}
                        </button>
                      </>
                    )}



                    {petition.status === 'paused' && (
                      <>
                        <button
                          onClick={() => onStatusChange(petition.id, 'approved')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Resume'}
                        </button>
                        <button
                          onClick={() => onStatusChange(petition.id, 'archived')}
                          disabled={actionLoading === petition.id}
                          className="w-full bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Archive'}
                        </button>
                      </>
                    )}

                    {petition.status === 'archived' && (
                      <button
                        onClick={() => onStatusChange(petition.id, 'approved')}
                        disabled={actionLoading === petition.id}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionLoading === petition.id ? 'Loading...' : 'Restore'}
                      </button>
                    )}

                    {/* Delete Button - Always Available */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => onDelete(petition.id)}
                        disabled={actionLoading === petition.id}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        {actionLoading === petition.id ? 'Loading...' : 'Delete Permanently'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetitionDetailModal;