// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBD_T3-Som1x4ngiBCOVa3HXtTgkwF6C94",
  authDomain: "nova-trust-cbfd9.firebaseapp.com",
  databaseURL: "https://nova-trust-cbfd9-default-rtdb.firebaseio.com",
  projectId: "nova-trust-cbfd9",
  storageBucket: "nova-trust-cbfd9.appspot.com",
  messagingSenderId: "1068504317514",
  appId: "1:1068504317514:web:b1cadb78b30c34ecc370b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;



