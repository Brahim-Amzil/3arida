// Demo data for when Firebase is not configured
import { Petition, Category, User } from '../types/petition';

export const DEMO_CATEGORIES: Category[] = [
  {
    id: 'environment',
    name: 'Environment',
    description: 'Environmental protection and sustainability',
    icon: '🌱',
    color: 'green',
    isActive: true,
    petitionCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Educational reform and access',
    icon: '📚',
    color: 'blue',
    isActive: true,
    petitionCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Healthcare and public health',
    icon: '🏥',
    color: 'red',
    isActive: true,
    petitionCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'social-justice',
    name: 'Social Justice',
    description: 'Human rights and social equality',
    icon: '⚖️',
    color: 'purple',
    isActive: true,
    petitionCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Public infrastructure and transportation',
    icon: '🏗️',
    color: 'orange',
    isActive: true,
    petitionCount: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'economy',
    name: 'Economy',
    description: 'Economic development and employment',
    icon: '💼',
    color: 'yellow',
    isActive: true,
    petitionCount: 9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const DEMO_PETITIONS: Petition[] = [
  {
    id: 'demo-1',
    title: 'Protect Moroccan Coastal Areas from Pollution',
    description:
      "We call for immediate action to protect Morocco's beautiful coastline from industrial pollution. Our beaches and marine life are under threat from unregulated waste disposal. Join us in demanding stricter environmental regulations and enforcement.",
    category: 'Environment',
    subcategory: 'Marine Protection',
    targetSignatures: 5000,
    currentSignatures: 3247,
    status: 'approved',
    creatorId: 'demo-user-1',
    mediaUrls: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
    qrCodeUrl: '',
    hasQrCode: false,
    pricingTier: 'basic',
    amountPaid: 49,
    paymentStatus: 'paid',
    location: {
      country: 'Morocco',
      city: 'Casablanca',
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    approvedAt: new Date('2024-01-16'),
    viewCount: 1250,
    shareCount: 89,
    isPublic: true,
    isActive: true,
  },
  {
    id: 'demo-2',
    title: 'Improve Public Transportation in Rabat',
    description:
      'Rabat needs a modern, efficient public transportation system. We petition for investment in electric buses, better routes, and improved accessibility for all citizens including people with disabilities.',
    category: 'Infrastructure',
    subcategory: 'Transportation',
    targetSignatures: 2500,
    currentSignatures: 1876,
    status: 'approved',
    creatorId: 'demo-user-2',
    mediaUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop'],
    qrCodeUrl: '',
    hasQrCode: true,
    pricingTier: 'free',
    amountPaid: 0,
    paymentStatus: 'paid',
    location: {
      country: 'Morocco',
      city: 'Rabat',
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    approvedAt: new Date('2024-01-11'),
    viewCount: 890,
    shareCount: 45,
    isPublic: true,
    isActive: true,
  },
  {
    id: 'demo-3',
    title: 'Free WiFi in All Public Schools',
    description:
      'Every student deserves access to digital learning resources. We demand free WiFi installation in all public schools across Morocco to bridge the digital divide and ensure equal educational opportunities.',
    category: 'Education',
    subcategory: 'Digital Access',
    targetSignatures: 10000,
    currentSignatures: 7543,
    status: 'approved',
    creatorId: 'demo-user-3',
    mediaUrls: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop'],
    qrCodeUrl: '',
    hasQrCode: false,
    pricingTier: 'premium',
    amountPaid: 79,
    paymentStatus: 'paid',
    location: {
      country: 'Morocco',
      city: 'Marrakech',
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
    approvedAt: new Date('2024-01-06'),
    viewCount: 2100,
    shareCount: 156,
    isPublic: true,
    isActive: true,
  },
  {
    id: 'demo-4',
    title: 'Mental Health Support in Universities',
    description:
      'University students face increasing mental health challenges. We petition for dedicated counseling services, mental health awareness programs, and support systems in all Moroccan universities.',
    category: 'Health',
    subcategory: 'Mental Health',
    targetSignatures: 3000,
    currentSignatures: 2156,
    status: 'approved',
    creatorId: 'demo-user-4',
    mediaUrls: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop'],
    qrCodeUrl: '',
    hasQrCode: false,
    pricingTier: 'basic',
    amountPaid: 49,
    paymentStatus: 'paid',
    location: {
      country: 'Morocco',
      city: 'Fez',
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
    approvedAt: new Date('2024-01-13'),
    viewCount: 756,
    shareCount: 34,
    isPublic: true,
    isActive: true,
  },
  {
    id: 'demo-5',
    title: 'Equal Pay for Women in the Workplace',
    description:
      'Women in Morocco deserve equal pay for equal work. We call for legislation and enforcement to eliminate the gender pay gap and ensure workplace equality across all sectors.',
    category: 'Social Justice',
    subcategory: 'Gender Equality',
    targetSignatures: 7500,
    currentSignatures: 4892,
    status: 'approved',
    creatorId: 'demo-user-5',
    mediaUrls: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop'],
    qrCodeUrl: '',
    hasQrCode: true,
    pricingTier: 'premium',
    amountPaid: 79,
    paymentStatus: 'paid',
    location: {
      country: 'Morocco',
      city: 'Tangier',
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-21'),
    approvedAt: new Date('2024-01-09'),
    viewCount: 1456,
    shareCount: 98,
    isPublic: true,
    isActive: true,
  },
  {
    id: 'demo-6',
    title: 'Renewable Energy for Rural Communities',
    description:
      'Rural communities in Morocco should have access to clean, renewable energy. We petition for solar panel installations and wind energy projects to power remote villages sustainably.',
    category: 'Environment',
    subcategory: 'Renewable Energy',
    targetSignatures: 4000,
    currentSignatures: 2734,
    status: 'approved',
    creatorId: 'demo-user-6',
    mediaUrls: ['https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=600&fit=crop'],
    qrCodeUrl: '',
    hasQrCode: false,
    pricingTier: 'basic',
    amountPaid: 49,
    paymentStatus: 'paid',
    location: {
      country: 'Morocco',
      region: 'Atlas Mountains',
    },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20'),
    approvedAt: new Date('2024-01-15'),
    viewCount: 923,
    shareCount: 67,
    isPublic: true,
    isActive: true,
  },
];

export const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@3arida.ma',
  verifiedEmail: true,
  verifiedPhone: false,
  role: 'user',
  createdAt: new Date('2024-01-01'),
  isActive: true,
};

// Demo service functions
export const isDemoMode = () => {
  // Check if Firebase API key is properly configured
  const hasApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-api-key';
  
  // Check if Firebase project ID is configured
  const hasProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                       process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your-project-id';
  
  // If we have both API key and project ID, we're not in demo mode
  if (hasApiKey && hasProjectId) {
    return false;
  }
  
  // Fallback to demo mode if Firebase is not properly configured
  return true;
};

export const getDemoPetitions = (filters: any = {}) => {
  let petitions = [...DEMO_PETITIONS];

  if (filters.category) {
    petitions = petitions.filter((p) => p.category === filters.category);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    petitions = petitions.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Sort by signatures (popular) or recent
  if (filters.sortBy === 'signatures' || filters.sortBy === 'popular') {
    petitions.sort((a, b) => b.currentSignatures - a.currentSignatures);
  } else {
    petitions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return petitions;
};

export const getDemoCategories = () => {
  return [...DEMO_CATEGORIES];
};

export const getDemoPetition = (id: string) => {
  return DEMO_PETITIONS.find((p) => p.id === id) || null;
};
