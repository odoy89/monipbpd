export default async function handler(req, res) {
  try {
    const r = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "tarif" })
    });

    const data = await r.json();

    // 🔥 PENTING: langsung kirim data tarif
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({});
  }
}

