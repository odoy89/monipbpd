
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const payload = {
      action: "saveProses2",

      NO: fields.NO?.[0],
      KATEGORI: fields.KATEGORI?.[0],
      ULP: fields.ULP?.[0],

      POTENSI_PELANGGAN: fields.POTENSI_PELANGGAN?.[0],
      RUMAH_SELESAI_DIBANGUN: fields.RUMAH_SELESAI_DIBANGUN?.[0],

      TARIF_LAMA: fields.TARIF_LAMA?.[0] || "",
      DAYA_LAMA: fields.DAYA_LAMA?.[0] || "",
      TARIF_BARU: fields.TARIF_BARU?.[0] || "",
      DAYA_BARU: fields.DAYA_BARU?.[0] || "",

      DELTA_VA: fields.DELTA_VA?.[0] || "",
      NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3:
        fields.NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3?.[0] || "",

      TELEPON_PELANGGAN: fields.TELEPON_PELANGGAN?.[0] || "",

      SURVEY: fields.SURVEY?.[0] === "YA",
      TRAFO: fields.TRAFO?.[0] || "",
      JTM: fields.JTM?.[0] || "",
      JTR: fields.JTR?.[0] || "",

      NODIN_KE_REN: fields.NODIN_KE_REN?.[0] === "YA",
    };

    /* ===== FILE SURAT BALASAN ===== */
    const fileArr = files.FILE_SURAT_BALASAN;
    const file = Array.isArray(fileArr) ? fileArr[0] : fileArr;

    if (file?.filepath) {
      const buffer = fs.readFileSync(file.filepath);
      payload.FILE_SURAT_BALASAN_BASE64 = buffer.toString("base64");
      payload.FILE_SURAT_BALASAN_NAME = file.originalFilename;
      payload.SURAT_BALASAN = true;
    } else {
      payload.SURAT_BALASAN = false;
    }

    const response = await fetch(process.env.APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    return res.status(200).json(json);

  } catch (err) {
    console.error("PROSES2 ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: String(err),
    });
  }
}

