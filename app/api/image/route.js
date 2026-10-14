export async function POST(req){
  try{
    const {prompt} = await req.json();
    if(!prompt) return Response.json({error:"No prompt"}, {status:400});
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random()*10000)}`;
    return Response.json({imageUrl: url, prompt});
  }catch(e){
    return Response.json({error:e.message}, {status:500});
  }
}
