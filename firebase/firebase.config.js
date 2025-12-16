// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwjyN6ulMoZYSulvdt49pMTvgbWXht5Z4",
  authDomain: "boomburger-59f00.firebaseapp.com",
  projectId: "boomburger-59f00",
  storageBucket: "boomburger-59f00.firebasestorage.app",
  messagingSenderId: "843768073849",
  appId: "1:843768073849:web:854aa2096007e3f6f6cea8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
