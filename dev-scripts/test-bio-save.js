// Test script to verify bio saving
// Run this in the browser console after updating your profile

const testBioSave = async () => {
  const { db } = await import('./src/lib/firebase.ts');
  const { doc, getDoc } = await import('firebase/firestore');
  
  // Get current user ID from auth
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    console.log('❌ No user logged in');
    return;
  }
  
  console.log('✅ User ID:', user.uid);
  
  // Fetch user profile from Firestore
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    console.log('❌ User profile not found in Firestore');
    return;
  }
  
  const userData = userSnap.data();
  console.log('📝 User profile data:', {
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    bio: userData.bio,
    phoneVerified: userData.phoneVerified,
  });
  
  if (userData.bio) {
    console.log('✅ Bio is saved:', userData.bio);
  } else {
    console.log('⚠️ Bio is empty or not saved');
  }
};

// Run the test
testBioSave();
