
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  try {
    const payload =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    if (!payload?.action || payload.action !== "saveProses2") {
      return res.status(400).json({
        status: "error",
        message: "Action tidak valid"
      });
    }

    const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL;

    if (!APPSCRIPT_URL) {
      console.error("ENV ERROR: NEXT_PUBLIC_APPSCRIPT_URL tidak ada");
      return res.status(500).json({
        status: "error",
        message: "Server config error"
      });
    }

    const response = await fetch(APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("AppScript balikin non-JSON:", text);
      return res.status(502).json({
        status: "error",
        message: "Invalid response from AppScript",
        raw: text
      });
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error("API /proses2 ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Gagal koneksi ke AppScript"
    });
  }
}
