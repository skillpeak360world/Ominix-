export async function POST(req){
  try{
    const {query="AI jobs"} = await req.json();
    const tavilyKey = process.env.TAVILY_API_KEY;

    if(tavilyKey){
      const r = await fetch("https://api.tavily.com/search", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({api_key:tavilyKey, query:`remote ${query} jobs 2026`, max_results:8})
      });
      const d = await r.json();
      return Response.json({jobs: d.results || []});
    } else {
      // fallback mock jobs if no key
      return Response.json({jobs:[
        {title:"Remote AI Engineer", url:"https://remoteok.com", content:"Work with OMINIX team"},
        {title:"Prompt Engineer", url:"https://weworkremotely.com", content:"AI prompting"},
        {title:"AI Content Creator", url:"https://linkedin.com/jobs", content:"Create with AI"}
      ]});
    }
  }catch(e){
    return Response.json({error:e.message}, {status:500});
  }
}
