import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY9W9oBKNI1ILHwhfxeM0ECivxzJTsCGA",
  authDomain: "saleslda.firebaseapp.com",
  projectId: "saleslda",
  storageBucket: "saleslda.firebasestorage.app",
  messagingSenderId: "316553640008",
  appId: "1:316553640008:web:c41bd6af67dea7530b407d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);