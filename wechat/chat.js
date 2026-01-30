import { db } from "./firebase.js";
import {
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const uid = localStorage.getItem("uid");
const username = localStorage.getItem("username");

window.sendMessage = () => {
  const msg = document.getElementById("msg").value;
  if (!msg) return;

  push(ref(db, "messages"), {
    uid,
    username,
    text: msg,
    time: Date.now()
  });

  document.getElementById("msg").value = "";
};

onChildAdded(ref(db, "messages"), (snap) => {
  const data = snap.val();
  const div = document.createElement("div");
  div.innerHTML = `<b>${data.username || "User"}:</b> ${data.text}`;
  document.getElementById("messages").appendChild(div);
});
