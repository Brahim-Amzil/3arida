'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminPetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const petitionId = params.id as string;

  useEffect(() => {
    // Redirect to the public petition page which has full content + admin controls
    router.replace(`/petitions/${petitionId}`);
  }, [petitionId, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  );
}
