// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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