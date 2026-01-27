import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error" });
  }

  try {
    const form = new formidable.IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ status: "error", message: err.message });
      }

      const payload = { ...fields };

      if (files.FILE_SURAT) {
        const buffer = fs.readFileSync(files.FILE_SURAT.filepath);
        payload.FILE_BASE64 = buffer.toString("base64");
        payload.FILE_NAME = files.FILE_SURAT.originalFilename;
      }

      const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      return res.status(200).json(json);
    });

  } catch (e) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
}
