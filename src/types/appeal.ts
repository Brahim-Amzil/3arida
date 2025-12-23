// Appeal Status Type
export type AppealStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';

// Appeal Message Interface
export interface AppealMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'creator' | 'moderator';
  content: string;
  createdAt: Date;
  isInternal?: boolean; // For moderator-only notes
}

// Status Change Interface
export interface StatusChange {
  status: AppealStatus;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

// Core Appeal Interface
export interface Appeal {
  id: string;
  petitionId: string;
  petitionTitle: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  status: AppealStatus;
  messages: AppealMessage[];
  statusHistory: StatusChange[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
}

// Appeal Filters Interface
export interface AppealFilters {
  status?: AppealStatus;
  creatorId?: string;
  petitionId?: string;
  page?: number;
  limit?: number;
}

// Appeal Creation Data
export interface CreateAppealData {
  petitionId: string;
  message: string;
}

// Appeal Reply Data
export interface AppealReplyData {
  message: string;
  isInternal?: boolean;
}

// Appeal Status Update Data
export interface AppealStatusUpdateData {
  status: AppealStatus;
  reason?: string;
}

// Pagination Info
export interface AppealPaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// API Response Types
export interface AppealsListResponse {
  appeals: Appeal[];
  pagination: AppealPaginationInfo;
}

export interface AppealDetailResponse {
  appeal: Appeal;
  petition: {
    id: string;
    title: string;
    status: string;
    moderationNotes?: string;
  };
}

export interface CreateAppealResponse {
  success: boolean;
  appealId: string;
  message: string;
}

export interface AppealReplyResponse {
  success: boolean;
  messageId: string;
}

export interface AppealStatusUpdateResponse {
  success: boolean;
  message: string;
}
