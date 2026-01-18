export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  try {
    let payload;

    // 🔑 DETEKSI FORMDATA vs JSON
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      payload = req.body; // biarkan langsung
    } else {
      payload =
        typeof req.body === "string"
          ? JSON.parse(req.body)
          : req.body;
    }

    const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL;
    if (!APPSCRIPT_URL) {
      return res.status(500).json({
        status: "error",
        message: "APPSCRIPT URL belum diset"
      });
    }

    const response = await fetch(APPSCRIPT_URL, {
      method: "POST",
      body:
        payload instanceof FormData
          ? payload
          : JSON.stringify(payload),
      headers:
        payload instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      return res.status(502).json({
        status: "error",
        message: "Response AppScript tidak valid",
        raw: text
      });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error("API PROSES2 ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Gagal koneksi ke AppScript"
    });
  }
}
