'use client';

import React from 'react';
import { Button } from '@/components/ui/button-modern';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card-modern';
import { Badge } from '@/components/ui/badge-modern';
import PetitionCardModern from '@/components/petitions/PetitionCardModern';
import { Petition } from '@/types/petition';

// Mock petition data for testing
const mockPetition: Petition = {
  id: '1',
  title: 'Improve Public Transportation in Casablanca',
  description:
    'We need better public transportation to reduce traffic congestion and pollution in our beautiful city.',
  category: 'Transportation',
  targetSignatures: 10000,
  currentSignatures: 7500,
  status: 'approved',
  creatorId: 'user1',
  creatorName: 'Ahmed El Mansouri',
  mediaUrls: [
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
  ],
  hasQrCode: false,
  pricingTier: 'free',
  amountPaid: 0,
  paymentStatus: 'unpaid',
  viewCount: 1250,
  shareCount: 89,
  isPublic: true,
  isActive: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
};

export default function TestModernPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modern UI Components Test
          </h1>
          <p className="text-lg text-gray-600">
            Testing the new modern components for 3arida
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Modern Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="gradient">Gradient</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="default" isLoading>
              Loading...
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Modern Badges
          </h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Modern Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>
                  This is a basic card with header and content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This is the card content area. It can contain any type of
                  content.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Action Button</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Badge</CardTitle>
                <CardDescription>
                  A card showcasing badges and buttons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="success">Active</Badge>
                  <Badge variant="info">New</Badge>
                </div>
                <p>
                  This card demonstrates the modern styling with badges and
                  improved spacing.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1">Confirm</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gradient Card</CardTitle>
                <CardDescription>
                  Testing gradient buttons and modern shadows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This card shows the improved shadow system and modern styling.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="gradient" className="w-full">
                  Gradient Action
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Petition Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Modern Petition Cards
          </h2>

          {/* Featured Variant */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Featured Variant
            </h3>
            <div className="max-w-md">
              <PetitionCardModern petition={mockPetition} variant="featured" />
            </div>
          </div>

          {/* Grid Variant */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Grid Variant
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PetitionCardModern petition={mockPetition} variant="grid" />
              <PetitionCardModern
                petition={{ ...mockPetition, currentSignatures: 2500 }}
                variant="grid"
              />
              <PetitionCardModern
                petition={{ ...mockPetition, currentSignatures: 9800 }}
                variant="grid"
              />
            </div>
          </div>

          {/* List Variant */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              List Variant
            </h3>
            <div className="space-y-4">
              <PetitionCardModern petition={mockPetition} variant="list" />
              <PetitionCardModern
                petition={{ ...mockPetition, currentSignatures: 3200 }}
                variant="list"
              />
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Modern Color Palette
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-primary rounded-lg"></div>
              <p className="text-sm font-medium">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-neutral-100 border rounded-lg"></div>
              <p className="text-sm font-medium">Neutral 100</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-neutral-200 rounded-lg"></div>
              <p className="text-sm font-medium">Neutral 200</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-neutral-500 rounded-lg"></div>
              <p className="text-sm font-medium">Neutral 500</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-neutral-800 rounded-lg"></div>
              <p className="text-sm font-medium">Neutral 800</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-gradient-to-r from-primary to-primary/80 rounded-lg"></div>
              <p className="text-sm font-medium">Gradient</p>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Modern Shadow System
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-sm font-medium">shadow-sm</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-sm font-medium">shadow-md</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p className="text-sm font-medium">shadow-lg</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-xl">
              <p className="text-sm font-medium">shadow-xl</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
