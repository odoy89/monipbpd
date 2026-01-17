async function submitProses2(data, file) {
  const formData = new FormData();

  formData.append("action", "saveProses2");
  formData.append("NO", data.NO);
  formData.append("KATEGORI", data.KATEGORI);
  formData.append("ULP", data.ULP);
  formData.append("POTENSI_PELANGGAN", data.POTENSI_PELANGGAN);
  formData.append("RUMAH_SELESAI_DIBANGUN", data.RUMAH_SELESAI_DIBANGUN);
  formData.append("SURVEY", data.SURVEY ? "YA" : "TIDAK");

  if (file) {
    formData.append("FILE_SURAT_BALASAN", file);
  }

  const res = await fetch(
    process.env.NEXT_PUBLIC_APPSCRIPT_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  return await res.json();
}
