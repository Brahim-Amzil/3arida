'use client';

import React from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Pause,
  AlertCircle,
  Trash2,
} from 'lucide-react';

export interface NotificationAlertData {
  type:
    | 'approved'
    | 'rejected'
    | 'paused'
    | 'deleted'
    | 'archived'
    | 'deletion_approved'
    | 'deletion_denied';
  title: string;
  message: string;
  reason?: string;
  timestamp?: Date;
}

interface NotificationAlertProps {
  data: NotificationAlertData;
  onClose: () => void;
}

export default function NotificationAlert({
  data,
  onClose,
}: NotificationAlertProps) {
  const getAlertStyle = () => {
    switch (data.type) {
      case 'approved':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          iconBg: 'bg-green-100',
          textColor: 'text-green-900',
          titleColor: 'text-green-800',
        };
      case 'rejected':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          iconBg: 'bg-red-100',
          textColor: 'text-red-900',
          titleColor: 'text-red-800',
        };
      case 'paused':
        return {
          bg: 'bg-orange-50 border-orange-200',
          icon: <Pause className="w-6 h-6 text-orange-600" />,
          iconBg: 'bg-orange-100',
          textColor: 'text-orange-900',
          titleColor: 'text-orange-800',
        };
      case 'deleted':
        return {
          bg: 'bg-gray-50 border-gray-300',
          icon: <Trash2 className="w-6 h-6 text-gray-600" />,
          iconBg: 'bg-gray-100',
          textColor: 'text-gray-900',
          titleColor: 'text-gray-800',
        };
      case 'archived':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
          iconBg: 'bg-blue-100',
          textColor: 'text-blue-900',
          titleColor: 'text-blue-800',
        };
      case 'deletion_approved':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <CheckCircle className="w-6 h-6 text-red-600" />,
          iconBg: 'bg-red-100',
          textColor: 'text-red-900',
          titleColor: 'text-red-800',
        };
      case 'deletion_denied':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: <XCircle className="w-6 h-6 text-yellow-600" />,
          iconBg: 'bg-yellow-100',
          textColor: 'text-yellow-900',
          titleColor: 'text-yellow-800',
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: <AlertCircle className="w-6 h-6 text-gray-600" />,
          iconBg: 'bg-gray-100',
          textColor: 'text-gray-900',
          titleColor: 'text-gray-800',
        };
    }
  };

  const style = getAlertStyle();

  return (
    <div
      className={`relative rounded-lg border-2 ${style.bg} p-4 mb-6 shadow-md animate-in slide-in-from-top duration-300`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${style.iconBg} rounded-full p-2`}>
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-semibold ${style.titleColor} mb-1`}>
            {data.title}
          </h3>
          <p className={`text-sm ${style.textColor} mb-2`}>{data.message}</p>

          {/* Reason (if provided) */}
          {data.reason && (
            <div className="mt-3 p-3 bg-white bg-opacity-60 rounded-md border border-current border-opacity-20">
              <p className="text-xs font-medium text-gray-700 mb-1">
                Admin's Reason:
              </p>
              <p className={`text-sm ${style.textColor} italic`}>
                "{data.reason}"
              </p>
            </div>
          )}

          {/* Timestamp */}
          {data.timestamp && (
            <p className="text-xs text-gray-500 mt-2">
              {data.timestamp.toLocaleString()}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
