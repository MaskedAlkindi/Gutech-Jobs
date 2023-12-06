
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


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