import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔑 Replace with your keys (you already shared them)
const SUPABASE_URL = "https://pdhoakfzsmzcwqfixqip.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkaG9ha2Z6c216Y3dxZml4cWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDA0MzgsImV4cCI6MjA4NzUxNjQzOH0.4byhSa2mx-oxrFf23QfbWdcihnE3N5_R3VIRzb-Arpc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Logged-in user (for demo we’ll do anon sign-in)
let currentUser;

// 🚀 Simple anonymous login
async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "demo@supa.com",
    password: "demo1234"
  });

  if (error) {
    console.error("Login error:", error.message);
    return;
  }

  currentUser = data.user;
  loadMessages();
  listenRealtime();
}
signInAnonymously();

// 🧠 Load chat history
async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Load messages error:", error.message);
    return;
  }

  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML = "";

  data.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + (m.sender_id === currentUser.id ? "me" : "other");
    div.textContent = m.message;
    chatDiv.appendChild(div);
  });
}

// 📨 Send message
window.sendMessage = async () => {
  const text = document.getElementById("msg").value;
  if (!text) return;

  const { error } = await supabase.from("messages").insert([{
    sender_id: currentUser.id,
    receiver_id: currentUser.id, // demo, same user
    message: text
  }]);

  if (error) {
    console.error("Send msg error:", error.message);
    return;
  }

  document.getElementById("msg").value = "";
};

// ⚡ Realtime subscription
function listenRealtime() {
  supabase
    .channel("chat")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      () => {
        loadMessages();
      }
    )
    .subscribe();
}
