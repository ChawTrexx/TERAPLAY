import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, push, onChildAdded, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let myNumber = null;
let otherNumber = prompt("Enter number to chat");

onAuthStateChanged(auth, async user => {
  const snap = await (await fetch(
    `https://wechat-54b07-default-rtdb.firebaseio.com/users/${user.uid}.json`
  )).json();

  myNumber = snap.virtual_number;
  document.getElementById("chatWith").innerText = otherNumber;
  listenMessages();
});

function chatId() {
  return [myNumber, otherNumber].sort().join("_");
}

window.sendMsg = () => {
  const text = msg.value;
  push(ref(db, "chats/" + chatId() + "/messages"), {
    from: myNumber,
    text,
    time: Date.now()
  });
  msg.value = "";
};

function listenMessages() {
  onChildAdded(ref(db, "chats/" + chatId() + "/messages"), snap => {
    const d = snap.val();
    const div = document.createElement("div");
    div.className = "msg " + (d.from == myNumber ? "me" : "other");
    div.innerText = d.text;
    messages.appendChild(div);
  });
}

window.startCall = (type) => {
  const callId = Date.now();
  set(ref(db, "calls/" + callId), {
    caller: myNumber,
    receiver: otherNumber,
    type,
    status: "calling"
  });
  alert(type.toUpperCase() + " call started");
};
