// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const getFirestore  = require("firebase/firestore");

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDysLL8ZT3mwmwpgnnLdgBAkzp_HEHXVRw",
  authDomain: "detecting-correlation-da-1b6c4.firebaseapp.com",
  projectId: "detecting-correlation-da-1b6c4",
  storageBucket: "detecting-correlation-da-1b6c4.appspot.com",
  messagingSenderId: "37732512616",
  appId: "1:37732512616:web:a9cd065ba2c44c17305cdd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
// Export the Firestore instance
const db = getFirestore.getFirestore(app)

module.exports = db;
