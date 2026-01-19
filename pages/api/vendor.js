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
      return res.status(500).json({ status: "error", message: "HTML response" });
    }

    const json = JSON.parse(text);

    // 🔥 JIKA REQUEST LIST VENDOR
    if (body.action === "getVendorList") {
      const list = Array.isArray(json) ? json : [];

      return res.status(200).json({
        status: "ok",
        vendors: list.map(v => ({
          nama: v.NAMA_VENDOR,
          kontak: v.NO_TLPN
        }))
      });
    }

    // 🔥 DEFAULT (SAVE / DELETE / DLL)
    return res.status(200).json(json);

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: String(err)
    });
  }
}
