export default async function handler(req, res) {
  try {
    const body = req.body || {};

    const resp = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await resp.text();

    // antisipasi Apps Script error HTML
    if (text.startsWith("<")) {
      return res.status(500).json({
        status: "error",
        message: "Apps Script mengembalikan HTML"
      });
    }

    const json = JSON.parse(text);
    res.status(200).json(json);

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: String(err)
    });
  }
}
