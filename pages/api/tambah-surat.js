import formidable from "formidable";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error" });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ status: "error" });
    }

    // ⬇️ teruskan ke Apps Script / proses drive
    return res.status(200).json({ status: "ok" });
  });
}
