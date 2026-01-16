import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false, keepExtensions: true });
    const [fields, files] = await form.parse(req);

    const isEdit = !!fields.NO?.[0];

    const fileArr = files.FILE_SURAT;
    const file = Array.isArray(fileArr) ? fileArr[0] : fileArr;
    const fileLama = fields.FILE_LAMA?.[0] || "";

    // ❗ CREATE wajib file
    if (!isEdit && (!file || !file.filepath)) {
      return res.status(400).json({
        status: "error",
        message: "File PDF wajib diupload",
      });
    }

    let fileBase64 = "";
    let fileName = "";

    // jika upload file baru
    if (file && file.filepath) {
      const buffer = fs.readFileSync(file.filepath);
      fileBase64 = buffer.toString("base64");
      fileName = file.originalFilename || "surat.pdf";
    }

    const payload = {
      action: isEdit ? "update" : "create",
      NO: fields.NO?.[0] || "",

      NAMA_PELANGGAN: fields.NAMA_PELANGGAN?.[0] || "",
      JENIS_TRANSAKSI: fields.JENIS_TRANSAKSI?.[0] || "",
      TANGGAL_SURAT: fields.TANGGAL_SURAT?.[0] || "",
      TANGGAL_TERIMA_SURAT: fields.TANGGAL_TERIMA_SURAT?.[0] || "",

      FILE_BASE64: fileBase64,
      FILE_NAME: fileName,
      FILE_LAMA: fileLama,
    };

    const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
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
      message: err.message || "Server error",
    });
  }
}
