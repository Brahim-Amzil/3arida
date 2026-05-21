'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
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
import type { ReportVerificationData } from '@/lib/report-verification-server';
import { formatReportDate } from '@/lib/report-verification-dates';
import { translateValue } from '@/lib/pdf-translations';

function progressPercent(current: number, target: number): string {
  if (!target) return '0';
  return ((current / target) * 100).toFixed(1);
}

interface ReportVerificationClientProps {
  data: ReportVerificationData;
}

export function ReportVerificationClient({ data }: ReportVerificationClientProps) {
  const [showFullReport, setShowFullReport] = useState(false);

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

  const { petition, reportInfo } = data;
  const pdfReportUrl = `/pdf/petition/${petition.id}`;

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4" dir="rtl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold font-arabic">تقرير عريضة موثّق</h1>
        </div>
        <p className="text-muted-foreground">
          تم التحقق من هذه العريضة على منصة 3arida — نفس مصدر تقرير PDF
        </p>
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
              <Badge variant="outline">المرجع: {petition.referenceCode}</Badge>
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
                {petition.currentSignatures.toLocaleString('ar-MA')}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">الهدف</p>
              <p className="font-semibold">
                {petition.targetSignatures.toLocaleString('ar-MA')}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <FileText className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">نسبة الإنجاز</p>
              <p className="font-semibold">
                {progressPercent(
                  petition.currentSignatures,
                  petition.targetSignatures,
                )}
                %
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">التحميلات</p>
              <p className="font-semibold">{reportInfo.totalDownloads}</p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            البيانات المعروضة هنا من المنصة مباشرة. قد تختلف عن نسخة PDF مطبوعة
            قديمة إذا تغيّرت التوقيعات أو الإحصائيات بعد طباعة التقرير.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
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
            <Button asChild size="lg" variant="outline">
              <Link href={`/petitions/${petition.id}`}>عرض العريضة على المنصة</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showFullReport && (
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg">التقرير الكامل (مطابق لـ PDF)</CardTitle>
            <CardDescription>
              نفس محتوى التقرير المُنشأ عند التحميل — تفاصيل، نص العريضة، إحصائيات،
              والتحقق
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src={pdfReportUrl}
              title={`تقرير عريضة ${petition.referenceCode}`}
              className="w-full min-h-[1400px] border-0 bg-white"
              loading="lazy"
            />
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>تؤكد هذه الصفحة أن العريضة موجودة على 3arida وأن التقرير صادر عن المنصة.</p>
        <p className="mt-2">
          منصة <span className="font-semibold">3arida.org</span> — منصة العرائض
          الرسمية في المغرب
        </p>
      </div>
    </div>
  );
}
