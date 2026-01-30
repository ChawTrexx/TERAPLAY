import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyALvB7xgYjhBZi5y2JSBamDysNdgIm2mEo",
  authDomain: "wechat-54b07.firebaseapp.com",
  databaseURL: "https://wechat-54b07-default-rtdb.firebaseio.com",
  projectId: "wechat-54b07",
  storageBucket: "wechat-54b07.firebasestorage.app",
  messagingSenderId: "221397223557",
  appId: "1:221397223557:web:40703bc5c13dc1b2ab81ec"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);
