/** Normalize Firestore document values for JSON / client components. */
export function serializeFirestoreValue(value: unknown): unknown {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestoreValue(item));
  }
  return value;
}

export function serializeFirestoreDocument(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    serialized[key] = serializeFirestoreValue(value);
  }
  return serialized;
}
