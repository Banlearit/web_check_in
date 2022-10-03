// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5xnbeweNoAynbKBY0R4N8-t9i6UwQTgo",
  authDomain: "jsclass-int201.firebaseapp.com",
  projectId: "jsclass-int201",
  storageBucket: "jsclass-int201.appspot.com",
  messagingSenderId: "937252891393",
  appId: "1:937252891393:web:eac816c9e1e1ffa9718900"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();