import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetitionCard from '../petitions/PetitionCard';
import { Petition } from '../../types/petition';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
});

const mockPetition: Petition = {
  id: 'petition-123',
  title: 'Save Our Local Park',
  description:
    'We need to protect this green space from development. It serves as a vital community resource for families, children, and wildlife.',
  category: 'Environment',
  subcategory: 'Parks',
  targetSignatures: 1000,
  currentSignatures: 250,
  status: 'approved',
  creatorId: 'user-123',
  creatorPageId: 'creator-123',
  mediaUrls: ['https://example.com/park-image.jpg'],
  qrCodeUrl: 'https://example.com/qr-code.png',
  hasQrCode: true,
  pricingTier: 'free',
  amountPaid: 0,
  paymentStatus: 'unpaid',
  location: {
    country: 'Morocco',
    city: 'Casablanca',
    region: 'Casablanca-Settat',
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  approvedAt: new Date('2024-01-16'),
  viewCount: 150,
  shareCount: 25,
  moderatedBy: 'moderator-123',
  isPublic: true,
  isActive: true,
};

describe('PetitionCard', () => {
  it('renders petition information correctly', () => {
    render(<PetitionCard petition={mockPetition} />);

    expect(screen.getByText('Save Our Local Park')).toBeInTheDocument();
    expect(
      screen.getByText(/We need to protect this green space/)
    ).toBeInTheDocument();
    expect(screen.getByText('Environment')).toBeInTheDocument();
    expect(screen.getByText('250 signatures')).toBeInTheDocument();
    expect(screen.getByText('1,000 goal')).toBeInTheDocument();
  });

  it('displays progress bar correctly', () => {
    render(<PetitionCard petition={mockPetition} showProgress={true} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '25'); // 250/1000 = 25%
  });

  it('shows creator information when enabled', () => {
    render(<PetitionCard petition={mockPetition} showCreator={true} />);

    // Since we don't have creator name in the mock, it should show "User"
    expect(screen.getByText(/Created by/)).toBeInTheDocument();
  });

  it('displays action buttons when enabled', () => {
    render(<PetitionCard petition={mockPetition} showActions={true} />);

    expect(screen.getByText('View Petition')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Petition/ })).toHaveAttribute(
      'href',
      '/petitions/petition-123'
    );
  });

  it('shows QR button when petition does not have QR upgrade', () => {
    const petitionWithoutQR = { ...mockPetition, hasQrUpgrade: false };
    render(<PetitionCard petition={petitionWithoutQR} showActions={true} />);

    expect(screen.getByText('QR')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /QR/ })).toHaveAttribute(
      'href',
      '/petitions/petition-123/qr'
    );
  });

  it('hides QR button when petition has QR upgrade', () => {
    const petitionWithQR = { ...mockPetition, hasQrUpgrade: true };
    render(<PetitionCard petition={petitionWithQR} showActions={true} />);

    expect(screen.queryByText('QR')).not.toBeInTheDocument();
  });

  it('displays petition image when available', () => {
    render(<PetitionCard petition={mockPetition} />);

    const image = screen.getByAltText('Save Our Local Park');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/park-image.jpg');
  });

  it('shows placeholder when no image is available', () => {
    const petitionWithoutImage = { ...mockPetition, mediaUrls: [] };
    render(<PetitionCard petition={petitionWithoutImage} />);

    // Should show the document icon placeholder
    const placeholder = screen.getByRole('img', { hidden: true });
    expect(placeholder).toBeInTheDocument();
  });

  it('displays status badge correctly', () => {
    render(<PetitionCard petition={mockPetition} />);

    const statusBadge = screen.getByText('approved');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('shows different status colors for different statuses', () => {
    const pendingPetition = { ...mockPetition, status: 'pending' as const };
    const { rerender } = render(<PetitionCard petition={pendingPetition} />);

    let statusBadge = screen.getByText('pending');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');

    const pausedPetition = { ...mockPetition, status: 'paused' as const };
    rerender(<PetitionCard petition={pausedPetition} />);

    statusBadge = screen.getByText('paused');
    expect(statusBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('handles share button click', () => {
    const mockShare = jest.fn();

    // Mock navigator.share
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
    });

    render(<PetitionCard petition={mockPetition} />);

    const shareButton = screen.getByRole('button');
    fireEvent.click(shareButton);

    // Note: The actual share functionality would need to be tested with more complex mocking
    // This test just verifies the button exists and is clickable
    expect(shareButton).toBeInTheDocument();
  });

  it('renders in list variant correctly', () => {
    render(<PetitionCard petition={mockPetition} variant="list" />);

    // In list variant, the layout should be different (horizontal)
    expect(screen.getByText('Save Our Local Park')).toBeInTheDocument();
    expect(screen.getByText('250 signatures')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PetitionCard petition={mockPetition} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays location information when available', () => {
    render(<PetitionCard petition={mockPetition} />);

    expect(screen.getByText(/Casablanca/)).toBeInTheDocument();
  });

  it('shows correct progress percentage', () => {
    const highProgressPetition = {
      ...mockPetition,
      currentSignatures: 750,
      targetSignatures: 1000,
    };

    render(
      <PetitionCard petition={highProgressPetition} showProgress={true} />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75'); // 750/1000 = 75%
  });

  it('handles petition with no description gracefully', () => {
    const petitionWithoutDescription = { ...mockPetition, description: '' };
    render(<PetitionCard petition={petitionWithoutDescription} />);

    expect(screen.getByText('Save Our Local Park')).toBeInTheDocument();
    // Should not crash when description is empty
  });
});
