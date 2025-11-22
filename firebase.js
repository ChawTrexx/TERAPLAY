// firebase.js - initialize Firebase and export db
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBEo_4YpF_vLH8WtacVKU2YC1BaoIZ7TtI",
  authDomain: "videohosting-13776.firebaseapp.com",
  databaseURL: "https://videohosting-13776-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "videohosting-13776",
  storageBucket: "videohosting-13776.firebasestorage.app",
  messagingSenderId: "992909501546",
  appId: "1:992909501546:web:3728b48ec4727a5679d613",
  measurementId: "G-Q0YQVS6QJ6"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
