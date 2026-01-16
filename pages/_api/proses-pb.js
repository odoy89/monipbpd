import formidable from "formidable";
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const form = formidable({ keepExtensions: true });
  const [fields, files] = await form.parse(req);

  const response = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "prosesPB",
      ...fields,
      FILE_BALASAN: files.FILE_BALASAN || null
    })
  });

  const json = await response.json();
  res.status(200).json(json);
}
