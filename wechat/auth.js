import { auth, provider, db } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
      await update(ref(db, "meta"), { last_number: number });
    } else {
      await set(counterRef, number);
    }

    await set(userRef, {
      name: user.displayName,
      virtual_number: number,
      online: true
    });
  } else {
    await update(userRef, { online: true });
  }

  location.href = "app.html";
};
