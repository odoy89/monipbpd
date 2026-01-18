export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  try {
    const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL;

    if (!APPSCRIPT_URL) {
      console.error("ENV EMPTY");
      return res.status(500).json({
        status: "error",
        message: "APPSCRIPT URL kosong"
      });
    }

    const response = await fetch(APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({
        status: "error",
        message: "Response AppScript bukan JSON",
        raw: text
      });
    }

    return res.status(200).json(json);

  } catch (err) {
    console.error("PROSES2 API ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Gagal koneksi ke AppScript"
    });
  }
}
