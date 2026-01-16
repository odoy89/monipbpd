export default async function handler(req, res) {
  try {
    const resp = await fetch(process.env.APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "dashboard",
        filters: req.body?.filters || {}
      })
    });

    const text = await resp.text();

    // ⛔ PENTING: kalau HTML, stop
    if (text.startsWith("<")) {
      console.error("APPS SCRIPT BALIK HTML:", text.slice(0, 100));
      return res.status(500).json({
        status: "error",
        message: "Apps Script tidak mengembalikan JSON"
      });
    }

    const json = JSON.parse(text);
    res.status(200).json(json);

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: String(err)
    });
  }
}
