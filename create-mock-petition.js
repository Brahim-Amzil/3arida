/**
 * Create a realistic mock petition for testing and demonstration
 * 
 * This script creates:
 * - 1 petition with 50K goal and 39K signatures (78% complete)
 * - 24 mock signees
 * - Realistic data including images, description, etc.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Moroccan cities for realistic locations
const moroccanCities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 
  'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
  'Safi', 'Mohammedia', 'Khouribga', 'Beni Mellal', 'El Jadida',
  'Nador', 'Taza', 'Settat', 'Ksar El Kebir', 'Larache',
  'Khemisset', 'Guelmim', 'Berrechid', 'Taourirt'
];

// Moroccan names for realistic signees
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

    // Get the first user from the database to use as creator
    const usersSnapshot = await db.collection('users').limit(1).get();
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }

    const creatorDoc = usersSnapshot.docs[0];
    const creatorId = creatorDoc.id;
    const creatorData = creatorDoc.data();

    console.log(`✅ Using creator: ${creatorData.name || creatorData.email}`);

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
      currentSignatures: 39000, // 78% of goal
      status: 'approved',
      creatorId: creatorId,
      publisherType: 'Organization',
      publisherName: 'جمعية الحفاظ على التراث الأمازيغي',
      petitionType: 'Policy Change',
      addressedToType: 'Government',
      addressedToSpecific: 'وزارة الثقافة والشباب والرياضة',
      referenceCode: `AM${Math.floor(1000 + Math.random() * 9000)}`,
      
      // Use placeholder images (you can replace with actual URLs)
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
      
      createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)), // 45 days ago
      updatedAt: admin.firestore.Timestamp.now(),
      approvedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 44 * 24 * 60 * 60 * 1000)), // 44 days ago
    };

    const petitionRef = await db.collection('petitions').add(petitionData);
    const petitionId = petitionRef.id;

    console.log(`✅ Mock petition created with ID: ${petitionId}`);
    console.log(`   Title: ${petitionData.title}`);
    console.log(`   Goal: ${petitionData.targetSignatures.toLocaleString()} signatures`);
    console.log(`   Current: ${petitionData.currentSignatures.toLocaleString()} signatures (78%)`);
    console.log(`   Status: ${petitionData.status}\n`);

    // Create 24 mock signees
    console.log('📝 Creating 24 mock signees...\n');

    const signatures = [];
    for (let i = 0; i < 24; i++) {
      const signedDaysAgo = Math.floor(Math.random() * 40) + 1; // Random between 1-40 days ago
      const signatureData = {
        petitionId: petitionId,
        signerName: moroccanNames[i],
        signerPhone: `+212${Math.floor(600000000 + Math.random() * 99999999)}`,
        signerLocation: {
          country: 'Morocco',
          city: moroccanCities[i]
        },
        verificationMethod: 'phone_otp',
        verifiedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - signedDaysAgo * 24 * 60 * 60 * 1000)),
        ipAddress: `196.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        isAnonymous: false,
        comment: i % 3 === 0 ? 'نحن معكم في هذه القضية المهمة!' : '',
        createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - signedDaysAgo * 24 * 60 * 60 * 1000)),
      };

      await db.collection('signatures').add(signatureData);
      signatures.push(signatureData);
      
      if ((i + 1) % 6 === 0) {
        console.log(`   ✓ Created ${i + 1}/24 signatures...`);
      }
    }

    console.log(`\n✅ All 24 mock signees created successfully!\n`);

    // Summary
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
    console.log(`Created: 45 days ago`);
    console.log(`Mock Signees: 24`);
    console.log(`Views: ${petitionData.viewCount.toLocaleString()}`);
    console.log(`Shares: ${petitionData.shareCount.toLocaleString()}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🎉 Mock petition is now visible in the petition explorer!');
    console.log(`🔗 View at: http://localhost:3003/petitions/${petitionId}\n`);

  } catch (error) {
    console.error('❌ Error creating mock petition:', error);
  }
}

// Run the script
createMockPetition()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
