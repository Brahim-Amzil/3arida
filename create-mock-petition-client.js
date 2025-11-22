/**
 * Create a realistic mock petition using Firebase Client SDK
 * Run with: node create-mock-petition-client.js
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Moroccan cities and names
const moroccanCities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 
  'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
  'Safi', 'Mohammedia', 'Khouribga', 'Beni Mellal', 'El Jadida',
  'Nador', 'Taza', 'Settat', 'Ksar El Kebir', 'Larache',
  'Khemisset', 'Guelmim', 'Berrechid', 'Taourirt'
];

const moroccanNames = [
  'Ahmed Benali', 'Fatima Zahra', 'Mohammed El Amrani', 'Khadija Alaoui',
  'Youssef Idrissi', 'Amina Benjelloun', 'Omar Tazi', 'Salma Chraibi',
  'Karim Fassi', 'Nadia Berrada', 'Hassan Lahlou', 'Zineb Kettani',
  'Rachid Benkirane', 'Samira Ouazzani', 'Mehdi Alami', 'Leila Tounsi',
  'Abdelaziz Mansouri', 'Houda Filali', 'Tarik Bennani', 'Sanaa Lazrak',
  'Hamza Sefrioui', 'Imane Sqalli', 'Amine Bensaid', 'Meriem Cherkaoui'
];

async function createMockPetition() {
  try {
    console.log('🚀 Creating realistic mock petition...\n');

    // Using your actual user ID
    const creatorId = '4G5VQdqzBmTXVU5UVcKmazOeLzj1';

    // Create the petition
    const petitionData = {
      title: 'نطالب بدعم وإحياء الفنون الأمازيغية التقليدية لأن الثقافة هوية',
      description: `تُعد الفنون الأمازيغية من أقدم الفنون الثقافية المغربية، فهي تعبر عن الأصالة والتنوع والإبداع الشعبي. لكن العديد من الفنون الأمازيغية التقليدية مهددة بالاندثار بسبب غياب الدعم وضعف الاهتمام الإعلامي والمؤسساتي.

نطالب بما يلي:

1. إنشاء مراكز ثقافية متخصصة في الفنون الأمازيغية في مختلف المناطق
2. دعم الفنانين الأمازيغيين ماديًا ومعنويًا لتشجيعهم على الاستمرار
3. إدراج الفنون الأمازيغية في المناهج التعليمية لتعريف الأجيال الجديدة بها
4. تنظيم مهرجانات سنوية للفنون الأمازيغية على المستوى الوطني والدولي
5. توثيق الفنون الأمازيغية التقليدية عبر الأرشفة الرقمية والسمعية البصرية

الفنون الأمازيغية هي جزء لا يتجزأ من الهوية المغربية، ويجب الحفاظ عليها ونقلها للأجيال القادمة. انضم إلينا في هذه الحملة لحماية تراثنا الثقافي!`,
      category: 'Culture',
      subcategory: 'Arts & Heritage',
      targetSignatures: 50000,
      currentSignatures: 39000,
      status: 'approved',
      creatorId: creatorId,
      publisherType: 'Organization',
      publisherName: 'جمعية الحفاظ على التراث الأمازيغي',
      petitionType: 'Policy Change',
      addressedToType: 'Government',
      addressedToSpecific: 'وزارة الثقافة والشباب والرياضة',
      referenceCode: `AM${Math.floor(1000 + Math.random() * 9000)}`,
      mediaUrls: [
        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800'
      ],
      youtubeVideoUrl: '',
      tags: 'ثقافة,أمازيغية,تراث,فنون,مغرب',
      location: {
        country: 'Morocco',
        city: 'Rabat',
        region: 'Rabat-Salé-Kénitra'
      },
      pricingTier: 'enterprise',
      amountPaid: 0,
      paymentStatus: 'unpaid',
      hasQrCode: false,
      viewCount: 15420,
      shareCount: 892,
      isPublic: true,
      isActive: true,
      createdAt: Timestamp.fromDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)),
      updatedAt: Timestamp.now(),
      approvedAt: Timestamp.fromDate(new Date(Date.now() - 44 * 24 * 60 * 60 * 1000)),
    };

    const petitionRef = await addDoc(collection(db, 'petitions'), petitionData);
    const petitionId = petitionRef.id;

    console.log(`✅ Mock petition created with ID: ${petitionId}`);
    console.log(`   Title: ${petitionData.title}`);
    console.log(`   Goal: ${petitionData.targetSignatures.toLocaleString()} signatures`);
    console.log(`   Current: ${petitionData.currentSignatures.toLocaleString()} signatures (78%)`);
    console.log(`   Status: ${petitionData.status}\n`);

    // Create 24 mock signees
    console.log('📝 Creating 24 mock signees...\n');

    for (let i = 0; i < 24; i++) {
      const signedDaysAgo = Math.floor(Math.random() * 40) + 1;
      const signatureData = {
        petitionId: petitionId,
        signerName: moroccanNames[i],
        signerPhone: `+212${Math.floor(600000000 + Math.random() * 99999999)}`,
        signerLocation: {
          country: 'Morocco',
          city: moroccanCities[i]
        },
        verificationMethod: 'phone_otp',
        verifiedAt: Timestamp.fromDate(new Date(Date.now() - signedDaysAgo * 24 * 60 * 60 * 1000)),
        ipAddress: `196.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        isAnonymous: false,
        comment: i % 3 === 0 ? 'نحن معكم في هذه القضية المهمة!' : '',
        createdAt: Timestamp.fromDate(new Date(Date.now() - signedDaysAgo * 24 * 60 * 60 * 1000)),
      };

      await addDoc(collection(db, 'signatures'), signatureData);
      
      if ((i + 1) % 6 === 0) {
        console.log(`   ✓ Created ${i + 1}/24 signatures...`);
      }
    }

    console.log(`\n✅ All 24 mock signees created successfully!\n`);
    console.log('📊 MOCK PETITION SUMMARY:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Petition ID: ${petitionId}`);
    console.log(`Title: ${petitionData.title}`);
    console.log(`Category: ${petitionData.category}`);
    console.log(`Publisher: ${petitionData.publisherName}`);
    console.log(`Target: ${petitionData.targetSignatures.toLocaleString()} signatures`);
    console.log(`Current: ${petitionData.currentSignatures.toLocaleString()} signatures`);
    console.log(`Progress: 78% complete`);
    console.log(`Status: ${petitionData.status}`);
    console.log(`Reference Code: ${petitionData.referenceCode}`);
    console.log(`Mock Signees: 24`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🎉 Mock petition is now visible in the petition explorer!');
    console.log(`🔗 View at: http://localhost:3003/petitions/${petitionId}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating mock petition:', error);
    process.exit(1);
  }
}

createMockPetition();
