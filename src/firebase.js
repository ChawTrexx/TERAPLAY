import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyALvB7xgYjhBZi5y2JSBamDysNdgIm2mEo",
  authDomain: "wechat-54b07.firebaseapp.com",
  projectId: "wechat-54b07",
  storageBucket: "wechat-54b07.appspot.com",
  messagingSenderId: "221397223557",
  appId: "1:221397223557:web:40703bc5c13dc1b2ab81ec",
  measurementId: "G-XJRYS6DHLR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
