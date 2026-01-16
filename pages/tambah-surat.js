import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error" });
  }

  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("FORM PARSE ERROR:", err);
        return res.status(500).json({ status: "error", message: err.message });
      }

      console.log("FIELDS:", fields);
      console.log("FILES:", files);

      if (!files.file) {
        return res.status(400).json({ status: "error", message: "File tidak ada" });
      }

      const buffer = fs.readFileSync(files.file.filepath);

      const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          NAMA_PELANGGAN: fields.NAMA_PELANGGAN,
          JENIS_TRANSAKSI: fields.JENIS_TRANSAKSI,
          TANGGAL_SURAT: fields.TANGGAL_SURAT,
          TANGGAL_TERIMA_SURAT: fields.TANGGAL_TERIMA_SURAT,
          FILE_BASE64: buffer.toString("base64"),
          FILE_NAME: files.file.originalFilename,
        }),
      });

      if (!response.ok) {
  return res.status(500).json({
    status: "error",
    message: "Apps Script tidak merespon",
  });
}

const result = await response.json();
return res.status(200).json(result);


    } catch (e) {
      console.error("API ERROR:", e);
      return res.status(500).json({ status: "error", message: e.message });
    }
  });
}
