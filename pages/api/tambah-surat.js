import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // 🔥 WAJIB
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Gagal parsing form",
        });
      }

      const file = files.FILE_SURAT;
      if (!file) {
        return res.json({
          status: "error",
          message: "File tidak ditemukan",
        });
      }

      const buffer = fs.readFileSync(file.filepath);
      const base64 = buffer.toString("base64");

      const payload = {
        action: "tambahSurat",
        ...fields,
        FILE_BASE64: base64,
        FILE_NAME: file.originalFilename,
      };

      const resp = await fetch(process.env.APPSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      return res.status(200).json(data);

    } catch (e) {
      console.error(e);
      return res.status(500).json({
        status: "error",
        message: String(e),
      });
    }
  });
}
