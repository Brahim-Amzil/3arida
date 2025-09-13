const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7oi-2TKxlf3RUaQfaWjIW0fGzPe1_g6E",
  authDomain: "arida-c5faf.firebaseapp.com",
  projectId: "arida-c5faf",
  storageBucket: "arida-c5faf.appspot.com",
  messagingSenderId: "446881275370",
  appId: "1:446881275370:web:2e8b7a91d1f8e8a8d9e9d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createUserDocument() {
  try {
    const userData = {
      id: "R4lEGogkyca79pB5Wfu9xFLwxBh1",
      email: "3aridapp@gmail.com",
      name: "3arida App",
      verifiedEmail: true,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "user",
      status: "active"
    };

    await setDoc(doc(db, 'users', userData.id), userData);
    console.log('✅ User document created successfully!');
    console.log('User data:', userData);
  } catch (error) {
    console.error('❌ Error creating user document:', error);
  }
}

createUserDocument();