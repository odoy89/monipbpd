export default async function handler(req, res) {
  try {
    const body = req.body || {};

    const resp = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await resp.text();

    if (text.startsWith("<")) {
      return res.status(500).json({
        status: "error",
        message: "Apps Script balas HTML"
      });
    }

    const json = JSON.parse(text);

    // 🔥 FIX KRITIS DI SINI
    if (Array.isArray(json)) {
      return res.status(200).json({
        status: "ok",
        vendors: json.map(v => ({
          nama: v.NAMA_VENDOR || v.nama,
          kontak: v.NO_TLPN || v.kontak || ""
        }))
      });
    }

    // kalau sudah rapi
    if (json.vendors) {
      return res.status(200).json(json);
    }

    // fallback
    res.status(200).json(json);

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: String(err)
    });
  }
}
