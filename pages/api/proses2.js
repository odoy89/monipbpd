export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status:"error" });
  }

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_APPSCRIPT_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      }
    );

    const json = await response.json();
    res.status(200).json(json);

  } catch {
    res.status(500).json({
      status:"error",
      message:"Gagal koneksi ke AppScript"
    });
  }
}
