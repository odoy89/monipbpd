import { useState } from "react";

export default function TambahSurat() {
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    formData.append("action", "createSurat");

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_APPSCRIPT_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.status !== "success") {
        alert(data.message || "Gagal simpan");
      } else {
        alert("Surat berhasil disimpan");
        e.target.reset();
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <input name="NAMA_PELANGGAN" required />
      <input name="JENIS_TRANSAKSI" required />
      <input type="date" name="TANGGAL_SURAT" required />
      <input type="date" name="TANGGAL_TERIMA_SURAT" required />
      <input type="file" name="FILE_SURAT" accept="application/pdf" required />

      <button disabled={loading}>
        {loading ? "Mengirim..." : "Simpan"}
      </button>
    </form>
  );
}
