import { NextApiRequest, NextApiResponse } from 'next';
import { PetitionManagementService } from '../../../lib/services/petitionService';
import { UserService } from '../../../lib/firebase/firestore';
import type { CreatePetitionData } from '../../../lib/services/petitionService';

// Test endpoint without authentication to debug the core functionality
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Test petition creation request received');

    // Mock user ID for testing
    const mockUserId = 'test-user-123';

    // Create a test user first
    console.log('Creating test user...');
    try {
      await UserService.createUser({
        name: 'Test User',
        email: 'test@example.com',
        verifiedEmail: true, // Set to true to bypass email verification
        verifiedPhone: false,
        role: 'user',
        isActive: true,
      });
      console.log('Test user created successfully');
    } catch (userError) {
      console.log('Test user might already exist, continuing...');
    }

    // Simple test data
    const testPetitionData: CreatePetitionData = {
      title: 'Test Petition for Debugging',
      description:
        'This is a test petition to debug the creation process. It should be at least 50 characters long to pass validation.',
      category: 'Environment',
      subcategory: 'Climate Change',
      targetSignatures: 1000,
      pricingTier: 'free',
      tags: ['test', 'debug'],
      isPublic: true,
    };

    console.log('Creating petition with test data:', testPetitionData);

    // Try to create petition
    const result = await PetitionManagementService.createPetition(
      mockUserId,
      testPetitionData
    );

    console.log('Petition creation result:', result);

    if (!result.success) {
      console.error('Petition creation failed:', {
        error: result.error,
        errors: result.errors,
      });
    }

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Test petition created successfully',
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        errors: result.errors,
      });
    }
  } catch (error) {
    console.error('Test petition creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
