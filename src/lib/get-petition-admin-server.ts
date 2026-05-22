import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import type { Petition } from '@/types/petition';

function convertFirestoreData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && 'toDate' in value) {
      converted[key] = (value as { toDate: () => Date }).toDate().toISOString();
    } else if (Array.isArray(value)) {
      converted[key] = value.map((item) =>
        item && typeof item === 'object' && 'toDate' in item
          ? (item as { toDate: () => Date }).toDate().toISOString()
          : item,
      );
    } else {
      converted[key] = value;
    }
  }

  return converted;
}

/** Server-side petition lookup by document ID or referenceCode (Admin SDK). */
export async function getPetitionByIdAdmin(
  idOrCode: string,
): Promise<Petition | null> {
  const byReference = await adminDb
    .collection('petitions')
    .where('referenceCode', '==', idOrCode)
    .limit(1)
    .get();

  if (!byReference.empty) {
    const doc = byReference.docs[0];
    return { id: doc.id, ...convertFirestoreData(doc.data()) } as Petition;
  }

  const doc = await adminDb.collection('petitions').doc(idOrCode).get();
  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...convertFirestoreData(doc.data()!) } as Petition;
}
