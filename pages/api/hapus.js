export default async function handler(req, res) {
  try {
    const response = await fetch(process.env.APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const json = await response.json();
    res.status(200).json(json);

  } catch (e) {
    res.status(500).json({
      status: "error",
      message: String(e)
    });
  }
}
