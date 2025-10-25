import React, { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { ref, push, onValue, serverTimestamp } from "firebase/database";

export default function Chat() {
  const [name] = useState("User_" + Math.floor(Math.random() * 10000));
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef();

  useEffect(() => {
    // ask for notification permission once
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const msgRef = ref(db, "messages");
    onValue(msgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.values(data);
      // Detect new message and show notification (only when page open)
      if (messagesRef.current && arr.length > messagesRef.current.length) {
        const latest = arr[arr.length - 1];
        if (latest.name !== name && Notification.permission === "granted") {
          try {
            new Notification("💬 New message from " + latest.name, {
              body: latest.text,
              icon: "/icon-192.png"
            });
          } catch (e) {
            console.error('Notification error', e);
          }
        }
      }
      messagesRef.current = arr;
      setMessages(arr);
    });
  }, [name]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msgRef = ref(db, "messages");
    push(msgRef, {
      name,
      text,
      time: new Date().toLocaleTimeString()
    });
    setText("");
  };

  return (
    <div style={{
      width: "90%",
      maxWidth: "420px",
      background: "#1c1c1c",
      borderRadius: "12px",
      padding: "15px",
      boxShadow: "0 0 15px #00ff88"
    }}>
      <div style={{
        height: "60vh",
        overflowY: "auto",
        marginBottom: "10px",
        paddingRight: "6px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: "8px",
            background: msg.name && msg.name.startsWith('User_') && msg.name === name ? "#00ff8855" : "#333",
            padding: "8px",
            borderRadius: "8px"
          }}>
            <strong>{msg.name}</strong>: {msg.text}
            <div style={{ fontSize: "10px", color: "#aaa" }}>{msg.time}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "6px",
            border: "none",
            outline: "none"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "8px",
            background: "#00ff88",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
