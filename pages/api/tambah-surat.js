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
      console.error("FORM PARSE ERROR:", err);
      return res.status(500).json({
        status: "error",
        message: "Form parse error"
      });
    }

    try {
      const payload = {
        action: fields.action,
        NO: fields.NO || "",
        NAMA_PELANGGAN: fields.NAMA_PELANGGAN,
        JENIS_PELANGGAN: fields.JENIS_PELANGGAN,
        JENIS_TRANSAKSI: fields.JENIS_TRANSAKSI,
        TANGGAL_SURAT: fields.TANGGAL_SURAT,
        TANGGAL_TERIMA_SURAT: fields.TANGGAL_TERIMA_SURAT,
        FILE_LAMA: fields.FILE_LAMA || ""
      };

      // kalau ada file PDF
      if (files.FILE_SURAT) {
        const file = files.FILE_SURAT;
        payload.FILE_BASE64 = fs
          .readFileSync(file.filepath)
          .toString("base64");
        payload.FILE_NAME = file.originalFilename;
      }

      const APPSCRIPT_URL = process.env.NEXT_PUBLIC_APPSCRIPT_URL;
      if (!APPSCRIPT_URL) {
        return res.status(500).json({
          status: "error",
          message: "APPSCRIPT URL tidak ditemukan"
        });
      }

      const response = await fetch(APPSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      const json = JSON.parse(text);

      return res.status(200).json(json);

    } catch (e) {
      console.error("API TAMBAH SURAT ERROR:", e);
      return res.status(500).json({
        status: "error",
        message: "Gagal memproses tambah surat"
      });
    }
  });
}
