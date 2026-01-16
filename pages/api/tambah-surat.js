import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error" });
  }

  try {
    const form = formidable({ keepExtensions: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // 🔥 INI KUNCI
    const file = files.file; // HARUS "file"

    if (!file || !file.filepath) {
      return res.status(400).json({
        status: "error",
        message: "File PDF wajib diupload",
      });
    }

    const buffer = fs.readFileSync(file.filepath);

    const payload = {
      action: "create",
      NAMA_PELANGGAN: fields.NAMA_PELANGGAN?.[0] || "",
      JENIS_TRANSAKSI: fields.JENIS_TRANSAKSI?.[0] || "",
      TANGGAL_SURAT: fields.TANGGAL_SURAT?.[0] || "",
      TANGGAL_TERIMA_SURAT: fields.TANGGAL_TERIMA_SURAT?.[0] || "",
      FILE_BASE64: buffer.toString("base64"),
      FILE_NAME: file.originalFilename,
    };

    const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return res.status(200).json(result);

  } catch (err) {
    console.error("TAMBAH SURAT ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: String(err),
    });
  }
}
