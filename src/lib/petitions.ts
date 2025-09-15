import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { notifySignatureMilestone } from './notifications';
import {
  validateSignatureAuthenticity,
  trackSignatureAttempt,
  generateSignatureFingerprint,
} from './security-tracking';
import { moderateComment } from './content-moderation';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import {
  Petition,
  PetitionFormData,
  PetitionFilters,
  PaginationInfo,
  Category,
  Signature,
  User,
} from '../types/petition';
import {
  validatePetitionData,
  DEFAULT_CATEGORIES,
  calculatePricingTier,
  calculatePetitionPrice,
} from './petition-utils';

// Collection references
const PETITIONS_COLLECTION = 'petitions';
const SIGNATURES_COLLECTION = 'signatures';
const CATEGORIES_COLLECTION = 'categories';
const USERS_COLLECTION = 'users';

// Petition CRUD Operations

/**
 * Create a new petition
 */
export const createPetition = async (
  petitionData: PetitionFormData,
  creatorId: string,
  creatorName: string
): Promise<Petition> => {
  // Validate petition data
  const validationErrors = validatePetitionData(petitionData);
  if (validationErrors.length > 0) {
    throw new Error(
      `Validation failed: ${validationErrors.map((e) => e.message).join(', ')}`
    );
  }

  try {
    const now = new Date();
    const pricingTier = calculatePricingTier(petitionData.targetSignatures);
    const amountRequired = calculatePetitionPrice(
      petitionData.targetSignatures
    );

    const petitionDoc: Omit<Petition, 'id'> = {
      title: petitionData.title.trim(),
      description: petitionData.description.trim(),
      category: petitionData.category,
      subcategory: petitionData.subcategory,
      targetSignatures: petitionData.targetSignatures,
      currentSignatures: 0,
      status: amountRequired > 0 ? 'draft' : 'pending', // Free petitions go to pending, paid ones stay draft until payment
      creatorId,
      mediaUrls: petitionData.mediaUrls || [],
      qrCodeUrl: '',
      hasQrCode: false,
      pricingTier,
      amountPaid: 0,
      paymentStatus: amountRequired > 0 ? 'unpaid' : 'paid',

      // Location targeting
      location: petitionData.location,

      // Metadata
      createdAt: now,
      updatedAt: now,

      // Analytics
      viewCount: 0,
      shareCount: 0,

      // Public visibility
      isPublic: true,
      isActive: true,
    };

    const docRef = await addDoc(collection(db, PETITIONS_COLLECTION), {
      ...petitionDoc,
      createdAt: Timestamp.fromDate(petitionDoc.createdAt),
      updatedAt: Timestamp.fromDate(petitionDoc.updatedAt),
    });

    const createdPetition: Petition = {
      ...petitionDoc,
      id: docRef.id,
    };

    return createdPetition;
  } catch (error) {
    console.error('Error creating petition:', error);
    throw new Error('Failed to create petition. Please try again.');
  }
};

/**
 * Get a petition by ID
 */
