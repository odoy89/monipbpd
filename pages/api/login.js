export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const response = await fetch(process.env.APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        username: body.username,
        password: body.password
      })
    });

    const data = await response.json();

    console.log("APPSCRIPT_URL =", process.env.APPSCRIPT_URL);   // 🔴 DEBUG

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Login API error"
    });
  }
}


