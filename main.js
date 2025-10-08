import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

// ✅ Page.js se liya gaya logic (simplified version)
function generateToken(url) {
  // Ye aapke page.js me jo HMAC logic tha uska simplified demo
  // Agar original page.js me full crypto logic hai, usko yahi import kar lo
  return btoa(url).slice(0, 8); // demo token
}

async function fetchStreamUrl(originalUrl) {
  try {
    const token = generateToken(originalUrl);
    const res = await fetch("/api/fetch-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: originalUrl, token, captchaToken: "bypass" }),
    });
    const data = await res.json();
    if (data && data.list && data.list.length > 0) {
      return (
        data.list[0].fast_stream_url ||
        data.list[0].m3u8_url ||
        data.list[0].stream_url ||
        null
      );
    }
    return null;
  } catch (err) {
    console.error("Error fetching stream URL:", err);
    return null;
  }
}

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("q");

    if (!url) {
      setLoading(false);
      setError("No video URL provided in ?q= parameter");
      return;
    }

    const decodedUrl = decodeURIComponent(url);

    async function loadVideo() {
      try {
        setLoading(true);

        // ✅ Fetch video URL via page.js logic
        const streamUrl = await fetchStreamUrl(decodedUrl);
        if (!streamUrl) throw new Error("Stream URL not found");

        setVideoUrl(streamUrl);

        if (Hls.isSupported()) {
          if (hlsRef.current) hlsRef.current.destroy();
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current.play().catch(() => {});
            setLoading(false);
          });
          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS error:", data);
            setError("Video loading failed.");
            setLoading(false);
          });
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
          videoRef.current.src = streamUrl;
          videoRef.current.addEventListener("loadedmetadata", () => {
            videoRef.current.play().catch(() => {});
            setLoading(false);
          });
        } else {
          setError("HLS not supported in this browser.");
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load video.");
        setLoading(false);
      }
    }

    loadVideo();

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {loading && <p className="text-white">Loading video...</p>}
      {error && <p className="text-white">{error}</p>}
      <video
        ref={videoRef}
        controls
        autoPlay
        className="max-w-full max-h-screen"
      />
    </div>
  );
}
