export async function POST(req){
  try{
    const body = await req.json().catch(()=>({}));
    const question = body.question || "hi";
    const language = body.language || "English";

    const groqKey = process.env.GROQ_API_KEY;
    const tavilyKey = process.env.TAVILY_API_KEY;

    let search = "";
    if(tavilyKey){
      try{
        const r = await fetch("https://api.tavily.com/search",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({api_key:tavilyKey, query: question, max_results:2})
        });
        const d = await r.json();
        if(d.results) search = d.results.map(x=>x.content).join(" ").slice(0,600);
      }catch{}
    }

    if(groqKey){
      try{
        const ai = await fetch("https://api.groq.com/openai/v1/chat/completions",{
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":"Bearer "+groqKey},
          body: JSON.stringify({
            model:"llama-3.1-8b-instant",
            messages:[
              {role:"system", content:`You are OMINIX v4 cinematic AI. Answer in ${language}. Context:${search}`},
              {role:"user", content: question}
            ],
            max_tokens:700
          })
        });
        const j = await ai.json();
        if(j.choices?.[0]?.message?.content){
          return Response.json({answer:j.choices[0].message.content});
        }
      }catch{}
    }

    return Response.json({answer:`Hi, I am OMINIX ✨! You asked: "${question}". I'm replying in ${language}! ${search? "Web says: "+search.slice(0,150) : "Add GROQ_API_KEY for smarter replies, but I AM REPLYING NOW!"}`});

  }catch(e){
    return Response.json({answer:"OMINIX is here! Error: "+e.message});
  }
}
