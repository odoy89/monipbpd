export const runtime = "nodejs";

import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    // 🔥 PENTING: dynamic import
    const { default: formidable } = await import("formidable");

    const form = formidable({ multiples: false, keepExtensions: true });
    const [fields, files] = await form.parse(req);

    const fileArr = files.FILE_SURAT;
    const file = Array.isArray(fileArr) ? fileArr[0] : fileArr;

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
      FILE_NAME: file.originalFilename || "surat.pdf",
    };

    const response = await fetch(process.env.APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return res.status(200).json(result);

  } catch (err) {
    console.error("API TAMBAH SURAT ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: err.message || String(err),
    });
  }
}
