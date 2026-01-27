import formidable from "formidable";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable();

  form.parse(req, async () => {
    return res.status(200).json({ status: "ok" });
  });
}
