// pages/api/users.js
export default async function handler(req, res) {
  try {
    const upstream = await fetch("http://localhost:8080/users");
    const ct = upstream.headers.get("content-type") || "";
    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({ error: text.slice(0,500), contentType: ct });
    }
    if (ct.includes("text/html")) {
      const text = await upstream.text();
      return res.status(502).json({ error: "Upstream returned HTML", bodySnippet: text.slice(0,1000) });
    }
    const json = await upstream.json();
    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
