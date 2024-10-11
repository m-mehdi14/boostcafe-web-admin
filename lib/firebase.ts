/* eslint-disable @typescript-eslint/ban-ts-comment */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import {getAnalytics} from 'firebase/analytics';
// import {getAuth} from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpfEHmNGebRFWrSgGDHHLDwh24uKP_kpM",
  authDomain: "boostcafe-a8a98.firebaseapp.com",
  projectId: "boostcafe-a8a98",
  storageBucket: "boostcafe-a8a98.appspot.com",
  messagingSenderId: "433987702313",
  appId: "1:433987702313:web:0b353493050a84b5cbd638",
  measurementId: "G-XKN7J17139",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

//Old Step
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// export {auth};
// Initialize Firestore
const db = getFirestore(app);

// New Step

export { auth, app, db };
