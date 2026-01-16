import { useState } from "react";

export default function TambahSurat() {
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const res = await fetch("/api/tambah-surat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal upload");
      } else {
        alert("Berhasil disimpan");
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
      <input name="NAMA_PELANGGAN" placeholder="Nama Pelanggan" required />
      <input name="JENIS_TRANSAKSI" required />
      <input type="date" name="TANGGAL_SURAT" required />
      <input type="date" name="TANGGAL_TERIMA_SURAT" required />
      <input type="file" name="file" accept="application/pdf" required />

      <button type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Simpan"}
      </button>
    </form>
  );
}
