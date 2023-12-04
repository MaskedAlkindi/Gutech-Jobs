// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByu9meCJeBwY4znr6tlql6gTzZVkvVPfU",
  authDomain: "gutechjobs.firebaseapp.com",
  projectId: "gutechjobs",
  storageBucket: "gutechjobs.appspot.com",
  messagingSenderId: "564536429578",
  appId: "1:564536429578:web:1a0a2e6b4e3006fc27e3f3",
  measurementId: "G-5SLERNZS51"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseapp);

export default firebaseapp;