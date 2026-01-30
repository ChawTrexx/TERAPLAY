import { auth, provider, db } from "./firebase.js";
import {
  signInWithPopup,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  ref,
  get,
  set,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* 🔵 GOOGLE LOGIN */
window.googleLogin = async () => {
  const res = await signInWithPopup(auth, provider);
  const user = res.user;
  const uid = user.uid;

  const userRef = ref(db, "users/" + uid);
  const snap = await get(userRef);

  if (!snap.exists()) {
    const counterRef = ref(db, "meta/last_number");
    const counterSnap = await get(counterRef);

    let number = 7896291000;
    if (counterSnap.exists()) {
      number = counterSnap.val() + 1;
      await set(counterRef, number);
    } else {
      await set(counterRef, number);
    }

    await set(userRef, {
      name: user.displayName,
      virtual_number: number,
      online: true,
      createdAt: Date.now()
    });
  } else {
    await update(userRef, { online: true });
  }

  localStorage.setItem("uid", uid);
  location.href = "chat.html";
};

/* 🟢 GUEST LOGIN */
window.guestLogin = async () => {
  const username = document.getElementById("username").value;
  if (!username) return alert("Username required");

  const res = await signInAnonymously(auth);
  const uid = res.user.uid;

  await set(ref(db, "users/" + uid), {
    name: username,
    guest: true,
    createdAt: Date.now()
  });

  localStorage.setItem("uid", uid);
  localStorage.setItem("username", username);

  location.href = "chat.html";
};
