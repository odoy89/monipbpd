export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  try {
    // pastikan body object (client mengirim JSON)
    const payload =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    if (!payload?.action) {
      return res.status(400).json({
        status: "error",
        message: "Action tidak ditemukan"
      });
    }

    const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL;
    if (!APPSCRIPT_URL) {
      console.error("ENV MISSING: NEXT_PUBLIC_APPSCRIPT_URL");
      return res.status(500).json({
        status: "error",
        message: "Server config error: APPSCRIPT URL tidak ditemukan"
      });
    }

    // forward ke Apps Script
    const response = await fetch(APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // jika AppScript merespon non-JSON atau error status, tangani
    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON from AppScript:", text);
      return res.status(502).json({
        status: "error",
        message: "Invalid response from AppScript",
        raw: text
      });
    }

    // sukses
    return res.status(200).json(result);

  } catch (err) {
    console.error("API TAMBAH SURAT ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Gagal koneksi ke AppScript"
    });
  }
}
