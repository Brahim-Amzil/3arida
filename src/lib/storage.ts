import { storage, auth } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param path - The storage path (e.g., 'petitions/petition-id/image.jpg')
 * @returns Promise<string> - The download URL of the uploaded image
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    // Check authentication state
    const currentUser = auth.currentUser;
    console.log('🔐 Current user during upload:', currentUser ? 'Authenticated' : 'Not authenticated');
    console.log('🔐 User UID:', currentUser?.uid);
    console.log('🔐 User email:', currentUser?.email);
    console.log('🔐 Email verified:', currentUser?.emailVerified);
    console.log('📁 Upload path:', path);
    
    if (!currentUser) {
      throw new Error('User must be authenticated to upload images');
    }
    
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

/**
 * Delete an image from Firebase Storage
 * @param url - The download URL of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    // Create a reference from the URL
    const storageRef = ref(storage, url);
    
    // Delete the file
    await deleteObject(storageRef);
    
    console.log('✅ Image deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    // Don't throw error for deletion failures as they're not critical
  }
}

/**
 * Generate a unique file path for petition images
 * @param petitionId - The petition ID
 * @param fileName - The original file name
 * @returns string - The storage path
 */
export function generateImagePath(petitionId: string, fileName: string): string {
  // Extract file extension
  const extension = fileName.split('.').pop() || 'jpg';
  
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const uniqueFileName = `${timestamp}.${extension}`;
  
  return `petitions/${petitionId}/${uniqueFileName}`;
}

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @throws Error if validation fails
 */
export function validateImageFile(file: File): void {
  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file');
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image must be less than 5MB');
  }
  
  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    throw new Error('Supported formats: JPEG, PNG, WebP');
  }
}