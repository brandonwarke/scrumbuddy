// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtBnu9qyuFgxyOVrWLvJ_WS7KnZKyDi6s",
  authDomain: "scrumbuddy-d4f8f.firebaseapp.com",
  projectId: "scrumbuddy-d4f8f",
  storageBucket: "scrumbuddy-d4f8f.appspot.com",
  messagingSenderId: "1052415880595",
  appId: "1:1052415880595:web:95e6e92b92d20bd7904c66",
  measurementId: "G-GK15S1473J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Export Authentication and Firestore for use in your components
export { auth, db };
