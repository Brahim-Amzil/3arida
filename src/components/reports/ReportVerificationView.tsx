import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Users,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReportVerificationData } from '@/lib/report-verification-server';

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function progressPercent(current: number, target: number): string {
  if (!target) return '0';
  return ((current / target) * 100).toFixed(1);
}

interface ReportVerificationViewProps {
  data: ReportVerificationData;
}

export function ReportVerificationView({ data }: ReportVerificationViewProps) {
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

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4" dir="rtl">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold font-arabic">تقرير عريضة موثّق</h1>
        </div>
        <p className="text-muted-foreground">
          تم التحقق من هذا التقرير — وهو صادر عن منصة 3arida
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            معلومات العريضة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{petition.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">المرجع: {petition.referenceCode}</Badge>
              <Badge variant="secondary">{petition.status}</Badge>
              <Badge variant="outline">{petition.category}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">التوقيعات الحالية</p>
                <p className="font-semibold">
                  {petition.currentSignatures.toLocaleString('ar-MA')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">الهدف</p>
                <p className="font-semibold">
                  {petition.targetSignatures.toLocaleString('ar-MA')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                <p className="font-semibold">{formatDate(petition.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">نسبة التقدم</p>
                <p className="font-semibold">
                  {progressPercent(
                    petition.currentSignatures,
                    petition.targetSignatures,
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>معلومات التقرير</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center gap-4">
            <span className="text-muted-foreground">إجمالي التحميلات</span>
            <span className="font-semibold">{reportInfo.totalDownloads}</span>
          </div>
          {reportInfo.lastDownloaded && (
            <div className="flex justify-between items-center gap-4">
              <span className="text-muted-foreground">آخر تحميل</span>
              <span className="font-semibold">
                {formatDate(reportInfo.lastDownloaded)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Link href={`/petitions/${petition.id}`}>
          <Button size="lg">عرض العريضة كاملة</Button>
        </Link>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>تؤكد هذه الصفحة صحة تقرير العريضة المطبوع أو الممسوح ضوئياً.</p>
        <p className="mt-2">
          منصة <span className="font-semibold">3arida.org</span> — منصة العرائض
          الرسمية في المغرب
        </p>
      </div>
    </div>
  );
}
