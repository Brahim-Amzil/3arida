import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts';
import { Petition } from '../../types/models';
import fetcher from '../../lib/fetcher';
import PetitionDetailModal from '../../components/admin/PetitionDetailModal';

interface PetitionWithActions extends Petition {
  // Additional fields for admin actions
}

interface PetitionsResponse {
  petitions: PetitionWithActions[];
  total: number;
  page: number;
  limit: number;
}

const PetitionModerationPage: React.FC = () => {
  const [petitions, setPetitions] = useState<PetitionWithActions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedPetition, setSelectedPetition] = useState<PetitionWithActions | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const data: PetitionsResponse = await fetcher(`/api/admin/petitions?${params}`);
      setPetitions(data.petitions);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, [currentPage, statusFilter, searchTerm]);

  const openPetitionModal = (petition: PetitionWithActions) => {
    setSelectedPetition(petition);
    setIsModalOpen(true);
  };

  const closePetitionModal = () => {
    setSelectedPetition(null);
    setIsModalOpen(false);
  };

  const handleModalStatusChange = async (petitionId: string, newStatus: string) => {
    await handleStatusChange(petitionId, newStatus);
    // Update the selected petition with new status
    if (selectedPetition && selectedPetition.id === petitionId) {
      setSelectedPetition({ ...selectedPetition, status: newStatus as any });
    }
  };

  const handleModalDelete = async (petitionId: string) => {
    await handleDeletePetition(petitionId);
    closePetitionModal();
  };

  const handleStatusChange = async (petitionId: string, newStatus: string) => {
    try {
      setActionLoading(petitionId);
      await fetcher('/api/admin/petitions/update-status', {
        method: 'PUT',
        body: JSON.stringify({
          petitionId,
          status: newStatus,
        }),
      });

      // Refresh the petitions list
      await fetchPetitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePetition = async (petitionId: string) => {
    if (!confirm('Are you sure you want to delete this petition? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(petitionId);
      await fetcher('/api/admin/petitions/delete', {
        method: 'DELETE',
        body: JSON.stringify({ petitionId }),
      });

      // Refresh the petitions list
      await fetchPetitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete petition');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'active':
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

  if (loading && petitions.length === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Petition Moderation</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Petitions
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
                <option value="rejected">Rejected</option>
                <option value="deleted">Deleted</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Petitions List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {petitions.map((petition) => (
              <li key={petition.id} className="px-6 py-4">
                <div className="flex items-start justify-between space-x-4">
                  {/* Petition Image */}
                  <div className="flex-shrink-0">
                    {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
                      <img
                        src={petition.mediaUrls[0]}
                        alt={petition.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Petition Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openPetitionModal(petition)}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 truncate cursor-pointer"
                      >
                        {petition.title}
                      </button>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(petition.status)}`}>
                        {petition.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {petition.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {new Date(petition.createdAt).toLocaleDateString()}</span>
                      <span>Signatures: {petition.currentSignatures || 0}</span>
                      <span>Goal: {petition.targetSignatures}</span>
                      {petition.category && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {petition.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Admin Actions */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      {/* View Details Button */}
                       <button
                         onClick={() => openPetitionModal(petition)}
                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                         </svg>
                         <span>View</span>
                       </button>
                      
                      {/* Status-specific Actions */}
                      {petition.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(petition.id, 'approved')}
                            disabled={actionLoading === petition.id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === petition.id ? 'Loading...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(petition.id, 'rejected')}
                            disabled={actionLoading === petition.id}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            {actionLoading === petition.id ? 'Loading...' : 'Reject'}
                          </button>
                        </>
                      )}
                      
                      {petition.status === 'approved' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(petition.id, 'paused')}
                            disabled={actionLoading === petition.id}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                          >
                            {actionLoading === petition.id ? 'Loading...' : 'Pause'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(petition.id, 'archived')}
                            disabled={actionLoading === petition.id}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                          >
                            {actionLoading === petition.id ? 'Loading...' : 'Archive'}
                          </button>
                        </>
                      )}
                      
                      {petition.status === 'paused' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(petition.id, 'approved')}
                            disabled={actionLoading === petition.id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === petition.id ? 'Loading...' : 'Resume'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(petition.id, 'archived')}
                            disabled={actionLoading === petition.id}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                          >
                            {actionLoading === petition.id ? 'Loading...' : 'Archive'}
                          </button>
                        </>
                      )}
                      
                      {petition.status === 'archived' && (
                        <button
                          onClick={() => handleStatusChange(petition.id, 'approved')}
                          disabled={actionLoading === petition.id}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === petition.id ? 'Loading...' : 'Restore'}
                        </button>
                      )}
                    </div>
                    
                    {/* Delete Button - Always Available */}
                    <button
                      onClick={() => handleDeletePetition(petition.id)}
                      disabled={actionLoading === petition.id}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 w-full"
                    >
                      {actionLoading === petition.id ? 'Loading...' : 'Delete Permanently'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Petition Detail Modal */}
      <PetitionDetailModal
        petition={selectedPetition}
        isOpen={isModalOpen}
        onClose={closePetitionModal}
        onStatusChange={handleModalStatusChange}
        onDelete={handleModalDelete}
        actionLoading={actionLoading}
      />
    </AdminLayout>
  );
};

export default PetitionModerationPage;