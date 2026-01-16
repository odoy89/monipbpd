export default function DetailModal({ open, data, onClose }) {
  if (!open || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: 600 }}>
        <h3 className="modal-title">Detail Data</h3>

        <div className="modal-form" style={{ display: "grid", gap: 6 }}>
          <div><b>No:</b> {data.NO}</div>
          <div><b>Kategori:</b> {data.KATEGORI || "-"}</div>
          <div><b>Nama Pelanggan:</b> {data.NAMA_PELANGGAN}</div>
          <div><b>Telpon Pelanggan:</b> {data.TELEPON_PELANGGAN || "-"}</div>
          
          <div><b>Jenis Transaksi:</b> {data.JENIS_TRANSAKSI}</div>

          <div><b>Tanggal Surat:</b> {data.TANGGAL_SURAT || "-"}</div>
          <div><b>Tanggal Terima:</b> {data.TANGGAL_TERIMA_SURAT || "-"}</div>

          <div><b>ULP:</b> {data.ULP || "-"}</div>

          <div><b>Potensi Pelanggan:</b> {data.POTENSI_PELANGGAN || "-"}</div>
          <div><b>Rumah Selesai Dibangun:</b> {data.RUMAH_SELESAI_DIBANGUN || "-"}</div>

          <div><b>Tarif Lama:</b> {data.TARIF_LAMA || "-"}</div>
          <div><b>Daya Lama:</b> {data.DAYA_LAMA || "-"}</div>

          <div><b>Tarif Baru:</b> {data.TARIF_BARU || "-"}</div>
          <div><b>Daya Baru:</b> {data.DAYA_BARU || "-"}</div>

          <div><b>Delta VA:</b> {data.DELTA_VA || "-"}</div>
          <div>
            <b>No Surat Reksis ke UP3:</b>{" "}
            {data.NO_SURAT_PENYAMPAIAN_REKSIS_KE_UP3 || "-"}
          </div>

          <div>
            <b>NODIN ke REN:</b>{" "}
            {data.NODIN_KE_REN ? "YA" : "TIDAK"}
          </div>

          <div><b>Vendor:</b> {data.VENDOR || "-"}</div>
          <div><b>Progres Pekerjaan:</b> {data.PROGRES_PEKERJAAN || "-"}</div>

          {data.EVIDEN_1 && (
  <img
    src={data.EVIDEN_1}
    referrerPolicy="no-referrer"
    style={{ width: "100%", marginTop: 8 }}
  />
)}

{data.EVIDEN_2 && (
  <img
    src={data.EVIDEN_2}
    referrerPolicy="no-referrer"
    style={{ width: "100%", marginTop: 8 }}
  />
)}


          <div><b>Tanggal Nyala:</b> {data.TANGGAL_NYALA || "-"}</div>
          <div>
            <b>Durasi:</b>{" "}
            {data.DURASI ? `${data.DURASI} Hari` : "-"}
          </div>

          <div><b>Status:</b> {data.STATUS}</div>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
