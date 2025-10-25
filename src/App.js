import React from "react";
import Chat from "./Chat";

export default function App() {
  return (
    <div style={{
      background: "#0a0a0a",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#00ff88" }}>💬 WeChat</h1>
      <Chat />
    </div>
  );
}
