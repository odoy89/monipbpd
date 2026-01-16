export default async function handler(req, res) {
  const { NO, VENDOR, KONTAK_VENDOR } = req.body;

  const r = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "saveVendor",
      NO,
      VENDOR,
      KONTAK_VENDOR
    })
  });

  const data = await r.json();
  res.status(200).json(data);
}