export const getPetition = async (
  petitionId: string
): Promise<Petition | null> => {
  try {
    const docRef = doc(db, PETITIONS_COLLECTION, petitionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const petition: Petition = {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      targetSignatures: data.targetSignatures,
      currentSignatures: data.currentSignatures || 0,
      status: data.status,
      creatorId: data.creatorId,
      creatorPageId: data.creatorPageId,
      mediaUrls: data.mediaUrls || [],
      qrCodeUrl: data.qrCodeUrl,
      hasQrCode: data.hasQrCode || false,
      pricingTier: data.pricingTier,
      amountPaid: data.amountPaid || 0,
      paymentStatus: data.paymentStatus || 'unpaid',

      // Location
      location: data.location,

      // Metadata
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      approvedAt: data.approvedAt?.toDate(),
      pausedAt: data.pausedAt?.toDate(),
      deletedAt: data.deletedAt?.toDate(),

      // Analytics
      viewCount: data.viewCount || 0,
      shareCount: data.shareCount || 0,

      // Moderation
      moderatedBy: data.moderatedBy,
      moderationNotes: data.moderationNotes,

      // Public visibility
      isPublic: data.isPublic !== false,
      isActive: data.isActive !== false,
    };

    return petition;
  } catch (error) {
    console.error('Error getting petition:', error);
    throw new Error('Failed to load petition. Please try again.');
  }
};

/**
 * Update a petition
 */
export const updatePetition = async (
  petitionId: string,
  updates: Partial<PetitionFormData>,
  userId: string
): Promise<void> => {
  try {
    // First, verify the user owns this petition
    const petition = await getPetition(petitionId);
    if (!petition) {
      throw new Error('Petition not found');
    }

    if (petition.creatorId !== userId) {
      throw new Error('You do not have permission to update this petition');
    }

    // Only allow updates to petitions that can be edited
    if (petition.status !== 'draft' && petition.status !== 'pending') {
      throw new Error('Cannot update petition in current status');
    }

    // Validate updates if provided
    if (Object.keys(updates).length > 0) {
      const updatedData = { ...petition, ...updates };
      const validationErrors = validatePetitionData(updatedData);
      if (validationErrors.length > 0) {
        throw new Error(
          `Validation failed: ${validationErrors
            .map((e) => e.message)
            .join(', ')}`
        );
      }
    }

    const docRef = doc(db, PETITIONS_COLLECTION, petitionId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    // Recalculate pricing if target signatures changed
    if (updates.targetSignatures) {
      const newPricingTier = calculatePricingTier(updates.targetSignatures);
      const newAmount = calculatePetitionPrice(updates.targetSignatures);

      updateData.pricingTier = newPricingTier;

      // If amount changed and not yet paid, update payment status
      if (
        newAmount !== petition.amountPaid &&
        petition.paymentStatus === 'unpaid'
      ) {
        updateData.paymentStatus = newAmount > 0 ? 'unpaid' : 'paid';
        updateData.status = newAmount > 0 ? 'draft' : 'pending';
      }
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating petition:', error);
    throw new Error('Failed to update petition. Please try again.');
  }
};

/**
 * Delete a petition
 */
export const deletePetition = async (
  petitionId: string,
  userId: string
): Promise<void> => {
  try {
    // First, verify the user owns this petition
    const petition = await getPetition(petitionId);
    if (!petition) {
      throw new Error('Petition not found');
    }

    if (petition.creatorId !== userId) {
      throw new Error('You do not have permission to delete this petition');
    }

    // Only allow deletion of draft or pending petitions
    if (petition.status !== 'draft' && petition.status !== 'pending') {
      throw new Error('Cannot delete petition in current status');
    }

    // Delete associated files if they exist
    if (petition.mediaUrls && petition.mediaUrls.length > 0) {
      try {
        const deletePromises = petition.mediaUrls.map((url) => {
          const mediaRef = ref(storage, url);
          return deleteObject(mediaRef);
        });
        await Promise.all(deletePromises);
      } catch (error) {
        console.warn('Failed to delete petition media:', error);
      }
    }

    if (petition.qrCodeUrl) {
      try {
        const qrRef = ref(storage, petition.qrCodeUrl);
        await deleteObject(qrRef);
      } catch (error) {
        console.warn('Failed to delete petition QR code:', error);
      }
    }

    // Delete the petition document
    const docRef = doc(db, PETITIONS_COLLECTION, petitionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting petition:', error);
    throw new Error('Failed to delete petition. Please try again.');
  }
};

/**
 * Sign a petition
 */
export const signPetition = async (
  petitionId: string,
  signerData: {
    name: string;
    phone: string;
    location?: { country: string; city?: string };
    comment?: string;
    isAnonymous?: boolean;
  },
  userId?: string,
  ipAddress: string = '',
  userAgent: string = ''
): Promise<void> => {
  const now = new Date();

  try {
    // Get petition to verify it can be signed
    const petition = await getPetition(petitionId);
    if (!petition) {
      await trackSignatureAttempt({
        petitionId,
        ipAddress,
        userAgent,
        phoneNumber: signerData.phone,
        userId,
        success: false,
        reason: 'Petition not found',
      });
      throw new Error('Petition not found');
    }

    if (petition.status !== 'approved') {
      await trackSignatureAttempt({
        petitionId,
        ipAddress,
        userAgent,
        phoneNumber: signerData.phone,
        userId,
        success: false,
        reason: 'Petition not approved',
      });
      throw new Error('This petition is not available for signing');
    }

    if (petition.currentSignatures >= petition.targetSignatures) {
      await trackSignatureAttempt({
        petitionId,
        ipAddress,
        userAgent,
        phoneNumber: signerData.phone,
        userId,
        success: false,
        reason: 'Target reached',
      });
      throw new Error('This petition has reached its signature goal');
    }

    // Validate signature authenticity and security
    const securityCheck = await validateSignatureAuthenticity(
      petitionId,
      signerData.phone,
      ipAddress,
      userAgent
    );

    if (!securityCheck.valid) {
      await trackSignatureAttempt({
        petitionId,
        ipAddress,
        userAgent,
        phoneNumber: signerData.phone,
        userId,
        success: false,
        reason: securityCheck.reason,
      });
      throw new Error(securityCheck.reason || 'Security validation failed');
    }

    // Moderate comment if provided
    if (signerData.comment) {
      const moderationResult = moderateComment(signerData.comment);
      if (!moderationResult.approved) {
        await trackSignatureAttempt({
          petitionId,
          ipAddress,
          userAgent,
          phoneNumber: signerData.phone,
          userId,
          success: false,
          reason: `Comment moderation failed: ${moderationResult.reasons.join(
            ', '
          )}`,
        });
        throw new Error(
          'Your comment contains inappropriate content. Please revise and try again.'
        );
      }
    }

    // Check if user already signed (if userId provided)
    if (userId) {
      const existingSignature = await checkExistingSignature(
        petitionId,
        userId
      );
      if (existingSignature) {
        throw new Error('You have already signed this petition');
      }
    }

    // Check for duplicate phone number
    const phoneSignature = await checkPhoneSignature(
      petitionId,
      signerData.phone
    );
    if (phoneSignature) {
      throw new Error(
        'This phone number has already been used to sign this petition'
      );
    }

    // Create signature with security fingerprint
    const signatureFingerprint = generateSignatureFingerprint(
      signerData.phone,
      ipAddress,
      userAgent,
      now
    );

    const signatureData = {
      petitionId,
      signerName: signerData.isAnonymous ? 'Anonymous' : signerData.name,
      signerPhone: signerData.phone,
      signerLocation: signerData.location,
      verificationMethod: 'phone_otp' as const,
      verifiedAt: now,
      ipAddress,
      userAgent,
      fingerprint: signatureFingerprint,
      isAnonymous: signerData.isAnonymous || false,
      comment: signerData.comment,
      createdAt: now,
    };

    // Add signature to collection
    await addDoc(collection(db, SIGNATURES_COLLECTION), {
      ...signatureData,
      verifiedAt: Timestamp.fromDate(signatureData.verifiedAt),
      createdAt: Timestamp.fromDate(signatureData.createdAt),
    });

    // Increment petition signature count
    const petitionRef = doc(db, PETITIONS_COLLECTION, petitionId);
    await updateDoc(petitionRef, {
      currentSignatures: increment(1),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Check for milestone notifications
    const newSignatureCount = petition.currentSignatures + 1;
    const progress = (newSignatureCount / petition.targetSignatures) * 100;
    const milestones = [25, 50, 75, 100];

    for (const milestone of milestones) {
      const previousProgress =
        (petition.currentSignatures / petition.targetSignatures) * 100;
      if (progress >= milestone && previousProgress < milestone) {
        try {
          await notifySignatureMilestone(
            petitionId,
            petition.creatorId,
            petition.title,
            newSignatureCount,
            milestone
          );
        } catch (notificationError) {
          console.error(
            'Error sending milestone notification:',
            notificationError
          );
          // Don't fail the signature process if notification fails
        }
        break; // Only send one milestone notification per signature
      }
    }

    // Track successful signature attempt
    await trackSignatureAttempt({
      petitionId,
      ipAddress,
      userAgent,
      phoneNumber: signerData.phone,
      userId,
      success: true,
    });
  } catch (error) {
    console.error('Error signing petition:', error);

    // Track failed attempt if not already tracked
    if (
      !error.message.includes('already been used') &&
      !error.message.includes('Too many signatures') &&
      !error.message.includes('inappropriate content')
    ) {
      await trackSignatureAttempt({
        petitionId,
        ipAddress,
        userAgent,
        phoneNumber: signerData.phone,
        userId,
        success: false,
        reason: error.message,
      });
    }

    throw new Error('Failed to sign petition. Please try again.');
  }
};

/**
 * Check if user already signed petition
 */
const checkExistingSignature = async (
  petitionId: string,
  userId: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, SIGNATURES_COLLECTION),
      where('petitionId', '==', petitionId),
      where('userId', '==', userId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking existing signature:', error);
    return false;
  }
};

/**
 * Check if phone number already used for petition
 */
const checkPhoneSignature = async (
  petitionId: string,
  phone: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, SIGNATURES_COLLECTION),
      where('petitionId', '==', petitionId),
      where('signerPhone', '==', phone),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking phone signature:', error);
    return false;
  }
};

/**
 * Get petitions with filtering and pagination
 */
export const getPetitions = async (
  filters: PetitionFilters = {},
  pagination: PaginationInfo = { page: 1, limit: 12, total: 0, hasMore: false }
): Promise<{ petitions: Petition[]; pagination: PaginationInfo }> => {
  try {
    let q = query(collection(db, PETITIONS_COLLECTION));

    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    } else {
      // Default to approved petitions for public viewing
      q = query(q, where('status', '==', 'approved'));
    }

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    // Apply sorting
    const sortField =
      filters.sortBy === 'popular'
        ? 'currentSignatures'
        : filters.sortBy === 'signatures'
        ? 'currentSignatures'
        : 'createdAt';
    const sortDirection = filters.sortOrder || 'desc';
    q = query(q, orderBy(sortField, sortDirection));

    // Apply pagination
    if (pagination.limit) {
      q = query(q, limit(pagination.limit + 1)); // Get one extra to check if there are more
    }

    const querySnapshot = await getDocs(q);
    const petitions: Petition[] = [];

    querySnapshot.forEach((doc, index) => {
      // Skip the extra document used for pagination check
      if (pagination.limit && index >= pagination.limit) {
        return;
      }

      const data = doc.data();
      petitions.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        targetSignatures: data.targetSignatures,
        currentSignatures: data.currentSignatures || 0,
        status: data.status,
        creatorId: data.creatorId,
        creatorPageId: data.creatorPageId,
        mediaUrls: data.mediaUrls || [],
        qrCodeUrl: data.qrCodeUrl,
        hasQrCode: data.hasQrCode || false,
        pricingTier: data.pricingTier,
        amountPaid: data.amountPaid || 0,
        paymentStatus: data.paymentStatus || 'unpaid',

        // Location
        location: data.location,

        // Metadata
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        approvedAt: data.approvedAt?.toDate(),
        pausedAt: data.pausedAt?.toDate(),
        deletedAt: data.deletedAt?.toDate(),

        // Analytics
        viewCount: data.viewCount || 0,
        shareCount: data.shareCount || 0,

        // Moderation
        moderatedBy: data.moderatedBy,
        moderationNotes: data.moderationNotes,

        // Public visibility
        isPublic: data.isPublic !== false,
        isActive: data.isActive !== false,
      });
    });

    // Apply client-side filters for complex queries
    let filteredPetitions = petitions;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPetitions = petitions.filter(
        (petition) =>
          petition.title.toLowerCase().includes(searchTerm) ||
          petition.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.location) {
      filteredPetitions = filteredPetitions.filter(
        (petition) =>
          petition.location?.country === filters.location ||
          petition.location?.city === filters.location
      );
    }

    const paginationInfo: PaginationInfo = {
      page: pagination.page || 1,
      limit: pagination.limit || 12,
      total: filteredPetitions.length,
      hasMore: filteredPetitions.length === pagination.limit,
    };

    return {
      petitions: filteredPetitions,
      pagination: paginationInfo,
    };
  } catch (error) {
    console.error('Error getting petitions:', error);
    throw new Error('Failed to load petitions. Please try again.');
  }
};

