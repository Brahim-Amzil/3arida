import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetitionCard from '../petitions/PetitionCard';
import { Petition } from '../../types/petition';

jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'status.approved': 'approved',
        'status.pending': 'pending',
        'status.paused': 'paused',
        'status.rejected': 'rejected',
        'categories.environment': 'Environment',
        'petitionCard.createdBy': 'Created by',
        'petitionCard.signatures': 'signatures',
        'petitionCard.of': 'of',
        'petitionCard.views': 'views',
        'petitionCard.shares': 'shares',
        'petitionCard.signPetition': 'Sign petition',
        'petitionCard.featuredPetition': 'Featured petition',
        'petitionCard.goal': 'goal',
        'petitionCard.complete': 'complete',
        'petition.checking': 'Checking',
        'petition.alreadySigned': 'Already signed',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Next.js components
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  function MockImage({ src, alt, fill: _fill, ...props }: Record<string, unknown>) {
    return <img src={src as string} alt={alt as string} {...props} loading="lazy" />;
  }
  MockImage.displayName = 'MockImage';
  return MockImage;
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
  creatorName: 'Jane Creator',
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
    expect(screen.getByText(/250/)).toBeInTheDocument();
    expect(screen.getByText(/signatures/)).toBeInTheDocument();
    expect(screen.getByText(/1,?000/)).toBeInTheDocument();
  });

  it('displays progress bar correctly', () => {
    const { container } = render(
      <PetitionCard petition={mockPetition} showProgress={true} />
    );

    expect(container.innerHTML).toContain('width: 25%');
  });

  it('shows creator information when enabled', () => {
    render(<PetitionCard petition={mockPetition} showCreator={true} />);

    expect(screen.getByText(/Created by/)).toBeInTheDocument();
    expect(screen.getByText('Jane Creator')).toBeInTheDocument();
  });

  it('displays action buttons when enabled', () => {
    render(<PetitionCard petition={mockPetition} showActions={true} />);

    expect(screen.getByRole('link', { name: /QR/ })).toHaveAttribute(
      'href',
      '/petitions/petition-123/qr'
    );
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(1);
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
    const { container } = render(<PetitionCard petition={petitionWithoutImage} />);

    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.queryByAltText('Save Our Local Park')).not.toBeInTheDocument();
  });

  it('displays status badge correctly', () => {
    render(<PetitionCard petition={mockPetition} />);

    const statusBadge = screen.getByText('approved');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-green-500');
  });

  it('shows different status colors for different statuses', () => {
    const pendingPetition = { ...mockPetition, status: 'pending' as const };
    const { rerender } = render(<PetitionCard petition={pendingPetition} />);

    let statusBadge = screen.getByText('pending');
    expect(statusBadge).toHaveClass('bg-yellow-500');

    const pausedPetition = { ...mockPetition, status: 'paused' as const };
    rerender(<PetitionCard petition={pausedPetition} />);

    statusBadge = screen.getByText('paused');
    expect(statusBadge).toHaveClass('bg-orange-500');
  });

  it('handles share button click', () => {
    const mockShare = jest.fn();
    (navigator as unknown as { share: typeof mockShare }).share = mockShare;

    render(<PetitionCard petition={mockPetition} showActions={true} />);

    const shareButton = screen.getAllByRole('button')[0];
    fireEvent.click(shareButton);

    expect(shareButton).toBeInTheDocument();
  });

  it('renders in list variant correctly', () => {
    render(<PetitionCard petition={mockPetition} variant="list" />);

    expect(screen.getByText('Save Our Local Park')).toBeInTheDocument();
    expect(screen.getByText(/250\s+signatures/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PetitionCard petition={mockPetition} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays engagement stats on the card', () => {
    render(<PetitionCard petition={mockPetition} />);

    expect(screen.getByText(/150/)).toBeInTheDocument();
    expect(screen.getByText(/views/)).toBeInTheDocument();
    expect(screen.getByText(/shares/)).toBeInTheDocument();
  });

  it('shows correct progress percentage', () => {
    const highProgressPetition = {
      ...mockPetition,
      currentSignatures: 750,
      targetSignatures: 1000,
    };

    const { container } = render(
      <PetitionCard petition={highProgressPetition} showProgress={true} />
    );

    expect(container.innerHTML).toContain('width: 75%');
  });

  it('handles petition with no description gracefully', () => {
    const petitionWithoutDescription = { ...mockPetition, description: '' };
    render(<PetitionCard petition={petitionWithoutDescription} />);

    expect(screen.getByText('Save Our Local Park')).toBeInTheDocument();
    // Should not crash when description is empty
  });
});
