import { NextApiRequest, NextApiResponse } from 'next';
import {
  requirePetitionCreationAuth,
  AuthenticatedRequest,
} from '../../../lib/firebase/middleware';
import { PetitionManagementService } from '../../../lib/services/petitionService';
import type { CreatePetitionData } from '../../../lib/services/petitionService';
import formidable from 'formidable';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('=== PETITION CREATE API CALLED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Content-Type:', req.headers['content-type']);
  console.log(
    'Authorization:',
    req.headers.authorization ? 'Present' : 'Missing'
  );
  console.log('User-Agent:', req.headers['user-agent']);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting petition creation process...');

    // Apply petition creation middleware (requires auth + email verification)
    console.log('Applying authentication middleware...');
    try {
      await new Promise<void>((resolve, reject) => {
        requirePetitionCreationAuth(req, res, (error?: any) => {
          if (error) {
            console.error('Middleware error:', error);
            return reject(error);
          } else {
            console.log('Middleware passed successfully');
            resolve();
          }
        });
      });
    } catch (middlewareError) {
      console.error('Middleware failed:', middlewareError);
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        details:
          middlewareError instanceof Error
            ? middlewareError.message
            : 'Unknown middleware error',
      });
    }

    const user = (req as AuthenticatedRequest).user;
    console.log('Authenticated user:', {
      id: user.id,
      email: user.email,
      verifiedEmail: user.verifiedEmail,
    });

    console.log(
      'User authentication successful, proceeding with petition creation...'
    );

    // Check content type and parse accordingly
    const contentType = req.headers['content-type'] || '';
    console.log('Content type:', contentType);

    let title: string,
      description: string,
      category: string,
      subcategory: string | undefined,
      requiredSignatures: number,
      tier: string;
    let mediaFiles: any[] = [];

    if (contentType.includes('application/json')) {
      // Handle JSON request - need to manually parse since bodyParser is disabled
      console.log('Parsing JSON data...');
      let body: any;
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const rawBody = Buffer.concat(chunks).toString();
        body = JSON.parse(rawBody);
        console.log('JSON body:', body);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON data',
        });
      }

      title = body.title;
      description = body.description;
      category = body.category;
      subcategory = body.subcategory;
      requiredSignatures = parseInt(body.requiredSignatures || '2500');
      tier = body.tier;
    } else if (contentType.includes('multipart/form-data')) {
      // Handle FormData request
      console.log('Parsing form data...');
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
        keepExtensions: true,
      });

      let fields: any, files: any;
      try {
        [fields, files] = await form.parse(req);
      } catch (parseError) {
        console.error('Form parsing error:', parseError);
        return res.status(400).json({
          success: false,
          error: 'Failed to parse form data',
        });
      }

      console.log('Form fields:', fields);
      console.log('Form files:', files ? Object.keys(files) : 'No files');

      // Extract form fields
      title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description;
      category = Array.isArray(fields.category)
        ? fields.category[0]
        : fields.category;
      subcategory = Array.isArray(fields.subcategory)
        ? fields.subcategory[0]
        : fields.subcategory;
      requiredSignatures = parseInt(
        Array.isArray(fields.requiredSignatures)
          ? fields.requiredSignatures[0]
          : fields.requiredSignatures || '2500'
      );
      tier = Array.isArray(fields.tier) ? fields.tier[0] : fields.tier;

      // Handle media files - use formidable file objects directly
      if (files && files.media) {
        const mediaFileArray = Array.isArray(files.media)
          ? files.media
          : [files.media];
        for (const file of mediaFileArray) {
          if (file.filepath) {
            mediaFiles.push({
              filepath: file.filepath,
              originalFilename: file.originalFilename || 'media',
              mimetype: file.mimetype || 'application/octet-stream',
              size: file.size,
            });
          }
        }
      }
    } else {
      console.error('Unsupported content type:', contentType);
      return res.status(400).json({
        success: false,
        error:
          'Unsupported content type. Use application/json or multipart/form-data',
      });
    }

    // Validate required fields
    console.log('Form data received:', {
      title,
      description: description?.substring(0, 50) + '...',
      category,
      subcategory,
      requiredSignatures,
      tier,
    });

    if (!title || !description || !category || !requiredSignatures) {
      console.error('Missing required fields:', {
        title: !!title,
        description: !!description,
        category: !!category,
        requiredSignatures: !!requiredSignatures,
      });
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: title, description, category, requiredSignatures',
      });
    }

    console.log('Field validation passed, calculating pricing tier...');

    // Calculate pricing tier
    console.log('Calculating pricing tier for signatures:', requiredSignatures);
    const { tier: calculatedTier, price } =
      PetitionManagementService.calculatePricingTier(requiredSignatures);
    console.log('Calculated tier:', calculatedTier, 'price:', price);

    // Prepare petition data
    const petitionData: CreatePetitionData = {
      title,
      description,
      category,
      subcategory,
      targetSignatures: requiredSignatures,
      pricingTier: calculatedTier,
      mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined,
      tags: [],
      location: undefined,
      isPublic: true,
    };

    console.log('Petition data prepared:', {
      ...petitionData,
      mediaFiles: petitionData.mediaFiles?.length || 0,
    });

    // Create petition directly using adminDb (same as working direct endpoint)
    console.log('Creating petition directly...');
    const { adminDb } = await import('../../../lib/firebase/admin');

    if (!adminDb) {
      throw new Error('adminDb is undefined after import');
    }

    // Filter out undefined values for Firestore
    const cleanPetitionData = Object.fromEntries(
      Object.entries(petitionData).filter(([_, value]) => value !== undefined)
    );

    const petitionDoc = {
      ...cleanPetitionData,
      creatorId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      signatureCount: 0,
      pricingTier: calculatedTier,
    };

    console.log('Adding petition to Firestore...');
    const petitionsCollection = adminDb.collection('petitions');
    const docRef = await petitionsCollection.add(petitionDoc);
    console.log('Petition created with ID:', docRef.id);

    const result = {
      success: true,
      data: {
        id: docRef.id,
        ...petitionDoc,
      },
    };

    console.log('Petition creation result:', {
      success: result.success,
      petitionId: result.data.id,
    });

    // Include pricing information in response
    res.status(201).json({
      ...result,
      pricing: {
        tier: calculatedTier,
        price,
        requiresPayment: price > 0,
      },
    });
  } catch (error) {
    console.error('Petition creation error:', error);
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.stack
          : undefined,
    });
  }
}
