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
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024 // ✅ 20 MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("FORM PARSE ERROR:", err);
        return res.status(400).json({
          status: "error",
          message: "Gagal parsing form"
        });
      }

      if (!fields.action) {
        return res.status(400).json({
          status: "error",
          message: "Action tidak ditemukan"
        });
      }

      const payload = { ...fields };

      // ===== FILE PDF =====
      if (files.FILE_SURAT) {
        const buffer = fs.readFileSync(files.FILE_SURAT.filepath);
        payload.FILE_BASE64 = buffer.toString("base64");
        payload.FILE_NAME = files.FILE_SURAT.originalFilename;
      }

      const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL;
      if (!APPSCRIPT_URL) {
        return res.status(500).json({
          status: "error",
          message: "ENV APPSCRIPT URL belum diset"
        });
      }

      const response = await fetch(APPSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      return res.status(200).send(text);
    });

  } catch (e) {
    console.error("API ERROR:", e);
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
}
