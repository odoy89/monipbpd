export default async function handler(req, res) {
  try {
    const r = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ping" }),
    });

    const text = await r.text(); // 🔥 PENTING
    console.log("RAW RESPONSE FROM APPS SCRIPT:", text);

    return res.status(200).json({
      ok: true,
      raw: text.substring(0, 300)
    });

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: String(e)
    });
  }
}
