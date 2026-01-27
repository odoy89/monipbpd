import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Form parse error"
      });
    }

    try {
      const payload = {
        ...fields,
        action: "saveProses2"
      };

      // jika ada file surat balasan
      if (files.FILE_SURAT_BALASAN) {
        const file = files.FILE_SURAT_BALASAN;
        payload.FILE_SURAT_BALASAN_BASE64 = fs
          .readFileSync(file.filepath)
          .toString("base64");
        payload.FILE_SURAT_BALASAN_NAME = file.originalFilename;
      }

      const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      const json = JSON.parse(text);

      return res.status(200).json(json);

    } catch (e) {
      return res.status(500).json({
        status: "error",
        message: "Gagal memproses data"
      });
    }
  });
}
