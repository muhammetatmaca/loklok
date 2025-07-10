// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBRb6-rQQzD9G4FFtPwVlhXIyVZHkk1nhk",
    authDomain: "zaferlok-3df25.firebaseapp.com",
    projectId: "zaferlok-3df25",
    storageBucket: "zaferlok-3df25.appspot.com", // düzeltildi
    messagingSenderId: "877232787276",
    appId: "1:877232787276:web:fbdb89ee4f41dec1f189e9",
    measurementId: "G-Q8NPDSD8HE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
