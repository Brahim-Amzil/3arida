'use client';

import React from 'react';
import Link from 'next/link';
import { Petition } from '@/types/petition';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-modern';
import { Badge } from '@/components/ui/badge-modern';
import { Button } from '@/components/ui/button-modern';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';

interface PetitionCardModernProps {
  petition: Petition;
  variant?: 'featured' | 'grid' | 'list';
  showProgress?: boolean;
  showCreator?: boolean;
  showStats?: boolean;
}

export default function PetitionCardModern({
  petition,
  variant = 'grid',
  showProgress = true,
  showCreator = true,
  showStats = true,
}: PetitionCardModernProps) {
  const signaturePercentage = petition.targetSignatures
    ? Math.min(
        (petition.currentSignatures / petition.targetSignatures) * 100,
        100
      )
    : 0;

  const isNearGoal = signaturePercentage >= 80;
  const isMilestone =
    petition.currentSignatures % 1000 === 0 && petition.currentSignatures > 0;

  const renderCard = () => {
    if (variant === 'featured') {
      return (
        <Link href={`/petitions/${petition.id}`}>
          <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
            {/* Image Container */}
            <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
              {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
                <OptimizedImage
                  src={petition.mediaUrls[0]}
                  alt={petition.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-primary/30" />
                </div>
              )}
              {isNearGoal && (
                <div className="absolute top-3 right-3">
                  <Badge variant="success">Almost there!</Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="line-clamp-2 text-lg">
                  {petition.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {petition.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              {showProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-neutral-900">
                      {petition.currentSignatures.toLocaleString()} signatures
                    </span>
                    <span className="text-neutral-500">
                      {petition.targetSignatures
                        ? `of ${petition.targetSignatures.toLocaleString()}`
                        : 'No target'}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-500"
                      style={{ width: `${signaturePercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500">
                    {Math.round(signaturePercentage)}% of goal
                  </p>
                </div>
              )}

              {/* Creator Info */}
              {showCreator && petition.creatorName && (
                <div className="flex items-center space-x-2 pt-2 border-t border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {petition.creatorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {petition.creatorName}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button className="w-full" size="lg">
                Sign Now
              </Button>
            </CardContent>
          </Card>
        </Link>
      );
    }

    if (variant === 'list') {
      return (
        <Link href={`/petitions/${petition.id}`}>
          <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-48 h-40 md:h-auto bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
                {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
                  <OptimizedImage
                    src={petition.mediaUrls[0]}
                    alt={petition.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-primary/30" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="line-clamp-2">
                        {petition.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {petition.description}
                      </CardDescription>
                    </div>
                    {isNearGoal && (
                      <Badge variant="success">Almost there!</Badge>
                    )}
                  </div>
                </div>

                {/* Progress and Stats */}
                <div className="space-y-3">
                  {showProgress && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold">
                          {petition.currentSignatures.toLocaleString()}{' '}
                          signatures
                        </span>
                        <span className="text-neutral-500">
                          {Math.round(signaturePercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full"
                          style={{ width: `${signaturePercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    {showCreator && petition.creatorName && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {petition.creatorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-600">
                          {petition.creatorName}
                        </span>
                      </div>
                    )}
                    <Button size="sm">Sign Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      );
    }

    // Default grid variant
    return (
      <Link href={`/petitions/${petition.id}`}>
        <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col">
          {/* Image Container */}
          <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex-shrink-0">
            {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
              <OptimizedImage
                src={petition.mediaUrls[0]}
                alt={petition.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-primary/30" />
              </div>
            )}
            {isNearGoal && (
              <div className="absolute top-2 right-2">
                <Badge variant="success" className="text-xs">
                  Almost there!
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <CardHeader className="flex-1">
            <div className="space-y-2">
              <CardTitle className="line-clamp-2 text-base">
                {petition.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {petition.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            {/* Progress Bar */}
            {showProgress && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-900">
                    {petition.currentSignatures.toLocaleString()}
                  </span>
                  <span className="text-neutral-500">
                    {Math.round(signaturePercentage)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-500"
                    style={{ width: `${signaturePercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Creator Info */}
            {showCreator && petition.creatorName && (
              <div className="flex items-center space-x-2 pt-2 border-t border-neutral-100">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {petition.creatorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 truncate">
                  {petition.creatorName}
                </p>
              </div>
            )}

            {/* Action Button */}
            <Button className="w-full" size="sm">
              Sign Now
            </Button>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return renderCard();
}
