import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth }  from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyCe-UM7H3jBXWoOCRzuSljm0OmjRtv16Hk",

  authDomain: "mv-brilliant-apartment.firebaseapp.com",

  projectId: "mv-brilliant-apartment",

  storageBucket: "mv-brilliant-apartment.firebasestorage.app",

  messagingSenderId: "654203738408",

  appId: "1:654203738408:web:a138a6a2fc48b62bdf581d"

};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);