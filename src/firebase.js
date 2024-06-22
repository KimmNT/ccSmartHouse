// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAN1yq0sNdiXfIQ7Icg2eIw8j8cptwglr8",
  authDomain: "ccsmarthouse-6e16b.firebaseapp.com",
  projectId: "ccsmarthouse-6e16b",
  storageBucket: "ccsmarthouse-6e16b.appspot.com",
  messagingSenderId: "1017454958381",
  appId: "1:1017454958381:web:6f8fdc93042ec0718ba5a4",
  databaseURL:
    "https://ccsmarthouse-6e16b-default-rtdb.asia-southeast1.firebasedatabase.app", // Corrected URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app);
