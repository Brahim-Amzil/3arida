'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { uploadImage, generateImagePath } from '@/lib/storage';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface InfluencerInfoFormProps {
  petitionId: string;
  existingInfo?: {
    profilePhotoUrl: string;
    channelName: string;
    followerCount: string;
    platform: string;
    verified: boolean;
  };
  onSaved?: () => void;
}

export function InfluencerInfoForm({
  petitionId,
  existingInfo,
  onSaved,
}: InfluencerInfoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    profilePhotoUrl: existingInfo?.profilePhotoUrl || '',
    channelName: existingInfo?.channelName || '',
    followerCount: existingInfo?.followerCount || '',
    platform: existingInfo?.platform || 'YouTube',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(
    existingInfo?.profilePhotoUrl || '',
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let profilePhotoUrl = formData.profilePhotoUrl;

      // Upload new photo if selected
      if (photoFile) {
        setUploading(true);
        const imagePath = generateImagePath(
          `influencer_${petitionId}`,
          photoFile.name,
        );
        profilePhotoUrl = await uploadImage(photoFile, imagePath);
        setUploading(false);
      }

      // Validate required fields
      if (
        !profilePhotoUrl ||
        !formData.channelName ||
        !formData.followerCount
      ) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Update petition with influencer info
      const petitionRef = doc(db, 'petitions', petitionId);
      await updateDoc(petitionRef, {
        influencerInfo: {
          profilePhotoUrl,
          channelName: formData.channelName.trim(),
          followerCount: formData.followerCount.trim(),
          platform: formData.platform,
          verified: true,
          addedAt: Timestamp.now(),
        },
        updatedAt: Timestamp.now(),
      });

      setSuccess('Influencer info saved successfully!');
      if (onSaved) onSaved();

      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Error saving influencer info:', err);
      setError(err.message || 'Failed to save influencer info');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">🌟</span>
          Add Influencer Channel Info
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Manually add verified influencer information to display on the
          petition page
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo *
            </label>
            <div className="flex items-center gap-4">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max 2MB. Square images work best.
                </p>
              </div>
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel/Account Name *
            </label>
            <input
              type="text"
              required
              value={formData.channelName}
              onChange={(e) =>
                setFormData({ ...formData, channelName: e.target.value })
              }
              placeholder="e.g., @channelname or Channel Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Follower Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follower Count *
            </label>
            <input
              type="text"
              required
              value={formData.followerCount}
              onChange={(e) =>
                setFormData({ ...formData, followerCount: e.target.value })
              }
              placeholder="e.g., 544K or 1.2M"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use K for thousands, M for millions (e.g., 50K, 1.5M)
            </p>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform *
            </label>
            <select
              required
              value={formData.platform}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="X">X (Twitter)</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Snapchat">Snapchat</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {uploading
              ? 'Uploading Photo...'
              : loading
                ? 'Saving...'
                : existingInfo
                  ? 'Update Influencer Info'
                  : 'Save Influencer Info'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
