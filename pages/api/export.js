export default async function handler(req, res) {
  try {
    const resp = await fetch(process.env.APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "export",
        filter: req.body?.filter || {}
      })
    });

    const json = await resp.json();

    if (json.status !== "ok" || !json.url) {
      return res.status(500).json({ message: "Export gagal" });
    }

    // 🔥 REDIRECT LANGSUNG KE FILE XLSX VALID
    return res.status(200).json({ url: json.url });

  } catch (err) {
    return res.status(500).json({ message: String(err) });
  }
}
