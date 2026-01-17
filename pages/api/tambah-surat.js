export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const formData = await new Promise((resolve, reject) => {
      const data = {};
      const files = {};

      const busboy = require("busboy");
      const bb = busboy({ headers: req.headers });

      bb.on("field", (name, val) => {
        data[name] = val;
      });

      bb.on("file", (name, file, info) => {
        const chunks = [];
        file.on("data", d => chunks.push(d));
        file.on("end", () => {
          files[name] = {
            buffer: Buffer.concat(chunks),
            filename: info.filename
          };
        });
      });

      bb.on("finish", () => resolve({ data, files }));
      bb.on("error", reject);

      req.pipe(bb);
    });

    const payload = {
      action: formData.data.action || "create",
      NO: formData.data.NO || "",
      NAMA_PELANGGAN: formData.data.NAMA_PELANGGAN,
      JENIS_TRANSAKSI: formData.data.JENIS_TRANSAKSI,
      TANGGAL_SURAT: formData.data.TANGGAL_SURAT,
      TANGGAL_TERIMA_SURAT: formData.data.TANGGAL_TERIMA_SURAT,
      FILE_BASE64: formData.files.FILE_SURAT
        ? formData.files.FILE_SURAT.buffer.toString("base64")
        : "",
      FILE_NAME: formData.files.FILE_SURAT?.filename || "",
      FILE_LAMA: formData.data.FILE_LAMA || ""
    };

    const r = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await r.json();
    return res.status(200).json(json);

  } catch (e) {
    console.error("TAMBAH SURAT ERROR:", e);
    return res.status(500).json({
      status: "error",
      message: e.message
    });
  }
}
