'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  XCircle,
  FileText,
  Calendar,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { PetitionReportFullView } from '@/components/reports/PetitionReportFullView';
import { ReportLegalNotice } from '@/components/reports/ReportLegalNotice';
import { ReportDownloadButton } from '@/components/petitions/ReportDownloadButton';
import { ReportPaymentModal } from '@/components/petitions/ReportPaymentModal';
import { ReportDownloadLimitModal } from '@/components/petitions/ReportDownloadLimitModal';
import { PetitionUpgradeModal } from '@/components/petitions/PetitionUpgradeModal';
import type { ReportVerificationData } from '@/lib/report-verification-server';
import { formatReportDate } from '@/lib/report-verification-dates';
import { formatSignatureProgressPercent } from '@/lib/petition-report-metrics';
import { formatPetitionNumber } from '@/lib/petition-report-formatters';
import { translateValue } from '@/lib/pdf-translations';
import type { Petition, PricingTier } from '@/types/petition';

interface ReportVerificationClientProps {
  data: ReportVerificationData;
}

function snapshotToPetition(
  petition: Extract<ReportVerificationData, { valid: true }>['petition'],
): Petition {
  return {
    id: petition.id,
    creatorId: petition.creatorId || '',
    title: petition.title,
    description: petition.description,
    referenceCode: petition.referenceCode,
    petitionType: petition.petitionType,
    category: petition.category,
    subcategory: petition.subcategory,
    addressedToType: petition.addressedToType,
    publisherType: petition.publisherType,
    publisherName: petition.publisherName,
    creatorName: petition.creatorName,
    status: petition.status as Petition['status'],
    pricingTier: petition.pricingTier as Petition['pricingTier'],
    targetSignatures: petition.targetSignatures,
    currentSignatures: petition.currentSignatures,
    viewCount: petition.viewCount,
    shareCount: petition.shareCount,
    createdAt: petition.createdAt,
    approvedAt: petition.approvedAt,
    reportDownloads: petition.reportDownloads,
  } as unknown as Petition;
}

export function ReportVerificationClient({ data }: ReportVerificationClientProps) {
  const { user } = useAuth();
  const [showFullReport, setShowFullReport] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  if (!data.valid) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4" dir="rtl">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle>تقرير غير صالح</CardTitle>
            </div>
            <CardDescription>
              العريضة غير موجودة أو التقرير غير متوفر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/petitions">العودة إلى العرائض</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { petition, urls, reportInfo } = data;
  const isCreator =
    Boolean(user?.uid) &&
    Boolean(petition.creatorId) &&
    user?.uid === petition.creatorId;
  const petitionForDownload = snapshotToPetition(petition);

  const handleTierSelect = async (
    selectedTier: PricingTier,
    _upgradePrice: number,
  ) => {
    try {
      const response = await fetch('/api/petitions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petitionId: petition.id,
          currentTier: petition.pricingTier,
          selectedTier,
          userId: user?.uid,
          userEmail: user?.email?.trim() || undefined,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'فشلت الترقية');
      }
      setShowUpgradeModal(false);
      window.location.reload();
    } catch (error) {
      alert(
        'فشلت الترقية: ' +
          (error instanceof Error ? error.message : 'خطأ غير معروف'),
      );
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4" dir="rtl">
      <div className="mb-8 space-y-5">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold font-arabic">
            صفحة التحقق من تقرير العريضة
          </h1>
          <p className="text-base">
            هذا التقرير صادر عن منصة{' '}
            <span className="font-semibold">3arida.org</span>
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            أنت الآن على صفحة التحقق الرسمية. البيانات المعروضة أدناه هي المرجع
            المعتمد من المنصة — يُرجى قراءة الإشعار القانوني قبل المقارنة مع أي
            نسخة ورقية.
          </p>
        </div>

        <ReportLegalNotice />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-center text-lg text-muted-foreground">
            3arida.org — تقرير عريضة رسمي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {petition.imageUrl && (
            <div className="relative w-full aspect-[16/9] max-h-72 rounded-lg overflow-hidden border bg-muted">
              <Image
                src={petition.imageUrl}
                alt={petition.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <div className="text-center">
            <h2 className="font-semibold text-xl mb-3">{petition.title}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline">الرقم المرجعي : {petition.referenceCode}</Badge>
              <Badge variant="secondary">
                {translateValue(petition.status, 'status')}
              </Badge>
              <Badge variant="outline">
                {translateValue(petition.category, 'category')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              تاريخ الإنشاء: {formatReportDate(petition.createdAt)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">التوقيعات</p>
              <p className="font-semibold">
                {formatPetitionNumber(petition.currentSignatures)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">الهدف</p>
              <p className="font-semibold">
                {formatPetitionNumber(petition.targetSignatures)}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <FileText className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                نسبة الإنجاز من التوقيعات المُستهدفة
              </p>
              <p className="font-semibold">
                {formatSignatureProgressPercent(
                  petition.currentSignatures,
                  petition.targetSignatures,
                )}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">التحميلات</p>
              <p className="font-semibold">{reportInfo.totalDownloads}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center pt-2">
            <Button
              size="lg"
              onClick={() => setShowFullReport((open) => !open)}
              className="gap-2"
            >
              {showFullReport ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  إخفاء التقرير الكامل
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  عرض التقرير الكامل
                </>
              )}
            </Button>
            {isCreator && user && petition.status === 'approved' && (
              <div className="w-full sm:w-auto sm:min-w-[240px]">
                <ReportDownloadButton
                  petition={petitionForDownload}
                  userId={user.uid}
                  onUpgrade={() => setShowUpgradeModal(true)}
                  onPayment={() => setShowPaymentModal(true)}
                  onLimitChoice={() => setShowLimitModal(true)}
                />
              </div>
            )}
            <Button asChild size="lg" variant="outline">
              <Link href={`/petitions/${petition.id}`}>عرض العريضة على المنصة</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showFullReport && (
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg">التقرير الكامل</CardTitle>
            <CardDescription>
              نفس أقسام تقرير PDF — التفاصيل، النص، الإحصائيات، والتحقق
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <PetitionReportFullView
              petition={petition}
              verificationUrl={urls.verification}
              petitionUrl={urls.petition}
            />
          </CardContent>
        </Card>
      )}

      <p className="text-center text-sm text-muted-foreground">
        منصة <span className="font-semibold">3arida.org</span> — منصة العرائض
        الرسمية في المغرب
      </p>

      {showLimitModal && (
        <ReportDownloadLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          onPay={() => {
            setShowLimitModal(false);
            setShowPaymentModal(true);
          }}
          onUpgrade={() => {
            setShowLimitModal(false);
            setShowUpgradeModal(true);
          }}
        />
      )}

      {showPaymentModal && (
        <ReportPaymentModal
          petition={petitionForDownload}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {showUpgradeModal && (
        <PetitionUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          petitionId={petition.id}
          currentTier={(petition.pricingTier || 'free') as PricingTier}
          onTierSelect={handleTierSelect}
        />
      )}
    </div>
  );
}