/**
 * Get petitions by user ID
 */
export const getUserPetitions = async (userId: string): Promise<Petition[]> => {
  try {
    let q = query(
      collection(db, PETITIONS_COLLECTION),
      where('creatorId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const petitions: Petition[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      petitions.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        targetSignatures: data.targetSignatures,
        currentSignatures: data.currentSignatures || 0,
        status: data.status,
        creatorId: data.creatorId,
        creatorPageId: data.creatorPageId,
        mediaUrls: data.mediaUrls || [],
        qrCodeUrl: data.qrCodeUrl,
        hasQrCode: data.hasQrCode || false,
        pricingTier: data.pricingTier,
        amountPaid: data.amountPaid || 0,
        paymentStatus: data.paymentStatus || 'unpaid',

        // Location
        location: data.location,

        // Metadata
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        approvedAt: data.approvedAt?.toDate(),
        pausedAt: data.pausedAt?.toDate(),
        deletedAt: data.deletedAt?.toDate(),

        // Analytics
        viewCount: data.viewCount || 0,
        shareCount: data.shareCount || 0,

        // Moderation
        moderatedBy: data.moderatedBy,
        moderationNotes: data.moderationNotes,

        // Public visibility
        isPublic: data.isPublic !== false,
        isActive: data.isActive !== false,
      });
    });

    return petitions;
  } catch (error) {
    console.error('Error getting user petitions:', error);
    throw new Error('Failed to load your petitions. Please try again.');
  }
};

