export default async function handler(req, res) {
  try {
    const r = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getTarifList" })
    });

    const text = await r.text();

    // ⛔ APPS SCRIPT BALIK HTML / ERROR
    if (text.startsWith("<")) {
      return res.status(500).json({});
    }

    const json = JSON.parse(text);

    // ⛔ SALAH FORMAT
    if (json.status === "error") {
      return res.status(200).json({});
    }

    // ✅ BENAR
    return res.status(200).json(json);

  } catch {
    return res.status(200).json({});
  }
}

