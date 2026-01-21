export default async function handler(req,res){
  try{
    const r = await fetch(process.env.NEXT_PUBLIC_APPSCRIPT_URL,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    if(text.startsWith("<")) throw "HTML";

    res.status(200).json(JSON.parse(text));
  }catch(e){
    res.status(500).json({ status:"error" });
  }
}
