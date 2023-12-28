// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const getFirestore  = require("firebase/firestore");

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3nEoR8HHOn8dXNh8OtleLTWRhyrOBXGw",
  authDomain: "detecting-correlation-database.firebaseapp.com",
  databaseURL: "https://detecting-correlation-database-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "detecting-correlation-database",
  storageBucket: "detecting-correlation-database.appspot.com",
  messagingSenderId: "345740800411",
  appId: "1:345740800411:web:804a4fd3a771e804e7f13e",
  measurementId: "G-KQRR4SE76Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
// Export the Firestore instance
const db = getFirestore.getFirestore(app)

module.exports = db;
