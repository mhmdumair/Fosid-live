import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  Auth,
} from "firebase/auth";
import { connectFirestoreEmulator, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

let firebaseAuth: Auth;
let firebaseDb: Firestore;

if (process.env.NODE_ENV === "development") {
  // In development mode, use the default auth and firestore instances
  firebaseAuth = getAuth();
  firebaseDb = getFirestore();
  // Connect to emulators
  connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099");
  console.log("Emulator auth connected");
  connectFirestoreEmulator(firebaseDb, "127.0.0.1", 8082);
  console.log("Emulator firestore connected");
} else {
  // In production mode, initialize Firebase app and use its auth and firestore
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);
}

// Google
const googleAuthProvider = new GoogleAuthProvider();

export {
  firebaseAuth,
  firebaseDb,
  googleAuthProvider,
  firebaseConfig,
};