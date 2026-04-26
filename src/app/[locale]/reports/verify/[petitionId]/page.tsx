/**
 * Report Verification Page
 *
 * Displays verification information for a petition report
 * Accessed by scanning QR code on report
 */

import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle, FileText, Calendar, Users, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface VerificationPageProps {
  params: {
    locale: string;
    petitionId: string;
  };
}

async function getVerificationData(petitionId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/reports/verify/${petitionId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching verification data:', error);
    return null;
  }
}

export default async function VerificationPage({ params }: VerificationPageProps) {
  const { petitionId } = params;
  const data = await getVerificationData(petitionId);

  if (!data || !data.valid) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Invalid Report</CardTitle>
            </div>
            <CardDescription>
              Petition not found or report does not exist
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { petition, reportInfo } = data;

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold">Verified Petition Report</h1>
        </div>
        <p className="text-muted-foreground">
          This report has been verified and is authentic
        </p>
      </div>

      {/* Petition Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Petition Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{petition.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Reference: {petition.referenceCode}
              </Badge>
              <Badge variant="secondary">{petition.status}</Badge>
              <Badge variant="outline">{petition.category}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Current Signatures</p>
                <p className="font-semibold">{petition.currentSignatures.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Target</p>
                <p className="font-semibold">{petition.targetSignatures.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-semibold">
                  {new Date(petition.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-semibold">
                  {((petition.currentSignatures / petition.targetSignatures) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Downloads</span>
            <span className="font-semibold">{reportInfo.totalDownloads}</span>
          </div>
          {reportInfo.lastDownloaded && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Downloaded</span>
              <span className="font-semibold">
                {new Date(reportInfo.lastDownloaded).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center">
        <Link href={`/petitions/${petitionId}`}>
          <Button size="lg">View Full Petition</Button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>This verification page confirms the authenticity of the petition report.</p>
        <p className="mt-2">
          Generated by <span className="font-semibold">3arida.org</span> - Official Petition
          Platform for Morocco
        </p>
      </div>
    </div>
  );
}
