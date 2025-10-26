import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 🔹 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_IGhhpYGsJDy1M9VPH-NXY561BF31mgg",
  authDomain: "wechat-eee4d.firebaseapp.com",
  projectId: "wechat-eee4d",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Create peer connection
const servers = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };
const pc = new RTCPeerConnection(servers);
const remoteAudio = document.getElementById('remoteAudio');

// 🔹 On receiving audio
pc.ontrack = (event) => {
  remoteAudio.srcObject = event.streams[0];
};

// 🔹 Capture mic
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
});

// 🔹 Create call
document.getElementById('create').onclick = async () => {
  const callDoc = doc(collection(db, "calls"));
  const offerCandidates = collection(callDoc, "offerCandidates");
  const answerCandidates = collection(callDoc, "answerCandidates");

  pc.onicecandidate = e => e.candidate && setDoc(doc(offerCandidates), e.candidate.toJSON());

  const offerDesc = await pc.createOffer();
  await pc.setLocalDescription(offerDesc);

  await setDoc(callDoc, { offer: offerDesc });

  alert(`Call ID: ${callDoc.id}`);

  onSnapshot(callDoc, async snapshot => {
    const data = snapshot.data();
    if (data?.answer && !pc.currentRemoteDescription) {
      const answerDesc = new RTCSessionDescription(data.answer);
      await pc.setRemoteDescription(answerDesc);
    }
  });

  onSnapshot(answerCandidates, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });
};

// 🔹 Join call
document.getElementById('join').onclick = async () => {
  const callId = document.getElementById('callId').value;
  const callDoc = doc(db, "calls", callId);
  const offerCandidates = collection(callDoc, "offerCandidates");
  const answerCandidates = collection(callDoc, "answerCandidates");

  pc.onicecandidate = e => e.candidate && setDoc(doc(answerCandidates), e.candidate.toJSON());

  const callData = (await getDoc(callDoc)).data();
  await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

  const answerDesc = await pc.createAnswer();
  await pc.setLocalDescription(answerDesc);

  await setDoc(callDoc, { answer: answerDesc }, { merge: true });

  onSnapshot(offerCandidates, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        pc.addIceCandidate(candidate);
      }
    });
  });
};
