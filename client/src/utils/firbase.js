// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-19423.firebaseapp.com",
  projectId: "interviewiq-19423",
  storageBucket: "interviewiq-19423.firebasestorage.app",
  messagingSenderId: "1013418704083",
  appId: "1:1013418704083:web:20a47481daa37dc29d6826"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}