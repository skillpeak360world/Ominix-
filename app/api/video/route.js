export async function POST(req){
  try{
    const {prompt} = await req.json();
    // Using Pollinations image as video frame for now - free and instant
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " cinematic video frame, motion blur")}?width=1024&height=576&nologo=true&seed=${Math.floor(Math.random()*10000)}`;
    return Response.json({videoUrl: url, prompt, note:"Video preview - for full video add Replicate API key"});
  }catch(e){
    return Response.json({error:e.message}, {status:500});
  }
}
