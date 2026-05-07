import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function parseAndValidateJson<T extends z.ZodTypeAny>(
  request: NextRequest,
  schema: T,
): Promise<{ data: z.infer<T> } | { error: NextResponse }> {
  try {
    const rawBody = await request.json();
    const parsedBody = schema.safeParse(rawBody);

    if (!parsedBody.success) {
      return {
        error: NextResponse.json(
          {
            error: 'Invalid request payload',
            details: parsedBody.error.flatten(),
          },
          { status: 400 },
        ),
      };
    }

    return { data: parsedBody.data };
  } catch {
    return {
      error: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 },
      ),
    };
  }
}

export { z };
