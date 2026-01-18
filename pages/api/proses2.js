export default async function handler(req, res) {
  try {
    const resp = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await resp.text();
    res.status(200).send(text);

  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
}
