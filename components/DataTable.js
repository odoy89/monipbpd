export default function DataTable({
  data = [],
  role,
  onDetail,
  onEdit,
  onDelete,
  onProses,
  onVendor,
  onProgress,
  onFoto
}) {
  return (
    <div className="table-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
    <th>Jenis Pelanggan</th>
            <th>Jenis</th>
            <th>Tgl Surat</th>
            <th>Tgl Terima</th>
            <th>File</th>
            <th>Progres</th>
            <th>Tgl Nyala</th>
            <th>Durasi</th>
            <th>Status</th>
            <th style={{ minWidth: 240 }}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={11} style={{ textAlign: "center", padding: 20 }}>
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((d, i) => {
              const STATUS = String(d.STATUS || "")
                .toUpperCase()
                .trim();

              // ✅ KUNCI ALUR VENDOR (BENAR)
              const HAS_VENDOR = Boolean(
                d.VENDOR && String(d.VENDOR).trim() !== ""
              );

              return (
                <tr key={d.NO || i}>
                  <td>{i + 1}</td>
                  <td>{d.NAMA_PELANGGAN}</td>
                     <td>{d.JENIS_PELANGGAN || "-"}</td>
                  <td>{d.JENIS_TRANSAKSI}</td>
                  <td>{d.TANGGAL_SURAT}</td>
                  <td>{d.TANGGAL_TERIMA_SURAT}</td>

                  <td>
                    {d.FILE_SURAT ? (
                      <a href={d.FILE_SURAT} target="_blank" rel="noreferrer">
                        Download
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
  <span style={{ fontWeight: 700, color: "#2563eb" }}>
    {d.PROGRES_PEKERJAAN || "-"}
  </span>
</td>


                  <td>
  {d.TANGGAL_NYALA ? (
    <span style={{ fontWeight: 700, color: "#16a34a" }}>
      {d.TANGGAL_NYALA}
    </span>
  ) : "-"}
</td>

                  <td>
  {d.DURASI ? (
    <span style={{
      fontWeight: 700,
      color: d.DURASI > 7 ? "#dc2626" : "#f59e0b"
    }}>
      {d.DURASI} Hari
    </span>
  ) : "-"}
</td>


                  <td>
                    <span className={`badge ${STATUS.toLowerCase()}`}>
                      {STATUS}
                    </span>
                  </td>

                  <td>
                    <div
                      className="aksi"
                      style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                    >
                      {(d.EVIDEN_1 || d.EVIDEN_2) && (
                        <button
                          className="btn-info"
                          onClick={() => onFoto(d)}
                        >
                          Foto
                        </button>
                      )}

                      <button
                        className="btn-detail"
                        onClick={() => onDetail(d)}
                      >
                        Detail
                      </button>

                      {STATUS !== "SELESAI" && (
                        <button
                          className="btn-edit"
                          onClick={() => onEdit(d)}
                        >
                          Edit
                        </button>
                      )}

                      {/* ===== ALUR RESMI ===== */}

                      {/* 1️⃣ MENUNGGU → PROSES */}
                      {STATUS === "MENUNGGU" && (
                        <button
                          className="btn-lanjut"
                          onClick={() => onProses(d)}
                        >
                          Lanjut Proses
                        </button>
                      )}

                      {/* 2️⃣ PROGRES + BELUM ADA VENDOR */}
                      {STATUS === "PROGRES" && !HAS_VENDOR && (
                       <button
  className="btn-warning"
  onClick={() => onVendor(d)}
>
  Pilih Vendor
</button>


                      )}

                      {/* 3️⃣ PROGRES + SUDAH ADA VENDOR */}
                      {STATUS === "PROGRES" && HAS_VENDOR && (
                        <button
                          className="btn-lanjut"
                          onClick={() => onProgress(d)}
                        >
                          Lanjut Progres Pekerjaan
                        </button>
                      )}

                      {role === "ADMIN" && (
                        <button
                          className="btn-hapus"
                          onClick={() => onDelete(d)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}






