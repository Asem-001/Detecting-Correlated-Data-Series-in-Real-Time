// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const getFirestore  = require("firebase/firestore");

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhJPLk8dBGPZczj_SSxYvf-so5jIECKII",
  authDomain: "detecting-correlation.firebaseapp.com",
  projectId: "detecting-correlation",
  storageBucket: "detecting-correlation.appspot.com",
  messagingSenderId: "1020973538487",
  appId: "1:1020973538487:web:ad946a5d394cb5628b0132"
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
// Export the Firestore instance
const db = getFirestore.getFirestore(app)

module.exports = db;
