import { NextApiRequest, NextApiResponse } from 'next';
import { PetitionManagementService } from '../../../lib/services/petitionService';
import {
  paginationSchema,
  petitionFiltersSchema,
} from '../../../lib/validation/schemas';
import type { PetitionFilters, PaginationParams } from '../../../types/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      subcategory,
      status,
      search,
      country,
      city,
      region,
      minSignatures,
      maxSignatures,
      hasQrCode,
      tags,
    } = req.query;

    // Validate pagination parameters
    const paginationResult = paginationSchema.safeParse({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    if (!paginationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters',
        errors: paginationResult.error.errors,
      });
    }

    // Build filters
    const filters: PetitionFilters = {};

    if (category) filters.category = category as string;
    if (subcategory) filters.subcategory = subcategory as string;
    if (search) filters.search = search as string;
    if (hasQrCode !== undefined) filters.hasQrCode = hasQrCode === 'true';

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filters.status = statusArray as any[];
    }

    if (country || city || region) {
      filters.location = {};
      if (country) filters.location.country = country as string;
      if (city) filters.location.city = city as string;
      if (region) filters.location.region = region as string;
    }

    if (minSignatures || maxSignatures) {
      filters.signatureRange = {};
      if (minSignatures)
        filters.signatureRange.min = parseInt(minSignatures as string);
      if (maxSignatures)
        filters.signatureRange.max = parseInt(maxSignatures as string);
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      filters.tags = tagsArray as string[];
    }

    // Validate filters
    const filtersResult = petitionFiltersSchema.safeParse(filters);
    if (!filtersResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filter parameters',
        errors: filtersResult.error.errors,
      });
    }

    // Get petitions
    const result = await PetitionManagementService.getPetitions(
      filters,
      paginationResult.data,
      undefined, // No user ID for public endpoint
      'user' // Public access level
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting petitions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
