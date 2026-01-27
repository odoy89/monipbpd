export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  try {
    const payload = req.body;

    if (!payload?.NO) {
      return res.status(400).json({
        status: "error",
        message: "NO tidak ditemukan"
      });
    }

    payload.action = "saveProgres";

    const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    return res.status(200).json(json);

  } catch (err) {
    console.error("API PROGRES ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Gagal koneksi ke AppScript"
    });
  }
}
