// api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { link } = await req.json();
      if (!link) return res.status(400).json({ error: "No link provided" });

      const apiRes = await fetch("https://tboxdownloader.in/tbox/basic/v2/tbox_v2.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link })
      });

      const data = await apiRes.json();
      res.status(200).json(data);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch file" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
