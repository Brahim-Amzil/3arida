'use client';

import React from 'react';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import FixCreatorNames from '@/components/admin/FixCreatorNames';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminGuard } from '@/lib/auth-guards';
import { useTranslation } from '@/hooks/useTranslation';
import { Wrench, Database, Users, FileText } from 'lucide-react';

export default function AdminMaintenancePage() {
  const { t } = useTranslation();
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useAdminGuard();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!hasRequiredRole) {
    return null; // Will redirect via useAdminGuard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Wrench className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('admin.maintenance.title')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('admin.maintenance.subtitle')}
              </p>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {t('admin.maintenance.warning')}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {t('admin.maintenance.warningText')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Cleanup Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                {t('admin.maintenance.dataCleanup')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fix Creator Names Tool */}
              <FixCreatorNames />

              {/* Placeholder for future tools */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  🔧 Additional Cleanup Tools
                </h4>
                <p className="text-sm text-gray-600">
                  Future maintenance tools will appear here as needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Management Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                {t('admin.maintenance.userManagement')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('admin.maintenance.userMaintenanceTitle')}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t('admin.maintenance.userMaintenanceDesc')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('admin.maintenance.noUserTools')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                {t('admin.maintenance.systemReports')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  📊 Data Quality Reports
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Generate reports on data quality and system health.
                </p>
                <p className="text-xs text-gray-500">
                  Report generation tools coming soon.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Utilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-orange-600" />
                {t('admin.maintenance.systemUtilities')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  🛠️ System Tools
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  System-level utilities and diagnostic tools.
                </p>
                <p className="text-xs text-gray-500">
                  System utilities will be added as needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('admin.maintenance.guidelines')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('admin.maintenance.beforeRunning')}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>{t('admin.maintenance.backupDatabase')}</li>
                  <li>{t('admin.maintenance.notifyAdmins')}</li>
                  <li>{t('admin.maintenance.checkSystemLoad')}</li>
                  <li>{t('admin.maintenance.reviewDocumentation')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('admin.maintenance.afterRunning')}
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>{t('admin.maintenance.verifyResults')}</li>
                  <li>{t('admin.maintenance.checkErrors')}</li>
                  <li>{t('admin.maintenance.testFunctionality')}</li>
                  <li>{t('admin.maintenance.documentChanges')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
