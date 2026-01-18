export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        status: "error",
        message: "Response AppScript bukan JSON",
        raw: text
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("PROSES2 API ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Gagal koneksi ke AppScript"
    });
  }
}