/**
 * Update petition status (admin/moderator only)
 */
export const updatePetitionStatus = async (
  petitionId: string,
  status: Petition['status'],
  moderatorId: string,
  notes?: string
): Promise<void> => {
  try {
    const docRef = doc(db, PETITIONS_COLLECTION, petitionId);
    const updateData: any = {
      status,
      moderatedBy: moderatorId,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (notes) {
      updateData.moderationNotes = notes;
    }

    if (status === 'approved') {
      updateData.approvedAt = Timestamp.fromDate(new Date());
    } else if (status === 'paused') {
      updateData.pausedAt = Timestamp.fromDate(new Date());
    } else if (status === 'deleted') {
      updateData.deletedAt = Timestamp.fromDate(new Date());
      updateData.isActive = false;
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating petition status:', error);
    throw new Error('Failed to update petition status. Please try again.');
  }
};

/**
 * Increment petition view count
 */
export const incrementPetitionViews = async (
  petitionId: string
): Promise<void> => {
  try {
    const docRef = doc(db, PETITIONS_COLLECTION, petitionId);
    await updateDoc(docRef, {
      viewCount: increment(1),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('Error incrementing petition views:', error);
    // Don't throw error for analytics - it's not critical
  }
};

/**
 * Increment petition share count
 */
export const incrementPetitionShares = async (
  petitionId: string
): Promise<void> => {
  try {
    const docRef = doc(db, PETITIONS_COLLECTION, petitionId);
    await updateDoc(docRef, {
      shareCount: increment(1),
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('Error incrementing petition shares:', error);
    // Don't throw error for analytics - it's not critical
  }
};

/**
 * Initialize default categories
 */
export const initializeCategories = async (): Promise<void> => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(categoriesRef);

    // Only initialize if no categories exist
    if (snapshot.empty) {
      const now = new Date();
      const promises = DEFAULT_CATEGORIES.map((category) =>
        addDoc(categoriesRef, {
          ...category,
          petitionCount: 0,
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now),
        })
      );

      await Promise.all(promises);
      console.log('Default categories initialized');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const querySnapshot = await getDocs(categoriesRef);
    const categories: Category[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.isActive !== false) {
        categories.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          color: data.color,
          isActive: data.isActive !== false,
          petitionCount: data.petitionCount || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      }
    });

    // Sort by name
    categories.sort((a, b) => a.name.localeCompare(b.name));

    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Failed to load categories. Please try again.');
  }
};

// Auto-initialize categories when module loads
initializeCategories();
