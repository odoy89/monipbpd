import { useRouter } from "next/router";

export default function Detail() {
  const router = useRouter();

  return (
    <div style={{ padding: 20 }}>
      <h2>Detail Surat</h2>
      <p>No: {router.query.no}</p>
    </div>
  );
}
