import { Petition, Category, PetitionFilters, PaginationInfo } from '@/types/petition';

// Mock data for testing
const mockPetitions: Petition[] = [
  {
    id: '1',
    title: 'تحسين النقل العمومي في الدار البيضاء',
    description: 'نطالب بتحسين جودة النقل العمومي وزيادة عدد الحافلات في مدينة الدار البيضاء',
    category: 'transport',
    targetSignatures: 1000,
    currentSignatures: 750,
    status: 'approved',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    creatorId: 'user1',
    location: { country: 'المغرب', city: 'الدار البيضاء' },
    viewCount: 1250,
    shareCount: 45,
    mediaUrls: [],
    hasQrCode: false,
    pricingTier: 'basic',
    amountPaid: 0,
    paymentStatus: 'unpaid',
    isPublic: true,
    isActive: true
  },
  {
    id: '2',
    title: 'حماية البيئة في المناطق الساحلية',
    description: 'نطالب بوضع قوانين صارمة لحماية البيئة البحرية والساحلية في المغرب',
    category: 'environment',
    targetSignatures: 2000,
    currentSignatures: 1200,
    status: 'approved',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    creatorId: 'user2',
    location: { country: 'المغرب', city: 'الرباط' },
    viewCount: 890,
    shareCount: 32,
    mediaUrls: [],
    hasQrCode: false,
    pricingTier: 'basic',
    amountPaid: 0,
    paymentStatus: 'unpaid',
    isPublic: true,
    isActive: true
  },
  {
    id: '3',
    title: 'تطوير التعليم الرقمي',
    description: 'نطالب بتطوير منصات التعليم الرقمي وتوفير الأجهزة اللازمة للطلاب',
    category: 'education',
    targetSignatures: 1500,
    currentSignatures: 980,
    status: 'approved',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
    creatorId: 'user3',
    location: { country: 'المغرب', city: 'فاس' },
    viewCount: 650,
    shareCount: 28,
    mediaUrls: [],
    hasQrCode: false,
    pricingTier: 'basic',
    amountPaid: 0,
    paymentStatus: 'unpaid',
    isPublic: true,
    isActive: true
  }
];

const mockCategories: Category[] = [
  { 
    id: 'transport', 
    name: 'النقل والمواصلات', 
    description: 'قضايا النقل العمومي والمواصلات', 
    color: '#3B82F6',
    icon: '🚌',
    isActive: true,
    petitionCount: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: 'environment', 
    name: 'البيئة', 
    description: 'حماية البيئة والتنمية المستدامة', 
    color: '#10B981',
    icon: '🌱',
    isActive: true,
    petitionCount: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: 'education', 
    name: 'التعليم', 
    description: 'تطوير التعليم والتكوين', 
    color: '#F59E0B',
    icon: '📚',
    isActive: true,
    petitionCount: 12,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: 'health', 
    name: 'الصحة', 
    description: 'تحسين الخدمات الصحية', 
    color: '#EF4444',
    icon: '🏥',
    isActive: true,
    petitionCount: 6,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: 'social', 
    name: 'القضايا الاجتماعية', 
    description: 'العدالة الاجتماعية والحقوق', 
    color: '#8B5CF6',
    icon: '⚖️',
    isActive: true,
    petitionCount: 9,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: 'economy', 
    name: 'الاقتصاد', 
    description: 'التنمية الاقتصادية والتشغيل', 
    color: '#06B6D4',
    icon: '💼',
    isActive: true,
    petitionCount: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const getPetitions = async (
  filters: PetitionFilters = {},
  pagination: PaginationInfo = { page: 1, limit: 12, total: 0, hasMore: false }
): Promise<{ petitions: Petition[]; pagination: PaginationInfo }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredPetitions = [...mockPetitions];
  
  // Apply filters
  if (filters.category) {
    filteredPetitions = filteredPetitions.filter(p => p.category === filters.category);
  }
  
  if (filters.status) {
    filteredPetitions = filteredPetitions.filter(p => p.status === filters.status);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredPetitions = filteredPetitions.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  if (filters.sortBy === 'signatures') {
    filteredPetitions.sort((a, b) => {
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      return (a.currentSignatures - b.currentSignatures) * order;
    });
  } else if (filters.sortBy === 'recent') {
    filteredPetitions.sort((a, b) => {
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      return (a.createdAt.getTime() - b.createdAt.getTime()) * order;
    });
  }
  
  // Apply pagination
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedPetitions = filteredPetitions.slice(startIndex, endIndex);
  
  const total = filteredPetitions.length;
  const hasMore = endIndex < total;
  
  return {
    petitions: paginatedPetitions,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      hasMore
    }
  };
};

export const getCategories = async (): Promise<Category[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCategories;
};

export const getPetition = async (petitionId: string): Promise<Petition | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPetitions.find(p => p.id === petitionId) || null;
};

// Export other functions as stubs for now
export const createPetition = async (...args: any[]): Promise<any> => {
  throw new Error('Not implemented in mock version');
};

export const updatePetition = async (petitionId: string, updates: any): Promise<boolean> => {
  // In mock version, just return success
  console.log(`Mock: Updating petition ${petitionId}`, updates);
  return true;
};

export const deletePetition = async (petitionId: string): Promise<boolean> => {
  // In mock version, just return success
  console.log(`Mock: Deleting petition ${petitionId}`);
  return true;
};

export const signPetition = async (petitionId: string, userId: string): Promise<boolean> => {
  // In mock version, just increment signature count
  const petition = mockPetitions.find(p => p.id === petitionId);
  if (petition) {
    petition.currentSignatures += 1;
    console.log(`Mock: User ${userId} signed petition ${petitionId}`);
  }
  return true;
};

export const updatePetitionStatus = async (petitionId: string, status: string): Promise<boolean> => {
  // In mock version, just return success
  console.log(`Mock: Updating petition ${petitionId} status to ${status}`);
  return true;
};

export const getUserPetitions = async (userId: string): Promise<Petition[]> => {
  // Return petitions created by the user
  return mockPetitions.filter(petition => petition.creatorId === userId);
};



export const incrementPetitionViews = async (...args: any[]): Promise<any> => {
  // Do nothing in mock
};

export const incrementPetitionShares = async (...args: any[]): Promise<any> => {
  // Do nothing in mock
};

export const initializeCategories = async (): Promise<void> => {
  // Do nothing in mock
};