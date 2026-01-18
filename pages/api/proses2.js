export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const payload = req.body;

    if (!payload || !payload.action) {
      return res.status(400).json({
        status: "error",
        message: "Payload kosong / action tidak ada"
      });
    }

    const resp = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();

    res.status(200).send(text);

  } catch (err) {
    console.error("API PROSES2 ERROR:", err);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}
