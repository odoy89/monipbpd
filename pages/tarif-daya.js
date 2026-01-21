import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function TarifDayaPage() {
  const [data, setData] = useState([]);
  const [tarif, setTarif] = useState("");
  const [daya, setDaya] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [popup, setPopup] = useState("");

  function showPopup(msg){
    setPopup(msg);
    setTimeout(()=>setPopup(""),2000);
  }

  function loadData(){
    fetch("/api/tarif-daya-crud", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ action:"getTarifDayaCrud" })
    })
      .then(r=>r.json())
      .then(res=>{
        if(res.status==="ok") setData(res.data);
      });
  }

  useEffect(loadData, []);

  function save(){
    fetch("/api/tarif-daya-crud", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        action:"saveTarifDaya",
        ROW: editRow,
        TARIF: tarif,
        DAYA: daya
      })
    })
      .then(r=>r.json())
      .then(res=>{
        if(res.status==="ok"){
          showPopup(editRow ? "Tarif Daya diupdate" : "Tarif Daya ditambahkan");
          setTarif("");
          setDaya("");
          setEditRow(null);
          loadData();
        } else alert(res.message);
      });
  }

  function hapus(row){
    if(!confirm("Hapus tarif daya ini?")) return;

    fetch("/api/tarif-daya-crud", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        action:"deleteTarifDaya",
        ROW: row
      })
    })
      .then(r=>r.json())
      .then(res=>{
        if(res.status==="ok"){
          showPopup("Tarif Daya dihapus");
          loadData();
        }
      });
  }

  return (
    <Layout>
      <h2>Tarif Daya</h2>

      {/* FORM */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input
          placeholder="Tarif (R1/B2 dll)"
          value={tarif}
          onChange={e=>setTarif(e.target.value)}
        />
        <input
          placeholder="Daya (VA)"
          value={daya}
          onChange={e=>setDaya(e.target.value)}
        />
        <button className="btn-primary" onClick={save}>
          {editRow ? "Update" : "Tambah"}
        </button>

        {editRow && (
          <button className="btn-ghost" onClick={()=>{
            setEditRow(null);
            setTarif("");
            setDaya("");
          }}>
            Batal
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="table-scroll">
        <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tarif</th>
            <th>Daya</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d,i)=>(
            <tr key={d.ROW}>
              <td>{i+1}</td>
              <td>{d.TARIF}</td>
              <td>{d.DAYA}</td>
              <td>
                <div style={{ display:"flex", gap:6 }}>
                  <button className="btn-edit" onClick={()=>{
                    setTarif(d.TARIF);
                    setDaya(d.DAYA);
                    setEditRow(d.ROW);
                  }}>
                    Edit
                  </button>
                  <button className="btn-hapus" onClick={()=>hapus(d.ROW)}>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>

      {popup && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth:300, textAlign:"center" }}>
            <b>{popup}</b>
          </div>
        </div>
      )}
    </Layout>
  );
}
