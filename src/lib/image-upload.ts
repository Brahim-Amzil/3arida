import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

// Image validation constants
export const IMAGE_LIMITS = {
  PROFILE_PHOTO: 2 * 1024 * 1024, // 2 MB
  PETITION_IMAGE: 5 * 1024 * 1024, // 5 MB
  PETITION_GALLERY: 3 * 1024 * 1024, // 3 MB per image
  MAX_DIMENSIONS: 4000, // 4000x4000px max
  MAX_GALLERY_IMAGES: 5, // Max 5 images per petition
};

// Allowed image types (no GIF - can be large and animated)
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * Validate image file
 */
export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
}

export async function validateImage(
  file: File,
  maxSize: number,
  checkDimensions: boolean = true
): Promise<ImageValidationResult> {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file type (MIME type)
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: JPEG, PNG, WebP`,
    };
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image is too large (${fileSizeMB}MB). Maximum size is ${maxSizeMB}MB`,
    };
  }

  // Check minimum size (prevent 0-byte or corrupt files)
  if (file.size < 100) {
    return {
      valid: false,
      error: 'Image file is too small or corrupt',
    };
  }

  // Check image dimensions (if requested)
  if (checkDimensions) {
    try {
      const dimensions = await getImageDimensions(file);

      if (
        dimensions.width > IMAGE_LIMITS.MAX_DIMENSIONS ||
        dimensions.height > IMAGE_LIMITS.MAX_DIMENSIONS
      ) {
        return {
          valid: false,
          error: `Image dimensions too large (${dimensions.width}x${dimensions.height}px). Maximum is ${IMAGE_LIMITS.MAX_DIMENSIONS}x${IMAGE_LIMITS.MAX_DIMENSIONS}px`,
        };
      }

      // Check minimum dimensions (prevent tiny images)
      if (dimensions.width < 50 || dimensions.height < 50) {
        return {
          valid: false,
          error: 'Image is too small. Minimum size is 50x50 pixels',
        };
      }

      return {
        valid: true,
        width: dimensions.width,
        height: dimensions.height,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to read image. File may be corrupt',
      };
    }
  }

  return { valid: true };
}

/**
 * Get image dimensions
 */
function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Upload profile image with validation
 */
export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  // Validate image
  const validation = await validateImage(
    file,
    IMAGE_LIMITS.PROFILE_PHOTO,
    true
  );

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop()?.toLowerCase();
  const filename = `${userId}_${timestamp}.${extension}`;

  // Upload to Firebase Storage
  const storageRef = ref(storage, `profile-images/${filename}`);
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

/**
 * Upload petition image with validation
 */
export async function uploadPetitionImage(
  petitionId: string,
  file: File,
  imageIndex: number = 0
): Promise<string> {
  // Validate image
  const validation = await validateImage(
    file,
    IMAGE_LIMITS.PETITION_IMAGE,
    true
  );

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop()?.toLowerCase();
  const filename = `${petitionId}_${imageIndex}_${timestamp}.${extension}`;

  // Upload to Firebase Storage
  const storageRef = ref(storage, `petition-images/${filename}`);
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

/**
 * Upload multiple petition gallery images with validation
 */
export async function uploadPetitionGallery(
  petitionId: string,
  files: File[]
): Promise<string[]> {
  // Check number of images
  if (files.length > IMAGE_LIMITS.MAX_GALLERY_IMAGES) {
    throw new Error(
      `Too many images. Maximum is ${IMAGE_LIMITS.MAX_GALLERY_IMAGES} images`
    );
  }

  // Validate all images first
  for (let i = 0; i < files.length; i++) {
    const validation = await validateImage(
      files[i],
      IMAGE_LIMITS.PETITION_GALLERY,
      true
    );

    if (!validation.valid) {
      throw new Error(`Image ${i + 1}: ${validation.error}`);
    }
  }

  // Upload all images
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop()?.toLowerCase();
    const filename = `${petitionId}_gallery_${index}_${timestamp}.${extension}`;
    const storageRef = ref(storage, `petition-gallery/${filename}`);

    return uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef));
  });

  const urls = await Promise.all(uploadPromises);
  return urls;
}

/**
 * Delete image from storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);

    // Delete from storage
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - image might already be deleted
  }
}

// Legacy function name for backward compatibility
export const deleteProfileImage = deleteImage;

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get user-friendly error message
 */
export function getImageErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Failed to upload image. Please try again.';
}
