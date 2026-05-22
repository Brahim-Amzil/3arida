'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReportPetitionSnapshot } from '@/lib/report-verification-server';
import { translateValue } from '@/lib/pdf-translations';
import {
  formatPetitionLongDate,
  formatPetitionNumber,
  formatReportGeneratedAt,
} from '@/lib/petition-report-formatters';
import {
  formatSignatureProgressPercent,
  getPetitionReportMetrics,
} from '@/lib/petition-report-metrics';

interface PetitionReportFullViewProps {
  petition: ReportPetitionSnapshot;
  verificationUrl: string;
  petitionUrl: string;
}

function DetailRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-3 border rounded-lg bg-background">
      <span className="text-sm text-muted-foreground">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary underline break-all text-right"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm font-semibold text-right">{value}</span>
      )}
    </div>
  );
}

export function PetitionReportFullView({
  petition,
  verificationUrl,
  petitionUrl,
}: PetitionReportFullViewProps) {
  const { daysRunning, signaturesPerDay, downloadNumber } =
    getPetitionReportMetrics(petition);

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-muted/20">
      {/* Cover */}
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <div>
            <p className="text-2xl font-bold">3arida.org</p>
            <p className="text-muted-foreground">منصة العرائض الرسمية للمغرب</p>
          </div>
          <div>
            <p className="text-xl font-bold">تقرير عريضة رسمي</p>
            <p className="text-lg mt-2">{petition.title}</p>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>الرمز المرجعي للعريضة: {petition.referenceCode}</p>
            <p>تاريخ الإنشاء: {formatPetitionLongDate(petition.createdAt)}</p>
          </div>
          <div className="flex justify-center py-2">
            <QRCodeSVG value={verificationUrl} size={180} level="H" />
          </div>
          <p className="text-sm text-muted-foreground">
            امسح رمز QR للتحقق من صحة التقرير
          </p>
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline break-all"
          >
            {verificationUrl}
          </a>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل العريضة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">المعلومات الأساسية</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailRow label="العنوان:" value={petition.title} />
              <DetailRow
                label="نوع العريضة:"
                value={translateValue(petition.petitionType, 'petitionType')}
              />
              <DetailRow
                label="الفئة:"
                value={translateValue(petition.category, 'category')}
              />
              <DetailRow
                label="الفئة الفرعية:"
                value={translateValue(petition.subcategory, 'subcategory')}
              />
              <DetailRow
                label="موجهة إلى:"
                value={translateValue(petition.addressedToType, 'addressedToType')}
              />
              <DetailRow
                label="الرمز المرجعي:"
                value={petition.referenceCode}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">معلومات الناشر</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailRow
                label="نوع الناشر:"
                value={translateValue(petition.publisherType, 'publisherType')}
              />
              <DetailRow
                label="اسم الناشر:"
                value={petition.creatorName || petition.publisherName || '—'}
              />
              <DetailRow
                label="تاريخ الإنشاء:"
                value={formatPetitionLongDate(petition.createdAt)}
              />
              <DetailRow
                label="الحالة:"
                value={translateValue(petition.status, 'status')}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">معلومات الباقة</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailRow
                label="الباقة:"
                value={translateValue(petition.pricingTier, 'pricingTier')}
              />
              <DetailRow
                label="الهدف:"
                value={`${formatPetitionNumber(petition.targetSignatures)} توقيع`}
              />
            </div>
          </div>

          <DetailRow
            label="رابط العريضة:"
            value={petitionUrl}
            href={petitionUrl}
          />
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>محتوى العريضة</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-3">نص العريضة</h3>
          <div className="text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {petition.description || '—'}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>الإحصائيات والتأثير</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">إحصائيات التوقيعات</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['إجمالي التوقيعات', petition.currentSignatures],
                ['الهدف', petition.targetSignatures],
                [
                  'نسبة الإنجاز من التوقيعات المُستهدفة',
                  formatSignatureProgressPercent(
                    petition.currentSignatures,
                    petition.targetSignatures,
                  ),
                ],
                ['توقيعات/يوم', signaturesPerDay],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="text-center p-4 border rounded-lg"
                >
                  <p className="text-2xl font-bold mb-1">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">إحصائيات التفاعل</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailRow
                label="إجمالي المشاهدات:"
                value={String(petition.viewCount)}
              />
              <DetailRow
                label="إجمالي المشاركات:"
                value={String(petition.shareCount)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">الجدول الزمني</h3>
            <div className="space-y-3">
              <DetailRow
                label="تاريخ الإنشاء:"
                value={formatPetitionLongDate(petition.createdAt)}
              />
              {petition.approvedAt && (
                <DetailRow
                  label="تاريخ الموافقة:"
                  value={formatPetitionLongDate(petition.approvedAt)}
                />
              )}
              <DetailRow label="المدة:" value={`${daysRunning} يوم`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification */}
      <Card>
        <CardHeader>
          <CardTitle>التحقق والمعلومات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <DetailRow label="تاريخ إنشاء التقرير:" value={formatReportGeneratedAt()} />
            <DetailRow
              label="تم الإنشاء بواسطة:"
              value={petition.creatorName || '—'}
            />
            <DetailRow label="رقم التحميل:" value={`#${downloadNumber}`} />
          </div>

          <div>
            <h3 className="font-semibold mb-2">رابط التحقق</h3>
            <p className="text-sm text-muted-foreground mb-2">
              للتحقق من صحة هذا التقرير، قم بزيارة:
            </p>
            <a
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs font-semibold text-primary underline break-all border rounded-lg p-3 bg-background"
            >
              {verificationUrl}
            </a>
          </div>

          <div className="text-sm space-y-2">
            <p>
              <span className="text-muted-foreground">المنصة:</span>{' '}
              <span className="font-semibold">3arida.org</span>
            </p>
            <p>
              <span className="text-muted-foreground">الوصف:</span>{' '}
              <span className="font-semibold">منصة العرائض الرسمية للمغرب</span>
            </p>
            <p>
              <span className="text-muted-foreground">التواصل:</span>{' '}
              <a
                href="mailto:support@3arida.org"
                className="font-semibold text-primary underline"
              >
                support@3arida.org
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
